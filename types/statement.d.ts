export type BaseStatement = {
  statement: 'CREATE',
  entity: string
}

export type Statement = BaseStatement & (
  {
    statement: 'CREATE',
    columns: ColumnDefinition[]
    primaryKeys: string[],
    foreignkeys?: ForeignKeyDefinition[],
  }
)

export type ColumnDefinition = {
  name: string,
  type: string,
  default?: unknown,
  constraints?: string[]
}

export type ForeignKeyDefinition = {
  name: string,
  column: string,
  references: {
    table: string,
    column: string
  }
}