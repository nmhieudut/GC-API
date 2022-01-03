import { getVNPayReturnUrl, sendVNPayRequest } from 'libs/vnpay';
import { sendMoMoRequest } from '../libs/momo';
const payWithMoMo = (req, res, next) => {
  const { amount_money } = req.body;
  sendMoMoRequest(req.user.userId, amount_money)
    .then(response => {
      console.log(response);
      return res.status(200).json(response);
    })
    .catch(error => {
      next(error);
    });
};

const createPaymentUrlVNPay = (req, res, next) => {
  const { info, amount_money, bankCode } = req.body;
  const ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  sendVNPayRequest(ipAddr, req.user.userId, info, amount_money, bankCode)
    .then(response => {
      console.log(response);
      return res.status(200).json({ payUrl: response });
    })
    .catch(error => {
      next(error);
    });
};
const returnVNPayUrl = (req, res, next) => {
  getVNPayReturnUrl(req, res)
    .then(response => {
      console.log(response);
      res.status(200).json(response);
    })
    .catch(error => {
      next(error);
    });
};
export { payWithMoMo, createPaymentUrlVNPay, returnVNPayUrl };
