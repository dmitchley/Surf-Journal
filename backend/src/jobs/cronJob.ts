import cron from 'node-cron';
import axios from 'axios';
import { db } from '../db';


const fetchDailyWaveData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/spots/koelbay');
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch wave data:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching wave data:', error);
    return [];
  }
};


const startCronJob = () => {

  cron.schedule('0 0 * * *', async () => {
    try {

      const waveData = await fetchDailyWaveData();
      if (waveData.length > 0) {
        const query = `
          INSERT INTO journal (text, time, wave, wave_direction, wind_direction, location, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7);
        `;

        for (const data of waveData) {
          await db.query(query, [
            'Daily Wave Report',
            new Date(data.timestamp * 1000),
            data.waveHeight,
            data.waveDirection,
            [Math.random() * 360],
            'Koel Bay',
            1
          ]);
        }

        console.log('Daily report saved successfully.');
      } else {
        console.log('No wave data to save.');
      }


      const deleteQuery = `
        DELETE FROM journal WHERE time < NOW() - INTERVAL '5 days';
      `;
      await db.query(deleteQuery);
      console.log('Old journal entries deleted.');
    } catch (error) {
      console.error('Error during cron job:', error);
    }
  });

  console.log('Cron job started: saving daily reports and cleaning up old data.');
};

(async () => {
  startCronJob();
})();