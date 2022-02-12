import crypto from 'crypto';
import https from 'https';
import { Transaction } from 'models/Transaction';
import { nanoid } from 'nanoid';
import QueryString from 'qs';
import { isDev } from 'utils/settings';

const secretKey = process.env.MOMO_SECRET_KEY;
const accessKey = process.env.MOMO_ACCESS_KEY;

export const sendMoMoRequest = async (userId, amount_money) => {
  return new Promise((resolve, reject) => {
    //parameters
    const partnerCode = process.env.MOMO_MERCHANT_ID;
    const requestId = userId + '-' + nanoid(5);
    const orderId = requestId + nanoid(5);
    const orderInfo = 'Nạp tiền vào hệ thống';
    const redirectUrl = isDev
      ? 'http://localhost:3000/checkout/return/momo'
      : 'https://green-charity.vercel.app/checkout/return/momo';
    const ipnUrl = 'https://callback.url/notify';
    // const ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    const amount = amount_money ? amount_money : 50000;
    const requestType = 'captureWallet';
    const extraData = ''; //pass empty value if your merchant does not have stores

    //before sign HMAC SHA256 with format
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

export const getMoMoReturnUrl = async (req, res) => {
  const {
    partnerCode,
    requestId,
    amount,
    orderId,
    orderInfo,
    payType,
    message,
    extraData,
    responseTime,
    resultCode,
    signature,
    orderType,
    localMessage,
    transId
  } = req.query;
  // const rawSignature = `partnerCode=${partnerCode}&accessKey=${accessKey}&requestId=${requestId}&amount=${amount}&orderId=${orderId}&orderInfo=
  // ${orderInfo}&orderType=${orderType}&transId=${transId}&message=${message}&responseTime=${responseTime}&resultCode=${resultCode}
  // &payType=${payType}&extraData=${extraData}`;
  // const signed = crypto
  //   .createHmac('sha256', secretKey)
  //   .update(rawSignature)
  //   .digest('hex');
  // console.log('signed', signed, signature);
  // if (signed === signature) {
  //   return console.log('okkkkkkkkk');
  // }
  // return console.log('huhuhuhu');
  if (resultCode === '0') {
    const checkingOrder = await Transaction.findOne({ orderId });
    if (checkingOrder) {
      return { code: '97' };
    }
    return {
      code: '00',
      orderId,
      userId: req.user.userId,
      amount: parseInt(amount)
    };
  }
  return { code: '97' };
};
// partnerCode=MOMOK8K020211025
// & orderId=617915dab4a3fe410c8603ac - ps3XBSRmDk
//   & requestId=617915dab4a3fe410c8603ac - ps3XB
//   & amount=1999999
//   & orderInfo=Nạp + tiền + vào + hệ + thống
//   & orderType=momo_wallet
//   & transId=2643051328
//   & resultCode=0
//   & message=Successful.
//     & payType=qr
//   & responseTime=1644398480781
//     & extraData=
// & signature=e927324bb971cb2df9a27663fbca24bcc4f4187482f6f7389406dff7adc346bd
