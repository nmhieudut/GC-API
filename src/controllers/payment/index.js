import { sendMomoRequest } from "./momo";

const payWithStripe = () => {};
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
