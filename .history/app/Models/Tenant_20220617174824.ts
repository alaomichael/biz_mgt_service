import { DateTime } from "luxon";
import { column, beforeCreate, BaseModel, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuid } from "uuid";
import Merchant from "./Merchant";

export default class Tenant extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public userId: string;

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

  @hasMany(() => Merchant)
  public merchants: HasMany<typeof Merchant>;

  @hasMany(() => Merchant)
  public merchants: HasMany<typeof Merchant>;

  @beforeCreate()
  public static assignUuid(tenant: Tenant) {
    tenant.id = uuid();
  }
}
