import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from "uuid";
import Agent from './Agent';
import Tenant from './Tenant';

export default class Merchant extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public userId: string;

  @column()
  public tenantId: string;

  @column()
  public services: JSON;

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
  public static assignUuid(merchant: Merchant) {
    merchant.id = uuid();
  }

  @belongsTo(() => Tenant)
  public tenant: BelongsTo<typeof Tenant>;

  @hasMany(() => Agent)
  public agents: HasMany<typeof Agent>;
}