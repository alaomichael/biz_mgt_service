import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from "uuid";

export default class Tenantapproval extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public userId: string;

  @column()
  public merchantTableId: string;

  @column()
  public requestType: string;

  @column()
  public approvalStatus: string;

  @column()
  public remark: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeCreate()
  public static assignUuid(tenantapproval: Tenantapproval) {
    tenantapproval.id = uuid();
  }
}
