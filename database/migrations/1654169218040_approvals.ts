import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Approvals extends BaseSchema {
  protected tableName = "approvals";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary().index().unique().notNullable();
      table.text("user_id").unsigned().notNullable().index();
      table.text("tenant_table_id").unsigned().notNullable().index();
      table.string("request_type", 100).notNullable().index();
      table
        .string("approval_status", 100)
        .nullable()
        .index()
        .defaultTo("pending");
      table.string("remark", 100).nullable().index();
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });

      table.index(
        [
          "id",
          "user_id",
          "tenant_table_id",
          "request_type",
          "approval_status",
          "remark",
        ],
        "approval_full_index"
      );
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
