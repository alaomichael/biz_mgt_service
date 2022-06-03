import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Tenantsetting from "App/Models/Tenantsetting";
// import { DateTime } from 'luxon'
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Event from "@ioc:Adonis/Core/Event";
export default class TenantsettingsController {
  public async index({ params, request, response }: HttpContextContract) {
    console.log("tenantsetting params: ", params);
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
    console.log("tenantsetting query: ", request.qs());
    const countActiveSetting = await Tenantsetting.query().where(
      "investment_type",
      "fixed"
    );
    //   .getCount();
    console.log("tenantsetting Investment count: ", countActiveSetting);

    // const tenantsetting = await Tenantsetting.query().offset(0).limit(1)
    const tenantsetting = await Tenantsetting.all();
    let sortedSettings = tenantsetting;

    if (isOnboardingAutomated) {
      sortedSettings = sortedSettings.filter((tenantsetting) => {
        // @ts-ignore
        return (
          tenantsetting.isOnboardingAutomated.toString() === isOnboardingAutomated
        );
      });
    }

    if (isTerminationAutomated) {
      sortedSettings = sortedSettings.filter((tenantsetting) => {
        // @ts-ignore
        return (
          tenantsetting.isTerminationAutomated.toString() === isTerminationAutomated
        );
      });
    }
    if (isDailyContributionAutomated) {
      sortedSettings = sortedSettings.filter((tenantsetting) => {
        // @ts-ignore
        return (
          tenantsetting.isDailyContributionAutomated.toString() ===
          isDailyContributionAutomated
        );
      });
    }

    if (isDepositAutomated) {
      sortedSettings = sortedSettings.filter((tenantsetting) => {
        // @ts-ignore
        return tenantsetting.isDepositAutomated.toString() === isDepositAutomated;
      });
    }

    if (isWithdrawalAutomated) {
      sortedSettings = sortedSettings.filter((tenantsetting) => {
        // @ts-ignore
        return (
          tenantsetting.isWithdrawalAutomated.toString() === isWithdrawalAutomated
        );
      });
    }
    if (isTelleringAutomated) {
      sortedSettings = sortedSettings.filter((tenantsetting) => {
        // @ts-ignore
        return tenantsetting.isTelleringAutomated.toString() === isTelleringAutomated;
      });
    }

    if (isTransferAutomated) {
      sortedSettings = sortedSettings.filter((tenantsetting) => {
        // @ts-ignore
        return tenantsetting.isTransferAutomated.toString() === isTransferAutomated;
      });
    }

    if (isBillPaymentAutomated) {
      sortedSettings = sortedSettings.filter((tenantsetting) => {
        // @ts-ignore
        return (
          tenantsetting.isBillPaymentAutomated.toString() === isBillPaymentAutomated
        );
      });
    }
    if (isVoucherAutomated) {
      sortedSettings = sortedSettings.filter((tenantsetting) => {
        // @ts-ignore
        return tenantsetting.isVoucherAutomated.toString() === isVoucherAutomated;
      });
    }
    if (tagName) {
      sortedSettings = sortedSettings.filter((tenantsetting) => {
        // @ts-ignore
        return tenantsetting.tagName!.includes(tagName);
      });
    }
    if (limit) {
      sortedSettings = sortedSettings.slice(0, Number(limit));
    }
    if (sortedSettings.length < 1) {
      return response.status(200).json({
        status: "OK",
        message: "no general tenantsetting matched your search",
        data: [],
      });
    }
    // return tenantsetting(s)
    return response.status(200).json({
      status: "OK",
      data: sortedSettings.map((tenantsetting) => tenantsetting.$original),
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
    const tenantsetting = await Tenantsetting.create(payload);

    await tenantsetting.save();
    console.log("The new investment:", tenantsetting);

    // TODO
    console.log("A New tenantsetting has been Created.");

    // Save tenantsetting new status to Database
    await tenantsetting.save();
    // Send tenantsetting Creation Message to Queue

    Event.emit("new:tenantsetting", {
      id: tenantsetting.id,
      // @ts-ignore
      extras: tenantsetting.additionalDetails,
    });
    return response.json({ status: "OK", data: tenantsetting.$original });
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const { id } = request.qs();
      console.log("Tenantsetting query: ", request.qs());

      let tenantsetting = await Tenantsetting.query().where({
        id: id,
      });
      console.log(" QUERY RESULT: ", tenantsetting);
      if (tenantsetting.length > 0) {
        console.log("Investment tenantsetting Selected for Update:", tenantsetting);
        if (tenantsetting) {
          tenantsetting[0].isOnboardingAutomated = request.input(
            "isOnboardingAutomated"
          )
            ? request.input("isOnboardingAutomated")
            : tenantsetting[0].isOnboardingAutomated;
          tenantsetting[0].isTerminationAutomated = request.input(
            "isTerminationAutomated"
          )
            ? request.input("isTerminationAutomated")
            : tenantsetting[0].isTerminationAutomated;
          tenantsetting[0].isDailyContributionAutomated = request.input(
            "isDailyContributionAutomated"
          )
            ? request.input("isDailyContributionAutomated")
            : tenantsetting[0].isDailyContributionAutomated;
          tenantsetting[0].isDepositAutomated = request.input(
            "isDepositAutomated"
          )
            ? request.input("isDepositAutomated")
            : tenantsetting[0].isDepositAutomated;
          tenantsetting[0].isWithdrawalAutomated = request.input(
            "isWithdrawalAutomated"
          )
            ? request.input("isWithdrawalAutomated")
            : tenantsetting[0].isWithdrawalAutomated;
          tenantsetting[0].isTelleringAutomated = request.input(
            "isTelleringAutomated"
          )
            ? request.input("isTelleringAutomated")
            : tenantsetting[0].isTelleringAutomated;
          tenantsetting[0].isTransferAutomated = request.input(
            "isTransferAutomated"
          )
            ? request.input("isTransferAutomated")
            : tenantsetting[0].isTransferAutomated;
          tenantsetting[0].isBillPaymentAutomated = request.input(
            "isBillPaymentAutomated"
          )
            ? request.input("isBillPaymentAutomated")
            : tenantsetting[0].isBillPaymentAutomated;
          tenantsetting[0].isVoucherAutomated = request.input(
            "isVoucherAutomated"
          )
            ? request.input("isVoucherAutomated")
            : tenantsetting[0].isVoucherAutomated;
          tenantsetting[0].tagName = request.input("tagName")
            ? request.input("tagName")
            : tenantsetting[0].tagName;

          if (tenantsetting) {
            // send to user
            await tenantsetting[0].save();
            console.log("Update Investment tenantsetting:", tenantsetting);
            return tenantsetting;
          }
          return; // 422
        } else {
          return response.status(304).json({ status: "FAILED", data: tenantsetting });
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
    console.log("Tenantsetting query: ", request.qs());

    let tenantsetting = await Tenantsetting.query().where({
      id: id,
    });
    console.log(" QUERY RESULT: ", tenantsetting);

    if (tenantsetting.length > 0) {
      tenantsetting = await Tenantsetting.query()
        .where({
          id: id,
        })
        .delete();
      console.log("Deleted data:", tenantsetting);
      return response.send("tenantsetting Delete.");
    } else {
      return response
        .status(404)
        .json({ status: "FAILED", message: "Invalid parameters" });
    }
  }
}
