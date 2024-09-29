import cron from 'node-cron';
import axios from 'axios';
import nodemailer from 'nodemailer';


const fetchUserPreferences = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/user/users/preferences');
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch user preferences:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return [];
  }
};


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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "dylanmitchley1994@gmail.com",
    pass: "hqng vkww sohj ucmi",
  },
});


const sendNotificationEmail = async (email: string, conditions: any) => {
  const mailOptions = {
    from: "dylanmitchley1994@gmail.com",
    to: email,
    subject: 'Upcoming Swell Matches Your Preferences!',
    html: `
      <div style="background-color:#f4f4f4;padding:20px;font-family:Arial,sans-serif">
        <table style="max-width:600px;margin:0 auto;background-color:white;border-radius:8px;overflow:hidden">
          <thead style="background-color:#1E88E5;color:white;text-align:center;padding:10px 0">
            <tr>
              <th colspan="2" style="padding:20px">
                <h1 style="margin:0;font-size:24px;">Swell Alert!</h1>
                <p style="font-size:16px;margin:5px 0">Perfect waves are coming your way!</p>
              </th>
            </tr>
          </thead>
          <tbody style="padding:20px;background-color:white;text-align:left">
            <tr>
              <td colspan="2" style="padding:20px;text-align:center;">
                <h2 style="margin-bottom:10px;">Koel Bay Swell Conditions</h2>
                <p style="font-size:16px;margin-bottom:0">Here’s how the swell lines up with your preferences:</p>
              </td>
            </tr>
            <tr>
              <td style="padding:10px;text-align:center;border-bottom:1px solid #ddd;">
                <strong>Wave Height</strong><br />
                <span style="font-size:20px;color:#1E88E5;">${conditions.waveHeight}m</span>
              </td>
              <td style="padding:10px;text-align:center;border-bottom:1px solid #ddd;">
                <strong>Wave Direction</strong><br />
                <span style="font-size:20px;color:#1E88E5;">${conditions.waveDirection}°</span>
              </td>
            </tr>
            <tr>
              <td style="padding:10px;text-align:center;border-bottom:1px solid #ddd;">
                <strong>Wind Direction</strong><br />
                <span style="font-size:20px;color:#1E88E5;">${conditions.windDirection}</span>
              </td>
              <td style="padding:10px;text-align:center;border-bottom:1px solid #ddd;">
                <strong>Location</strong><br />
                <span style="font-size:20px;color:#1E88E5;">${conditions.location}</span>
              </td>
            </tr>
          </tbody>
          <tfoot style="background-color:#1E88E5;color:white;text-align:center;padding:20px">
            <tr>
              <td colspan="2" style="padding:20px">
                <p style="margin:0;font-size:14px">Stay tuned for more swell alerts!<br />See you in the water 🌊</p>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};



const checkAndNotifyUsers = async (waveData: any, userPreferences: any) => {
  for (const data of waveData) {
    const waveHeight = data.waveHeight[0];
    const waveDirection = data.waveDirection[0];


    for (const user of userPreferences) {
      const { preferred_wave_min, preferred_wave_max, preferred_wave_direction, preferred_wind_direction, preferred_location } = user;


      const windDirection = "E";


      if (
        waveHeight >= preferred_wave_min &&
        waveHeight <= preferred_wave_max &&
        waveDirection === preferred_wave_direction &&
        windDirection === preferred_wind_direction &&
        preferred_location === "Koel Bay"
      ) {
        console.log(`Wave conditions match for user: ${user.username}`);
        await sendNotificationEmail(user.email, {
          waveHeight,
          waveDirection,
          windDirection,
          location: "Koel Bay",
        });
      } else {
        console.log(`Wave conditions do not match for user: ${user.username}`);
      }
    }
  }
};


const startCronJob = () => {

  cron.schedule('0 0 * * *', async () => {
    console.log('Running cron job to check wave conditions for all users.');

    try {

      const userPreferences = await fetchUserPreferences();
      const waveData = await fetchDailyWaveData();

      if (userPreferences.length > 0 && waveData.length > 0) {
        await checkAndNotifyUsers(waveData, userPreferences);
      } else {
        console.log('No user preferences or wave data available.');
      }
    } catch (error) {
      console.error('Error during cron job:', error);
    }
  });

  console.log('Cron job started: checking wave conditions daily at midnight for all users.');
};

startCronJob();
