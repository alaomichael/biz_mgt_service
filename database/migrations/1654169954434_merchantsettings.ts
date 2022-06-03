import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'merchantsettings'


  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary().index().unique().notNullable();
           table
             .boolean("is_onboarding_automated")
             .notNullable()
             .defaultTo(false)
             .index();
           table
             .boolean("is_termination_automated")
             .notNullable()
             .defaultTo(false)
             .index();
              table
                .boolean("is_daily_contribution_automated")
                .notNullable()
                .defaultTo(false)
                .index();
              table
                .boolean("is_deposit_automated")
                .notNullable()
                .defaultTo(false)
                .index();
                 table
                   .boolean("is_withdrawal_automated")
                   .notNullable()
                   .defaultTo(false)
                   .index();
                 table
                   .boolean("is_tellering_automated")
                   .notNullable()
                   .defaultTo(false)
                   .index();
                   table
                     .boolean("is_transfer_automated")
                     .notNullable()
                     .defaultTo(false)
                     .index();
                   table
                     .boolean("is_bill_payment_automated")
                     .notNullable()
                     .defaultTo(false)
                     .index();
                   table
                     .boolean("is_voucher_automated")
                     .notNullable()
                     .defaultTo(false)
                     .index();
           table.string("tag_name", 255).nullable();

           /**
            * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
            */
           table.timestamp("created_at", { useTz: true }).index();

           // table.timestamp('date_payout_was_done', { useTz: true })

           table.timestamp("updated_at", { useTz: true });

           // indexes
           table.index(
             [
               "id",
               "is_onboarding_automated",
               "is_termination_automated",
               "is_daily_contribution_automated",
               "is_deposit_automated",
               "is_withdrawal_automated",
               "is_tellering_automated",
               "is_transfer_automated",
               "is_bill_payment_automated",
               "is_voucher_automated",
               "tag_name",
             ],
             "merchant_setting_full_index"
           );
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
