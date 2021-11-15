import { sendMomoRequest } from '../libs/momo';
import { stripeMethod } from '../libs/stripe';

const payWithStripe = (req, res, next) => {
  const { info, amount_money } = req.body;
  console.log(info, amount_money, id);
  stripeMethod(info, amount_money, id);
  return res.status(200).json({
    message: 'Payment with stripe'
  });
};
const payWithMomo = (req, res, next) => {
  const { info, amount_money } = req.body;
  sendMomoRequest(req.user.userId, info, amount_money)
    .then(response => {
      console.log(response);
      return res.status(200).json(response);
    })
    .catch(error => {
      next(error);
    });
};

export { payWithMomo, payWithStripe };
