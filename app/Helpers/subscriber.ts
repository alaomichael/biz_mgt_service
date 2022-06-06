import Subscription from "App/Models/Subscription";

exports.subscriptionHandler = function (services, merchantId,callback) {
  let payload = {}
  let subscription;
  services.forEach((service) => {
let {name,
price,
recurrent,
recurrentType,
limit,
limitType,
limitValue,
otherDetails,
status} = service;
payload = {
  name,
  merchantId,
  price,
  recurrent,
  recurrentType,
  limit,
  limitType,
  limitValue,
  otherDetails,
  status,
};

subscription = await Subscription.create(payload);
  });
  callback(null, payload);
};
