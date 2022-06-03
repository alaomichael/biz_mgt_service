import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Merchantsetting from "App/Models/Merchantsetting";
// import { DateTime } from 'luxon'
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Event from "@ioc:Adonis/Core/Event";

export default class MerchantsettingsController {
  public async index({ params, request, response }: HttpContextContract) {
    console.log("merchantsetting params: ", params);
    const {
      isOnboardingAutomated,
      isTerminationAutomated,
      isDailyContributionAutomated,
      isDepositAutomated,
      isWithdrawalAutomated,
      isTelleringAutomated,
      isTransferAutomated,
      isBillPaymentAutomated,
      isVoucherAutomated,
      tagName,

      limit,
    } = request.qs();
    console.log("merchantsetting query: ", request.qs());
    // const merchantsetting = await Merchantsetting.query().offset(0).limit(1)
    const merchantsetting = await Merchantsetting.all();
    let sortedSettings = merchantsetting;

    if (isOnboardingAutomated) {
      sortedSettings = sortedSettings.filter((merchantsetting) => {
        // @ts-ignore
        return (
          merchantsetting.isOnboardingAutomated.toString() ===
          isOnboardingAutomated
        );
      });
    }

    if (isTerminationAutomated) {
      sortedSettings = sortedSettings.filter((merchantsetting) => {
        // @ts-ignore
        return (
          merchantsetting.isTerminationAutomated.toString() ===
          isTerminationAutomated
        );
      });
    }
    if (isDailyContributionAutomated) {
      sortedSettings = sortedSettings.filter((merchantsetting) => {
        // @ts-ignore
        return (
          merchantsetting.isDailyContributionAutomated.toString() ===
          isDailyContributionAutomated
        );
      });
    }

    if (isDepositAutomated) {
      sortedSettings = sortedSettings.filter((merchantsetting) => {
        // @ts-ignore
        return (
          merchantsetting.isDepositAutomated.toString() === isDepositAutomated
        );
      });
    }

    if (isWithdrawalAutomated) {
      sortedSettings = sortedSettings.filter((merchantsetting) => {
        // @ts-ignore
        return (
          merchantsetting.isWithdrawalAutomated.toString() ===
          isWithdrawalAutomated
        );
      });
    }
    if (isTelleringAutomated) {
      sortedSettings = sortedSettings.filter((merchantsetting) => {
        // @ts-ignore
        return (
          merchantsetting.isTelleringAutomated.toString() ===
          isTelleringAutomated
        );
      });
    }

    if (isTransferAutomated) {
      sortedSettings = sortedSettings.filter((merchantsetting) => {
        // @ts-ignore
        return (
          merchantsetting.isTransferAutomated.toString() === isTransferAutomated
        );
      });
    }

    if (isBillPaymentAutomated) {
      sortedSettings = sortedSettings.filter((merchantsetting) => {
        // @ts-ignore
        return (
          merchantsetting.isBillPaymentAutomated.toString() ===
          isBillPaymentAutomated
        );
      });
    }
    if (isVoucherAutomated) {
      sortedSettings = sortedSettings.filter((merchantsetting) => {
        // @ts-ignore
        return (
          merchantsetting.isVoucherAutomated.toString() === isVoucherAutomated
        );
      });
    }
    if (tagName) {
      sortedSettings = sortedSettings.filter((merchantsetting) => {
        // @ts-ignore
        return merchantsetting.tagName!.includes(tagName);
      });
    }
    if (limit) {
      sortedSettings = sortedSettings.slice(0, Number(limit));
    }
    if (sortedSettings.length < 1) {
      return response.status(200).json({
        status: "OK",
        message: "no general merchantsetting matched your search",
        data: [],
      });
    }
    // return merchantsetting(s)
    return response.status(200).json({
      status: "OK",
      data: sortedSettings.map((merchantsetting) => merchantsetting.$original),
    });
  }

  public async showSettingById({ params, response }: HttpContextContract) {
    console.log("setting params: ", params);
    let { id } = params;
    // const setting = await Setting.query().offset(0).limit(1)
    const setting = await Merchantsetting.query().where({ id: id }).first();
 console.log("setting query result: ", setting);
    if (setting === null) {
      return response.status(200).json({
        status: "OK",
        message: "no merchant setting matched your search",
        data: [],
      });
    }
    // return setting(s)
    return response.status(200).json({
      status: "OK",
      data: setting.$original,
    });
  }

