import crypto from 'crypto';
import { format } from 'date-fns';
import { Transaction } from 'models/Transaction';
import { nanoid } from 'nanoid';
import querystring from 'qs';
import { isDev } from 'utils/settings';

const tmnCode = 'M0T60KQH';
const secretKey = 'OLICNJHNSYSQBQKQLLDOGHWFQIURURAO'; //hash key

export const sendVNPayRequest = async (
  ipAddr,
  userId,
  info,
  amount_money,
  bank_code
) => {
  return new Promise((resolve, reject) => {
    let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const returnUrl = isDev
      ? 'http://localhost:3000/checkout/return/vn-pay'
      : 'https://green-charity.vercel.app/checkout/return/vn-pay';

    const date = new Date();
    const createDate = format(date, 'yyyyMMddHHmmss');
    const orderId = nanoid(5);
    const amount = amount_money ? amount_money : 50000;
    const bankCode = bank_code ? bank_code : 'NCB';
    const orderInfo = info;
    const orderType = '260000';
    const locale = 'vn';
    if (locale === null || locale === '') {
      locale = 'vn';
    }
    const currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    resolve(vnpUrl);
  });
};

export const getVNPayReturnUrl = async (req, res) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });

  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    const orderId = vnp_Params['vnp_TxnRef'];
    const checkingOrder = await Transaction.findOne({ orderId });
    if (checkingOrder) {
      return { code: '97' };
    }
    return {
      code: '00',
      orderId,
      userId: req.user.userId,
      amount: parseInt(vnp_Params['vnp_Amount'])
    };
  } else {
    return { code: '97' };
  }
};

function sortObject(obj) {
  const sorted = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}
