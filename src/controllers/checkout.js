import { getVNPayReturnUrl, sendVNPayRequest } from 'libs/vnpay';
import { sendMoMoRequest, getMoMoReturnUrl } from '../libs/momo';

export const CheckoutService = {
  createPaymentUrlMoMo: (req, res, next) => {
    const { amount_money } = req.body;
    sendMoMoRequest(req.user.userId, amount_money)
      .then(response => {
        console.log(response);
        return res.status(200).json(response);
      })
      .catch(error => {
        next(error);
      });
  },
  returnMoMoUrl: (req, res, next) => {
    getMoMoReturnUrl(req, res)
      .then(response => {
        console.log(response);
        res.status(200).json(response);
      })
      .catch(error => {
        next(error);
      });
  },
  createPaymentUrlVNPay: (req, res, next) => {
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
  },
  returnVNPayUrl: (req, res, next) => {
    getVNPayReturnUrl(req, res)
      .then(response => {
        console.log(response);
        res.status(200).json(response);
      })
      .catch(error => {
        next(error);
      });
  }
};
