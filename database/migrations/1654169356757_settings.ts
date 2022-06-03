import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Settings extends BaseSchema {
  protected tableName = "settings";

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
          "tag_name",
        ],
        "setting_full_index"
      );
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
