import { nanoid } from 'nanoid';
import crypto from 'crypto';
import https from 'https';

export const sendMoMoRequest = async (userId, amount_money) => {
  return new Promise((resolve, reject) => {
    //parameters
    const partnerCode = process.env.MOMO_MERCHANT_ID;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const requestId = userId + '-' + nanoid(5);
    const orderId = requestId + nanoid(5);
    const orderInfo = 'Nạp tiền vào hệ thống';
    const redirectUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/checkout/return/momo'
        : 'https://green-charity.vercel.app/checkout/return/momo';
    const ipnUrl = 'https://callback.url/notify';
    // const ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    const amount = amount_money ? amount_money : '50000';
    const requestType = 'captureWallet';
    const extraData = ''; //pass empty value if your merchant does not have stores

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    const rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;
    //puts raw signature
    console.log('--------------------RAW SIGNATURE----------------');
    console.log(rawSignature);
    //signature
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
    console.log('--------------------SIGNATURE----------------');
    console.log(signature);
    const requestBody = JSON.stringify({
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature
    });
    const options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/v2/gateway/api/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    // call momo api
    const req = https.request(options, res => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      let responseBody = '';
      res.on('data', body => {
        responseBody += body;
        console.log('Body: ');
        console.log(body);
        console.log('payUrl: ');
        console.log(JSON.parse(body).payUrl);
      });
      res.on('end', () => {
        console.log('No more data in response.');
        resolve(JSON.parse(responseBody));
      });
    });

    req.on('error', e => {
      console.log(`problem with request: ${e.message}`);
      reject(e);
    });
    // write data to request body
    console.log('Sending....');
    req.write(requestBody);
    req.end();
  });
};
//json object send to MoMo endpoint
