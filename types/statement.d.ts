export type BaseStatement = {
  statement: 'CREATE',
  name: string
}

export type Statement = BaseStatement & (
  {
    statement: 'CREATE',
    columns: ColumnDefinition[]
    primaryKey: string[],
    foreignKeys: ForeignKeyDefinition[],
  }
)

export type ColumnDefinition = {
  name: string,
  type: string,
  constraints: string
}

export type ForeignKeyDefinition = {
  column: string,
  references: {
    table: string,
    column: string
  }
}