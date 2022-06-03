import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Agents extends BaseSchema {
  protected tableName = "agents";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary().index().unique().notNullable();
      table.text("user_id").unsigned().notNullable().index();
      table
        .text("tenant_id")
        .unsigned()
        .notNullable()
        .index()
        .references("user_id")
        .inTable("tenants")
        .onDelete("CASCADE");
       table
         .text("merchant_id")
         .unsigned()
         .notNullable()
         .index()
         .references("user_id")
         .inTable("merchants")
         .onDelete("CASCADE");
      table.jsonb("services").nullable().index();
      table.jsonb("other_details").nullable().index();
      table.float("long").unsigned().nullable();
      table.float("lat").unsigned().nullable();

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true }).index();
      table.date("start_date").nullable().index();
      table
        .string("request_type", 255)
        .notNullable()
        .defaultTo("register agent")
        .index();
      table
        .string("approval_status", 255)
        .notNullable()
        .defaultTo("pending")
        .index();
        table.jsonb("is_not_allowed_to_use").nullable().index();
         table
           .boolean("is_suspended")
           .notNullable()
           .defaultTo(false)
           .index();
      table.string("status", 255).notNullable().defaultTo("initiated").index();
      table.jsonb("timeline").nullable().index();
      table.timestamp("updated_at", { useTz: true });

      // indexes
      table.index(
        [
          "id",
          "user_id",
          "other_details",
          "tenant_id",
          "merchant_id",
          "services",
          "long",
          "lat",
          "start_date",
          "request_type",
          "approval_status",
          "status",
        ],
        "agents_full_index"
      );
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
