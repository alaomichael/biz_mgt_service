import { DateTime } from "luxon";
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuid } from "uuid";
import Merchant from "./Merchant";

export default class TransactionRecord extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public tenantId: string;

  @column()
  public merchantId: string;

  @column()
  public agentId: string;

  @column()
  public serviceName: string;

  @column()
  public sender: string;

  @column()
  public receiver: string;

  @column()
  public type: string;

  @column()
  public amount: number;

  @column()
  public recurrent: boolean;

  @column()
  public action: string;

  @column()
  public duration: string;

  @column.dateTime({ autoCreate: false })
  public expiryDate: DateTime;

  @column()
  public limit: boolean;

  @column()
  public limitType: string;

  @column()
  public limitValue: string;

  @column()
  public otherDetails: JSON;

  @column()
  public approvalStatus: string;

  @column()
  public long: number;

  @column()
  public lat: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column()
  public status: string;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;


  @belongsTo(() => Tenant, { localKey: "tenantId" })
  public tenant: BelongsTo<typeof Tenant>;

  @belongsTo(() => Merchant, { localKey: "merchantId" })
  public merchant: BelongsTo<typeof Merchant>;

  @belongsTo(() => Loan, { localKey: "loanId" })
  public loan: BelongsTo<typeof Loan>;

  @beforeCreate()
  public static assignUuid(transactionRecord: TransactionRecord) {
    transactionRecord.id = uuid();
  }
}
