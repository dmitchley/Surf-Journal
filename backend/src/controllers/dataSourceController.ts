import { Request, Response } from 'express';
import axios from 'axios';
import redis, { createClient } from 'redis';
import { Swell, SwellEntry, MappedSwellData } from "../models/datasource"

// Redis Client Setup
const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

client.connect().catch(console.error);

// Surfline API URL
const SURFLINE_API_URL = "https://services.surfline.com/kbyg/spots/forecasts/swells";



// Get Swell Data for Koel Bay
export const getKoelBay = async (req: Request, res: Response): Promise<void> => {
  const cacheKey = "koelbay_swells";

  try {
    // Check Redis for cached data
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      console.log("Returning cached data");
      res.json(JSON.parse(cachedData));
      return;
    }

    // Fetch data from Surfline API
    const { data } = await axios.get(SURFLINE_API_URL, {
      params: {
        cacheEnabled: true,
        days: 5,
        intervalHours: 1,
        spotId: "640a1c44e92030f0619516ef",
        units: { swellHeight: "M" },
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "https://www.surfline.com/",
        Origin: "https://www.surfline.com",
      },
    });

    const swellsData: SwellEntry[] = data.data.swells;

    // Map the swell data
    const mappedSwells: MappedSwellData[] = swellsData.map((swellEntry) => {
      return {
        timestamp: swellEntry.timestamp,
        waveHeight: swellEntry.swells.map((swell) => swell.height),
        waveDirection: swellEntry.swells.map((swell) => swell.direction),
        wavePower: swellEntry.swells.map((swell) => swell.power),
        swellPeriod: swellEntry.swells.map((swell) => swell.period),
      };
    });

    // Cache the result in Redis for 1 hour
    await client.set(cacheKey, JSON.stringify(mappedSwells), {
      EX: 3600,
    });

    res.json(mappedSwells);
  } catch (error) {
    console.error("Error fetching data from Surfline API:", (error as Error).message);
    res.status(500).json({ error: "Error fetching data from Surfline API" });
  }
};
