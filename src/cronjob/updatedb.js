import { dailyUpdate, updateAuction } from 'modules/daily_update_data';
import cron from 'node-cron';

// schedule task to run every hour
cron.schedule('0 * * * *', () => {
  console.log('Daily updating campaigns');
  dailyUpdate();
  console.log('Updated campaigns every hour');
});

// run every 1 minutes
cron.schedule('*/1 * * * *', () => {
  updateAuction();
});
