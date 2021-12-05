import { dailyUpdate } from 'modules/daily_update_data';
import cron from 'node-cron';

// schedule task to run every hour
cron.schedule('0 * * * *', () => {
  dailyUpdate();
  console.log('running a task every hour');
});

export default { cron };
