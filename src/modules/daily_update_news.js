import { New } from 'models/New';
import puppeteer from 'puppeteer';

export const dailyGetNews = async () => {
  const nldUrl = 'https://laodong.vn/tags/tien-tu-thien-312787.ldo';
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  try {
    const page = await browser.newPage();
    await page.goto(nldUrl);
    const newsData = await page.evaluate(() => {
      let news = [];
      let lists_wrapper = document.querySelectorAll('.list-main-content > li');
      lists_wrapper.forEach(item => {
        let dataJson = {};
        dataJson.thumbnail = item
          .querySelector('._thumb > img')
          .dataset.src.split('?')[0];
        dataJson.title = item.querySelector('header > h4 > a').innerText;
        dataJson.shortContent = item.querySelector('header > p').innerText;
        dataJson.url = item.querySelector('header > h4 > a').href;
        news.push(dataJson);
      });
      return news;
    });
    let contents = [];
    if (newsData.length > 0) {
      for (let i = 0; i < newsData.length; i++) {
        let content;
        const url = newsData[i].url;
        await page.goto(`${url}`, { waitUntil: 'load', timeout: 0 });
        content = await page.evaluate(
          () => document.querySelector('.article-content').innerHTML
        );
        contents.push(content);
      }
    }
    newsData.map((item, idx) => {
      return Object.assign(item, {
        content: contents[idx]
      });
    });
    return newsData;
  } catch (e) {
    console.log('error', e);
  } finally {
    await browser.close();
  }
};

export const dailyUpdateNews = async () => {
  const newsData = await dailyGetNews();
  await New.remove();
  await New.insertMany(newsData, { ordered: true });
  console.log('Updated News Successfully');
};