  public async store({ request, response }: HttpContextContract) {
    // const user = await auth.authenticate()
    const settingSchema = schema.create({
      isOnboardingAutomated: schema.boolean(),
      isTerminationAutomated: schema.boolean(),
      isDailyContributionAutomated: schema.boolean(),
      isDepositAutomated: schema.boolean(),
      isWithdrawalAutomated: schema.boolean(),
      isTelleringAutomated: schema.boolean(),
      isTransferAutomated: schema.boolean(),
      isBillPaymentAutomated: schema.boolean(),
      isVoucherAutomated: schema.boolean(),
      tagName: schema.string({ escape: true }, [rules.maxLength(100)]),
    });
    const payload: any = await request.validate({ schema: settingSchema });
    const merchantsetting = await Merchantsetting.create(payload);

    await merchantsetting.save();
    console.log("The new investment:", merchantsetting);

    // TODO
    console.log("A New merchantsetting has been Created.");

    // Save merchantsetting new status to Database
    await merchantsetting.save();
    // Send merchantsetting Creation Message to Queue

    Event.emit("new:merchantsetting", {
      id: merchantsetting.id,
      // @ts-ignore
      extras: merchantsetting.additionalDetails,
    });
    return response.json({ status: "OK", data: merchantsetting.$original });
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const { id } = request.qs();
      console.log("Merchantsetting query: ", request.qs());

      let merchantsetting = await Merchantsetting.query().where({
        id: id,
      }).first();
      console.log(" QUERY RESULT: ", merchantsetting);
      if (merchantsetting !== null) {
        console.log(
          "Investment merchantsetting Selected for Update:",
          merchantsetting
        );
        if (merchantsetting) {
          merchantsetting.isOnboardingAutomated = request.input(
            "isOnboardingAutomated"
          )
            ? request.input("isOnboardingAutomated")
            : merchantsetting.isOnboardingAutomated;
          merchantsetting.isTerminationAutomated = request.input(
            "isTerminationAutomated"
          )
            ? request.input("isTerminationAutomated")
            : merchantsetting.isTerminationAutomated;
          merchantsetting.isDailyContributionAutomated = request.input(
            "isDailyContributionAutomated"
          )
            ? request.input("isDailyContributionAutomated")
            : merchantsetting.isDailyContributionAutomated;
          merchantsetting.isDepositAutomated = request.input(
            "isDepositAutomated"
          )
            ? request.input("isDepositAutomated")
            : merchantsetting.isDepositAutomated;
          merchantsetting.isWithdrawalAutomated = request.input(
            "isWithdrawalAutomated"
          )
            ? request.input("isWithdrawalAutomated")
            : merchantsetting.isWithdrawalAutomated;
          merchantsetting.isTelleringAutomated = request.input(
            "isTelleringAutomated"
          )
            ? request.input("isTelleringAutomated")
            : merchantsetting.isTelleringAutomated;
          merchantsetting.isTransferAutomated = request.input(
            "isTransferAutomated"
          )
            ? request.input("isTransferAutomated")
            : merchantsetting.isTransferAutomated;
          merchantsetting.isBillPaymentAutomated = request.input(
            "isBillPaymentAutomated"
          )
            ? request.input("isBillPaymentAutomated")
            : merchantsetting.isBillPaymentAutomated;
          merchantsetting.isVoucherAutomated = request.input(
            "isVoucherAutomated"
          )
            ? request.input("isVoucherAutomated")
            : merchantsetting.isVoucherAutomated;
          merchantsetting.tagName = request.input("tagName")
            ? request.input("tagName")
            : merchantsetting.tagName;

          if (merchantsetting) {
            // send to user
            await merchantsetting.save();
            console.log("Update Investment merchantsetting:", merchantsetting);
            return merchantsetting;
          }
          return; // 422
        } else {
          return response
            .status(304)
            .json({ status: "FAILED", data: merchantsetting });
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
    console.log("Merchantsetting query: ", request.qs());

    let merchantsetting = await Merchantsetting.query().where({
      id: id,
    });
    console.log(" QUERY RESULT: ", merchantsetting);

    if (merchantsetting.length > 0) {
      merchantsetting = await Merchantsetting.query()
        .where({
          id: id,
        })
        .delete();
      console.log("Deleted data:", merchantsetting);
      return response.send("Merchant setting Deleted.");
    } else {
      return response
        .status(404)
        .json({ status: "FAILED", message: "Invalid parameters" });
    }
  }
}
