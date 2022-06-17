import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transaction_records'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
       table.uuid("id").primary().index().unique().notNullable();
        table.uuid("id").primary().index().unique().notNullable();
         table.uuid("merchantId").primary().index().unique().notNullable();
       table.text("user_id").unsigned().notNullable().unique().index();
      
        table
          .string("request_type", 255)
          .notNullable()
          .defaultTo("register tenant")
          .index();
        table
          .string("approval_status", 255)
          .notNullable()
          .defaultTo("pending")
          .index();
 table.float('long').unsigned().nullable()
      table.float('lat').unsigned().nullable()


      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
