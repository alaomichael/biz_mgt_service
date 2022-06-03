import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Subscription from "App/Models/Subscription";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Event from "@ioc:Adonis/Core/Event";
import { DateTime } from "luxon";
export default class SubscriptionsController {
  public async index({ params, request, response }: HttpContextContract) {
    console.log("subscription params: ", params);
    const { isOnboardingAutomated, isTerminationAutomated, tagName, limit } =
      request.qs();
    console.log("subscription query: ", request.qs());
    // const countActiveSetting = await Subscription.query()
    //   .where("investment_type", "fixed")
    // //   .getCount();
    // console.log("subscription Investment count: ", countActiveSetting);

    // const subscription = await Subscription.query().offset(0).limit(1)
    const subscription = await Subscription.all();
    let sortedSettings = subscription;

    if (isOnboardingAutomated) {
      sortedSettings = sortedSettings.filter((subscription) => {
        // @ts-ignore
        return (
          subscription.isOnboardingAutomated.toString() ===
          isOnboardingAutomated
        );
      });
    }

    if (isTerminationAutomated) {
      sortedSettings = sortedSettings.filter((subscription) => {
        // @ts-ignore
        return (
          subscription.isTerminationAutomated.toString() ===
          isTerminationAutomated
        );
      });
    }
    if (tagName) {
      sortedSettings = sortedSettings.filter((subscription) => {
        // @ts-ignore
        return subscription.tagName!.includes(tagName);
      });
    }
    if (limit) {
      sortedSettings = sortedSettings.slice(0, Number(limit));
    }
    if (sortedSettings.length < 1) {
      return response.status(200).json({
        status: "OK",
        message: "no general subscription matched your search",
        data: [],
      });
    }
    // return subscription(s)
    return response.status(200).json({
      status: "OK",
      data: sortedSettings.map((subscription) => subscription.$original),
    });
  }

  public async store({ request, response }: HttpContextContract) {
    // const user = await auth.authenticate()
    const settingSchema = schema.create({
      name: schema.string({ escape: true }, [rules.maxLength(100)]),
      price: schema.number(),
      recurrent: schema.boolean(),
      recurrentType: schema.string({ escape: true }, [rules.maxLength(100)]),
      limit: schema.boolean(),
      limitType: schema.string({ escape: true }, [rules.maxLength(100)]),
      limitValue: schema.string({ escape: true }, [rules.maxLength(100)]),
      otherDetails: schema.object().members({}),
    });
    const payload: any = await request.validate({ schema: settingSchema });
    const subscription = await Subscription.create(payload);

    await subscription.save();
    console.log("The new subscription:", subscription);

    // TODO
    console.log("A New subscription has been Created.");

    // update duration and expiryDate
    if (subscription.recurrent === true) {
      let duration;
      let expiryDate;
      let recurrentType = subscription.recurrentType;
      switch (recurrentType) {
        case "daily":
          duration = "one day";
          expiryDate = DateTime.now().plus({ days: 1 });
          console.log(`The duration for ${recurrentType} recurrent type is ${duration}`);
          console.log(`The expiry date for ${recurrentType} recurrent type is ${expiryDate}`);
          break;
        case "weekly":
          duration = "one week"; //DateTime.now().plus({ week: 1 });
          expiryDate = DateTime.now().plus({ week: 1 });
          console.log(`The duration for ${recurrentType} recurrent type is ${duration}`);
          console.log(`The expiry date for ${recurrentType} recurrent type is ${expiryDate}`);
          break;
        case "monthly":
          duration = "one month"; //DateTime.now().plus({ month: 1 });
          expiryDate = DateTime.now().plus({ month: 1 });
          console.log(`The duration for ${recurrentType} recurrent type is ${duration}`);
          console.log(`The expiry date for ${recurrentType} recurrent type is ${expiryDate}`);
          break;
        case "yearly":
          duration = "one year"; //DateTime.now().plus({ year: 1 });
          expiryDate = DateTime.now().plus({ year: 1 });
          console.log(`The duration for ${recurrentType} recurrent type is ${duration}`);
          console.log(`The expiry date for ${recurrentType} recurrent type is ${expiryDate}`);
          break;
        default:
          console.log(" No recurrent was set on this service");
          break;
      }
      subscription.duration = duration;
      subscription.expiryDate = expiryDate;

      // save the update
      await subscription.save();
    }
    // Save subscription new status to Database
    await subscription.save();
    // Send subscription Creation Message to Queue

    Event.emit("new:subscription", {
      id: subscription.id,
      // @ts-ignore
      extras: subscription.additionalDetails,
    });
    return response.json({ status: "OK", data: subscription.$original });
  }

  public async showSubscriptionByMerchantId({
    params,
    response,
  }: HttpContextContract) {
    console.log("subscription params: ", params);
    let { id } = params;
    // const subscription = await Subscription.query().offset(0).limit(1)
    const subscription = await Subscription.query().where({ id: id }).first();

    if (subscription === null) {
      return response.status(200).json({
        status: "OK",
        message: "no general subscription matched your search",
        data: [],
      });
    }
    // return subscription(s)
    return response.status(200).json({
      status: "OK",
      data: subscription.$original,
    });
  }

  public async showSubscriptionByAgentId({
    params,
    response,
  }: HttpContextContract) {
    console.log("subscription params: ", params);
    let { id } = params;
    // const subscription = await Subscription.query().offset(0).limit(1)
    const subscription = await Subscription.query().where({ id: id }).first();

    if (subscription === null) {
      return response.status(200).json({
        status: "OK",
        message: "no general subscription matched your search",
        data: [],
      });
    }
    // return subscription(s)
    return response.status(200).json({
      status: "OK",
      data: subscription.$original,
    });
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const { id } = request.qs();
      console.log("Subscription query: ", request.qs());

      let subscription = await Subscription.query().where({
        id: id,
      });
      console.log(" QUERY RESULT: ", subscription);
      if (subscription.length > 0) {
        console.log(
          "Investment subscription Selected for Update:",
          subscription
        );
        if (subscription) {
          subscription[0].isOnboardingAutomated = request.input(
            "isOnboardingAutomated"
          )
            ? request.input("isOnboardingAutomated")
            : subscription[0].isOnboardingAutomated;
          subscription[0].isTerminationAutomated = request.input(
            "isTerminationAutomated"
          )
            ? request.input("isTerminationAutomated")
            : subscription[0].isTerminationAutomated;
          subscription[0].tagName = request.input("tagName")
            ? request.input("tagName")
            : subscription[0].tagName;

          if (subscription) {
            // send to user
            await subscription[0].save();
            console.log("Update Investment subscription:", subscription);
            return subscription;
          }
          return; // 422
        } else {
          return response
            .status(304)
            .json({ status: "FAILED", data: subscription });
        }
      } else {
        return response.status(404).json({
          status: "FAILED",
          message: "No data match your query parameters",
        });
      }
    } catch (error) {
      console.error(error);
    }
    // return // 401
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.qs();
    console.log("Subscription query: ", request.qs());

    let subscription = await Subscription.query().where({
      id: id,
    });
    console.log(" QUERY RESULT: ", subscription);

    if (subscription.length > 0) {
      subscription = await Subscription.query()
        .where({
          id: id,
        })
        .delete();
      console.log("Deleted data:", subscription);
      return response.send("Subscription Deleted.");
    } else {
      return response
        .status(404)
        .json({ status: "FAILED", message: "Invalid parameters" });
    }
  }
}
