import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "transaction_records";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary().index().unique().notNullable();
      table
        .uuid("tenant_id")
        .references("id")
        .inTable("tenants")
        .notNullable()
        .index()
        .onDelete("CASCADE");
      table
        .uuid("merchant_id")
        .references("id")
        .inTable("merchants")
        .notNullable()
        .index()
        .onDelete("CASCADE");
      table
        .uuid("agent_id")
        .references("id")
        .inTable("agents")
        .notNullable()
        .index()
        .onDelete("CASCADE");

      table.string("sender",255).notNullable().index();
        table
          .string("receiver", 255)
          .notNullable()
          .defaultTo("nil")
          .index();
 table.string("service_name", 255).notNullable().index();

      table
        .string("type", 255)
        .notNullable()
        .defaultTo("register tenant")
        .index();
        table.float("amount").notNullable().defaultTo(0);

        table.boolean("recurrent").notNullable().defaultTo(false);
        table.string("action",255).nullable();
        table.string("duration",255).nullable
      table
        .string("approval_status", 255)
        .notNullable()
        .defaultTo("pending")
        .index();
      table.float("long").unsigned().nullable();
      table.float("lat").unsigned().nullable();

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
