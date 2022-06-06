import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "subscriptions";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary().index().unique().notNullable();
      table.text("merchant_id").notNullable().index();
      table.text("agent_id").nullable().index();
      table.text("name").notNullable().index();
      table.integer("price").unsigned().notNullable().index();
      table
        .boolean("recurrent")
        .unsigned()
        .notNullable()
        .defaultTo("false")
        .index();
      table.string("recurrent_type").nullable().index();
      table.string("duration").nullable().index();
      table.string("expiry_date").nullable().index();
      table
        .boolean("limit")
        .unsigned()
        .notNullable()
        .defaultTo("false")
        .index();
      table.string("limit_type").unsigned().nullable().index();
      table.string("limit_value").unsigned().nullable().index();
      table.jsonb("other_details").nullable().index();

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true }).index();
      table.string("status", 255).notNullable().defaultTo("active").index();
      table.timestamp("updated_at", { useTz: true });

      // indexes
      table.index(
        [
          "id",
          "name",
          "price",
          "recurrent",
          "recurrent_type",
          "expiry_date",
          "limit",
          "limit_type",
          "limit_value",
          "other_details",
          "duration",
          "status",
          "merchant_id",
          "agent_id",
        ],
        "subscriptions_full_index"
      );
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
