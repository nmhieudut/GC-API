import { New } from 'models/New';
import puppeteer from 'puppeteer';

export const dailyUpdateNews = async () => {
  const nldUrl = 'https://laodong.vn/tags/tien-tu-thien-312787.ldo';
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(nldUrl);
    const newsData = await page.evaluate(() => {
      let news = [];
      let lists_wrapper = document.querySelectorAll('.list-main-content > li');
      lists_wrapper.forEach(item => {
        let dataJson = {};
        dataJson.thumbnail = item.querySelector('._thumb > img').src;
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
        await page.goto(`${url}`);
        content = await page.evaluate(
          () => document.querySelector('.article-content').innerHTML
        );
        contents.push(content);
      }
    }
    await New.remove();
    newsData.map((item, idx) => {
      return Object.assign(item, {
        content: contents[idx]
      });
    });
    await New.insertMany(newsData, { ordered: true });
    console.log('Updated News Successfully');
    await browser.close();
  } catch (e) {
    console.log('error', e);
  }
};
