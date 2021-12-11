import { dailyUpdateNews } from 'modules/daily_update_news';
import cron from 'node-cron';

cron.schedule('00 00 12 * * 0-6', () => {
  console.log('Getting news');
  dailyUpdateNews();
  console.log('Updated news everyday');
});

export default { cron };
