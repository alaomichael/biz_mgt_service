import { DateTime } from "luxon";
import {
  BaseModel,
  beforeCreate,
  belongsTo,
  BelongsTo,
  column,
} from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuid } from "uuid";
import Merchant from "./Merchant";

export default class Agent extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public userId: string;

  @column()
  public tenantId: string;

  @column()
  public merchantId: string;

  @column()
  public services: JSON;

  @column()
  public otherDetails: JSON;

  @column()
  public long: number;

  @column()
  public lat: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: false })
  public startDate: DateTime;

  @column()
  public requestType: string;

  @column()
  public approvalStatus: string;

  @column()
  public isNotAllowedToUse: JSON;

  @column()
  public isSuspended: boolean;

  @column()
  public status: string;

  @column()
  public timeline: string;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeCreate()
  public static assignUuid(agent: Agent) {
    agent.id = uuid();
  }

  @belongsTo(() => Merchant)
  public merchant: BelongsTo<typeof Merchant>;
}
