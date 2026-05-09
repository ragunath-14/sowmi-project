import cron from 'node-cron';
import https from 'https';

export const startCronJobs = () => {
  // Render spins down free web services after 15 minutes of inactivity.
  // We ping the server every 14 minutes to keep it awake.
  cron.schedule('*/14 * * * *', () => {
    // RENDER_EXTERNAL_URL is automatically set by Render
    const backendUrl = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL;
    if (backendUrl) {
      console.log(`Pinging backend to keep awake: ${backendUrl}`);
      https.get(backendUrl, (res) => {
        if (res.statusCode === 200) {
          console.log('Backend ping successful');
        } else {
          console.error(`Backend ping failed with status code: ${res.statusCode}`);
        }
      }).on('error', (err) => {
        console.error('Error pinging backend:', err.message);
      });
    } else {
        console.log('Backend URL not found for cron ping.');
    }

    // Ping the frontend portfolio website
    // Note: Render Static Sites do NOT sleep, but if it is deployed as a Web Service, this will keep it awake.
    const frontendUrl = process.env.FRONTEND_URL;
    if (frontendUrl) {
      console.log(`Pinging frontend to keep awake: ${frontendUrl}`);
      https.get(frontendUrl, (res) => {
        if (res.statusCode === 200) {
          console.log('Frontend ping successful');
        } else {
          console.error(`Frontend ping failed with status code: ${res.statusCode}`);
        }
      }).on('error', (err) => {
        console.error('Error pinging frontend:', err.message);
      });
    } else {
        console.log('Frontend URL not found for cron ping.');
    }
  });

  console.log('Cron jobs started to keep services awake.');
};
