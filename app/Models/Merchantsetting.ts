
import { DateTime } from "luxon";
import { column, beforeCreate, BaseModel } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuid } from "uuid";

export default class Merchantsetting extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public isOnboardingAutomated: boolean;

  @column()
  public isTerminationAutomated: boolean;

  @column()
  public isDailyContributionAutomated: boolean;

  @column()
  public isDepositAutomated: boolean;

  @column()
  public isWithdrawalAutomated: boolean;

  @column()
  public isTelleringAutomated: boolean;

  @column()
  public isTransferAutomated: boolean;

  @column()
  public isBillPaymentAutomated: boolean;

  @column()
  public isVoucherAutomated: boolean;

  @column()
  public tagName: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeCreate()
  public static assignUuid(merchantsetting: Merchantsetting) {
    merchantsetting.id = uuid();
  }
}
