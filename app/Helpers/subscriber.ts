// import Service from "App/Models/Service";
// import Subscription from "App/Models/Subscription";
const Service = require("App/Models/Service");
const Subscription = require("App/Models/Subscription");

const subscriptionHandler = async function (services, merchantId) {
  let payload = {}
  let subscription;
  services.forEach(async (service) => {
    let {
      name,
      price,
      recurrent,
      recurrentType,
      limit,
      limitType,
      limitValue,
      otherDetails,
      status,
    } = service;
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
  return subscription;
};

let testingServices = Service.query();
let callback;

subscriptionHandler(testingServices, 12345);
// exports.module = subscriptionHandler;

module.exports = { subscriptionHandler };

// export { subscriptionHandler };
