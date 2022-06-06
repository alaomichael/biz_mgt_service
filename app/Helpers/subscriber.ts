import Service from "App/Models/Service";
import Subscription from "App/Models/Subscription";

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

subscriptionHandler(testingServices, 12345);
// exports.module = subscriptionHandler;

module.exports = { subscriptionHandler };

// export { subscriptionHandler };
