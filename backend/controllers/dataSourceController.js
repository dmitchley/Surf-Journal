const asyncHandler = require("express-async-handler");
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const redis = require("redis");

const SURFLINE_API_URL =
  "https://services.surfline.com/kbyg/spots/forecasts/swells";

const getkoelbay = async (req, res) => {
  try {
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

    const swellsData = data.data.swells;

    const mappedSwells = swellsData.map((swellEntry) => {
      return {
        timestamp: swellEntry.timestamp,
        waveHeight: swellEntry.swells.map((swell) => swell.height),
        waveDirection: swellEntry.swells.map((swell) => swell.direction),
        wavePower: swellEntry.swells.map((swell) => swell.power),
        swellPeriod: swellEntry.swells.map((swell) => swell.period),
      };
    });
    //  console.log(mappedSwells);
    res.json(mappedSwells);
  } catch (error) {
    console.error("Error fetching data from Surfline API:", error.message);
    res.status(500).json({ error: "Error fetching data from Surfline API" });
  }
};

const urlbikini =
  "https://magicseaweed.com/Bikini-Beach-Gordons-Bay-Surf-Report/3781/";

const getBikiniBeach = (req, res) => {
  // axios get to the url above
  // using cherrio to scrape that page for the data
  axios(urlbikini).then((response) => {
    const html = response.data;

    const $ = cheerio.load(html);
    const timearr = [];

    $(".nopadding-left small", html).each(function () {
      timearr.push($(this).text());
    });

    const waveHeightarr = [];

    $(".table-forecast-breaking-wave").each(function () {
      waveHeightarr.push($(this).text());
    });

    const waveDirection = [];

    $("td.text-center.msw-js-tooltip.background-gray-lighter").each(
      function () {
        waveDirection.push(this.attribs.title);
      }
    );

    const windDirection = [];

    $("td.text-center.last.msw-js-tooltip.td-square").each(function () {
      windDirection.push(this.attribs.title);
    });

    // format a new array
    const newArrBikini = [];

    newArrBikini.push([
      timearr.map((time, index) => ({
        time,
        waveHeight: waveHeightarr[index],
        waveDirectionSS: waveDirection[index],
        wind: windDirection[index],
      })),
    ]);
    res.json(newArrBikini);
  });
};

module.exports = { getkoelbay, getBikiniBeach };
