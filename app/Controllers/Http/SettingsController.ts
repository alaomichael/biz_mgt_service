import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Setting from "App/Models/Setting";
// import { DateTime } from 'luxon'
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Event from "@ioc:Adonis/Core/Event";

export default class SettingsController {
  public async index({ params, request, response }: HttpContextContract) {
    console.log("setting params: ", params);
    const { isOnboardingAutomated, isTerminationAutomated, tagName, limit } =
      request.qs();
    console.log("setting query: ", request.qs());
    // const countActiveSetting = await Setting.query()
    //   .where("investment_type", "fixed")
    // //   .getCount();
    // console.log("setting Investment count: ", countActiveSetting);

    // const setting = await Setting.query().offset(0).limit(1)
    const setting = await Setting.all();
    let sortedSettings = setting;

    if (isOnboardingAutomated) {
      sortedSettings = sortedSettings.filter((setting) => {
        // @ts-ignore
        return (
          setting.isOnboardingAutomated.toString() === isOnboardingAutomated
        );
      });
    }

    if (isTerminationAutomated) {
      sortedSettings = sortedSettings.filter((setting) => {
        // @ts-ignore
        return (
          setting.isTerminationAutomated.toString() === isTerminationAutomated
        );
      });
    }
    if (tagName) {
      sortedSettings = sortedSettings.filter((setting) => {
        // @ts-ignore
        return setting.tagName!.includes(tagName);
      });
    }
    if (limit) {
      sortedSettings = sortedSettings.slice(0, Number(limit));
    }
    if (sortedSettings.length < 1) {
      return response.status(200).json({
        status: "OK",
        message: "no general setting matched your search",
        data: [],
      });
    }
    // return setting(s)
    return response.status(200).json({
      status: "OK",
      data: sortedSettings.map((setting) => setting.$original),
    });
  }

  public async store({ request, response }: HttpContextContract) {
    // const user = await auth.authenticate()
    const settingSchema = schema.create({
      isOnboardingAutomated: schema.boolean(),
      isTerminationAutomated: schema.boolean(),
      tagName: schema.string({ escape: true }, [rules.maxLength(100)]),
    });
    const payload: any = await request.validate({ schema: settingSchema });
    const setting = await Setting.create(payload);

    await setting.save();
    console.log("The new investment:", setting);

    // TODO
    console.log("A New setting has been Created.");

    // Save setting new status to Database
    await setting.save();
    // Send setting Creation Message to Queue

    Event.emit("new:setting", {
      id: setting.id,
      // @ts-ignore
      extras: setting.additionalDetails,
    });
    return response.json({ status: "OK", data: setting.$original });
  }

  public async showSettingById({ params, response }: HttpContextContract) {
    console.log("setting params: ", params);
    let {id} = params
   // const setting = await Setting.query().offset(0).limit(1)
    const setting = await Setting.query().where({id:id}).first();

    if (setting === null) {
      return response.status(200).json({
        status: "OK",
        message: "no general setting matched your search",
        data: [],
      });
    }
    // return setting(s)
    return response.status(200).json({
      status: "OK",
      data: setting.$original,
    });
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const { id } = request.qs();
      console.log("Setting query: ", request.qs());

      let setting = await Setting.query().where({
        id: id,
      });
      console.log(" QUERY RESULT: ", setting);
      if (setting.length > 0) {
        console.log("Investment setting Selected for Update:", setting);
        if (setting) {
          setting[0].isOnboardingAutomated = request.input(
            "isOnboardingAutomated"
          )
            ? request.input("isOnboardingAutomated")
            : setting[0].isOnboardingAutomated;
          setting[0].isTerminationAutomated = request.input(
            "isTerminationAutomated"
          )
            ? request.input("isTerminationAutomated")
            : setting[0].isTerminationAutomated;
          setting[0].tagName = request.input("tagName")
            ? request.input("tagName")
            : setting[0].tagName;

          if (setting) {
            // send to user
            await setting[0].save();
            console.log("Update Investment setting:", setting);
            return setting;
          }
          return; // 422
        } else {
          return response.status(304).json({ status: "FAILED", data: setting });
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
    console.log("Setting query: ", request.qs());

    let setting = await Setting.query().where({
      id: id,
    });
    console.log(" QUERY RESULT: ", setting);

    if (setting.length > 0) {
      setting = await Setting.query()
        .where({
          id: id,
        })
        .delete();
      console.log("Deleted data:", setting);
      return response.send("Setting Deleted.");
    } else {
      return response
        .status(404)
        .json({ status: "FAILED", message: "Invalid parameters" });
    }
  }
}
