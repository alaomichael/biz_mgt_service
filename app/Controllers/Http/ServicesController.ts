import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Service from "App/Models/Service";
// import { DateTime } from 'luxon'
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Event from "@ioc:Adonis/Core/Event";
export default class ServicesController {
  public async index({ params, request, response }: HttpContextContract) {
    console.log("service params: ", params);
    const {
      serviceName,
      price,
      recurrent,
      recurrentType,
      hasLimit,
      limitType,
      limitValue,
      status,
      limit,
    } = request.qs();
    console.log("service query: ", request.qs());

    // const service = await Service.query().offset(0).limit(1)
    const service = await Service.all();
    let sortedServices = service;

    if (serviceName) {
      sortedServices = sortedServices.filter((service) => {
        // @ts-ignore
        return service.name!.includes(serviceName);
      });
    }
    if (price) {
      sortedServices = sortedServices.filter((service) => {
        // @ts-ignore
        return service.price.toString() === price;
      });
    }

    if (recurrent) {
      sortedServices = sortedServices.filter((service) => {
        // @ts-ignore
        return service.recurrent.toString() === recurrent;
      });
    }

    if (recurrentType) {
      sortedServices = sortedServices.filter((service) => {
        // @ts-ignore
        return service.recurrentType!.includes(recurrentType);
      });
    }

    if (hasLimit) {
      sortedServices = sortedServices.filter((service) => {
        // @ts-ignore
        return service.limit.toString() === hasLimit;
      });
    }
    if (limitType) {
      sortedServices = sortedServices.filter((service) => {
        // @ts-ignore
        return service.limitType!.includes(limitType);
      });
    }
    if (limitValue) {
      sortedServices = sortedServices.filter((service) => {
        // @ts-ignore
        return service.limitValue!.includes(limitValue);
      });
    }
    if (status) {
      sortedServices = sortedServices.filter((service) => {
        // @ts-ignore
        return service.status!.includes(status);
      });
    }
    if (limit) {
      sortedServices = sortedServices.slice(0, Number(limit));
    }
    if (sortedServices.length < 1) {
      return response.status(200).json({
        status: "OK",
        message: "no service matched your search",
        data: [],
      });
    }
    // return service(s)
    return response.status(200).json({
      status: "OK",
      data: sortedServices.map((service) => service.$original),
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
    const service = await Service.create(payload);

    await service.save();
    console.log("The new service:", service);

    // TODO
    console.log("A New service has been Created.");

    // Save service new status to Database
    await service.save();
    // Send service Creation Message to Queue

    Event.emit("new:service", {
      id: service.id,
      // @ts-ignore
      extras: service.additionalDetails,
    });
    return response.json({ status: "OK", data: service.$original });
  }

  public async showServiceById({ params, response }: HttpContextContract) {
    console.log("service params: ", params);
    let { id } = params;
    // const service = await Service.query().offset(0).limit(1)
    const service = await Service.query().where({ id: id }).first();

    if (service === null) {
      return response.status(200).json({
        status: "OK",
        message: "no service matched your search",
        data: [],
      });
    }
    // return service(s)
    return response.status(200).json({
      status: "OK",
      data: service.$original,
    });
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const { id } = request.qs();
      console.log("Service query: ", request.qs());

      let service = await Service.query()
        .where({
          id: id,
        })
        .first();
      console.log(" QUERY RESULT: ", service);
      if (service !== null) {
        console.log("Investment service Selected for Update:", service);
        if (service) {
          service.name = request.input("productName")
            ? request.input("productName")
            : service.name;
          service.price = request.input("price")
            ? request.input("price")
            : service.price;
          service.recurrent = request.input("recurrent")
            ? request.input("recurrent")
            : service.recurrent;
          service.recurrentType = request.input("recurrentType")
            ? request.input("recurrentType")
            : service.recurrentType;
          service.limit = request.input("limit")
            ? request.input("limit")
            : service.limit;
          service.limitType = request.input("limitType")
            ? request.input("limitType")
            : service.limitType;
          service.limitValue = request.input("limitValue")
            ? request.input("limitValue")
            : service.limitValue;
          service.otherDetails = request.input("otherDetails")
            ? request.input("otherDetails")
            : service.otherDetails;
          service.status = request.input("status")
            ? request.input("status")
            : service.status;

          if (service) {
            // send to user
            await service.save();
            console.log("Update Investment service:", service);
            return service.$original;
          }
          return; // 422
        } else {
          return response.status(304).json({ status: "FAILED", data: service });
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
    console.log("Service query: ", request.qs());

    let service = await Service.query().where({
      id: id,
    });
    console.log(" QUERY RESULT: ", service);

    if (service.length > 0) {
      service = await Service.query()
        .where({
          id: id,
        })
        .delete();
      console.log("Deleted data:", service);
      return response.send("Service Deleted.");
    } else {
      return response
        .status(404)
        .json({ status: "FAILED", message: "Invalid parameters" });
    }
  }
}
