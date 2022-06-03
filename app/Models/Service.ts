import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from "uuid";

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public price: number;

  @column()
  public recurrent: boolean;

  @column()
  public recurrentType: string;

  @column()
  public limit: boolean;

  @column()
  public limitType: string;


  @column()
  public limitValue: string;

  @column()
  public otherDetails: JSON;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column()
  public status: string;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeCreate()
  public static assignUuid(service: Service) {
    service.id = uuid();
  }
}
