import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Tenant from "App/Models/Tenant";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Event from "@ioc:Adonis/Core/Event";

export default class TenantsController {
  public async index({ params, request, response }: HttpContextContract) {
    console.log("tenant params: ", params);
    const {
      isOnboardingAutomated,
      isTerminationAutomated,
      tagName,
      limit,
    } = request.qs();
    console.log("tenant query: ", request.qs());
    // const countActiveSetting = await Tenant.query()
    //   .where("investment_type", "fixed")
    // //   .getCount();
    // console.log("tenant Investment count: ", countActiveSetting);

    // const tenant = await Tenant.query().offset(0).limit(1)
    const tenant = await Tenant.all();
    let sortedSettings = tenant;

    if (isOnboardingAutomated) {
      sortedSettings = sortedSettings.filter((tenant) => {
        // @ts-ignore
        return (
          tenant.isOnboardingAutomated.toString() === isOnboardingAutomated
        );
      });
    }

    if (isTerminationAutomated) {
      sortedSettings = sortedSettings.filter((tenant) => {
        // @ts-ignore
        return (
          tenant.isTerminationAutomated.toString() === isTerminationAutomated
        );
      });
    }
    if (tagName) {
      sortedSettings = sortedSettings.filter((tenant) => {
        // @ts-ignore
        return tenant.tagName!.includes(tagName);
      });
    }
    if (limit) {
      sortedSettings = sortedSettings.slice(0, Number(limit));
    }
    if (sortedSettings.length < 1) {
      return response.status(200).json({
        status: "OK",
        message: "no general tenant matched your search",
        data: [],
      });
    }
    // return tenant(s)
    return response.status(200).json({
      status: "OK",
      data: sortedSettings.map((tenant) => tenant.$original),
    });
  }

  public async store({ request, response }: HttpContextContract) {
    // const user = await auth.authenticate()
    const settingSchema = schema.create({
      userId: schema.string({ escape: true }, [rules.maxLength(255)]),
      long: schema.number(),
      lat: schema.number(),
    });
    const payload: any = await request.validate({ schema: settingSchema });
    const tenant = await Tenant.create(payload);

    await tenant.save();
    console.log("The new investment:", tenant);

    // TODO
    console.log("A New tenant has been Created.");

    // Save tenant new status to Database
    await tenant.save();
    // Send tenant Creation Message to Queue

    Event.emit("new:tenant", {
      id: tenant.id,
      // @ts-ignore
      extras: tenant.additionalDetails,
    });
    return response.json({ status: "OK", data: tenant.$original });
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const { id } = request.qs();
      console.log("Tenant query: ", request.qs());

      let tenant = await Tenant.query().where({
        id: id,
      });
      console.log(" QUERY RESULT: ", tenant);
      if (tenant.length > 0) {
        console.log("Investment tenant Selected for Update:", tenant);
        if (tenant) {
          tenant[0].isOnboardingAutomated = request.input(
            "isOnboardingAutomated"
          )
            ? request.input("isOnboardingAutomated")
            : tenant[0].isOnboardingAutomated;
          tenant[0].isTerminationAutomated = request.input(
            "isTerminationAutomated"
          )
            ? request.input("isTerminationAutomated")
            : tenant[0].isTerminationAutomated;
          tenant[0].tagName = request.input("tagName")
            ? request.input("tagName")
            : tenant[0].tagName;

          if (tenant) {
            // send to user
            await tenant[0].save();
            console.log("Update Investment tenant:", tenant);
            return tenant;
          }
          return; // 422
        } else {
          return response.status(304).json({ status: "FAILED", data: tenant });
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
    console.log("Tenant query: ", request.qs());

    let tenant = await Tenant.query().where({
      id: id,
    });
    console.log(" QUERY RESULT: ", tenant);

    if (tenant.length > 0) {
      tenant = await Tenant.query()
        .where({
          id: id,
        })
        .delete();
      console.log("Deleted data:", tenant);
      return response.send("Tenant Deleted.");
    } else {
      return response
        .status(404)
        .json({ status: "FAILED", message: "Invalid parameters" });
    }
  }
}

