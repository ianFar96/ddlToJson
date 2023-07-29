import assert from 'node:assert';
import { describe, it } from 'node:test';
import { parseColumnDefinition, parseCreateTableStatements, parseForeignKeyDefinition, parsePrimaryKeyDefinition } from '../../lib/parsers/parseCreateTableStatements';
import { ColumnDefinition, ForeignKeyDefinition, Statement } from '../../types/statement';

describe('test parseCreateTableStatements', () => {
  it('should work with all available name wrapping characters', () => {
    const line = `CREATE TABLE addresses (
      \`id\` int,
      "customer_id" int,
      [street] varchar(255),
      city varchar(255)
    );`;
    const statements = parseCreateTableStatements(line);

    const expectedStatements: Statement[] = [{
      statement: 'CREATE',
      name: 'addresses',
      columns: [{
        name: 'id',
        type: 'int',
        constraints: ''
      }, {
        name: 'customer_id',
        type: 'int',
        constraints: ''
      }, {
        name: 'street',
        type: 'varchar(255)',
        constraints: ''
      }, {
        name: 'city',
        type: 'varchar(255)',
        constraints: ''
      }],
      primaryKeys: [],
      foreignkeys: []
    }];
    
    assert.deepStrictEqual(statements, expectedStatements);
  });

  it('should ignore unsupported properties', () => {
    const line = `CREATE TABLE Person (
      Address TEXT NOT NULL,
      CHECK(discounted_price < unit_price)
      UNIQUE KEY email (email)
      KEY address_customer (customer_id),
    );`;
    const statements = parseCreateTableStatements(line);

    const expectedStatements: Statement[] = [{
      statement: 'CREATE',
      name: 'Person',
      columns: [{
        name: 'Address',
        type: 'TEXT',
        constraints: 'NOT NULL'
      }],
      primaryKeys: [],
      foreignkeys: []
    }];
    
    assert.deepStrictEqual(statements, expectedStatements);
  });
});

describe('test parseColumnDefinition', () => {
  it('should work with complex data types', () => {
    const line = 'type enum("SHIPPING","BILLING","LIVING") NOT NULL';
    const column = parseColumnDefinition(line);

    const expectedColumn: ColumnDefinition = {
      name: 'type',
      type: 'enum("SHIPPING","BILLING","LIVING")',
      constraints: 'NOT NULL'
    };
    assert.deepStrictEqual(column, expectedColumn);
  });

  it('should work with complex constraints', () => {
    const line = 'Address TEXT CHECK (LENGTH(Address) <= 500)';
    const column = parseColumnDefinition(line);

    const expectedColumn: ColumnDefinition = {
      name: 'Address',
      type: 'TEXT',
      constraints: 'CHECK (LENGTH(Address) <= 500)'
    };
    assert.deepStrictEqual(column, expectedColumn);
  });
});

describe('test parsePrimaryKeyDefinition', () => {
  it('should work with MySQL dialect', () => {
    const line = 'PRIMARY KEY (ID)';
    const primaryKey = parsePrimaryKeyDefinition(line);

    const expectedPrimaryKey: string[] = ['ID'];
    assert.deepStrictEqual(primaryKey, expectedPrimaryKey);
  });

  it('should work with SQL Server dialect', () => {
    const line = 'CONSTRAINT PK_Table1 PRIMARY KEY (ID)';
    const primaryKey = parsePrimaryKeyDefinition(line);

    const expectedPrimaryKey: string[] = ['ID'];
    assert.deepStrictEqual(primaryKey, expectedPrimaryKey);
  });

  it('should work with multiple columns', () => {
    const line = 'CONSTRAINT PK_Table1 PRIMARY KEY (ID1, ID2)';
    const primaryKey = parsePrimaryKeyDefinition(line);

    const expectedPrimaryKey: string[] = ['ID1', 'ID2'];
    assert.deepStrictEqual(primaryKey, expectedPrimaryKey);
  });
});

describe('test parseForeignKeyDefinition', () => {
  it('should work with Standard SQL, SQLite and MySQL dialects', () => {
    const line = 'FOREIGN KEY (Table1ID) REFERENCES Table1(ID)';
    const foreignKey = parseForeignKeyDefinition(line);

    const expectedForeignKey: ForeignKeyDefinition = {
      column: 'Table1ID',
      references: {
        table: 'Table1',
        column: 'ID',
      }
    };
    assert.deepStrictEqual(foreignKey, expectedForeignKey);
  });

  it('should work with SQL Server dialect', () => {
    const line = 'CONSTRAINT FK_Table2_Table1ID FOREIGN KEY (Table1ID) REFERENCES Table1(ID) ON DELETE CASCADE';
    const foreignKey = parseForeignKeyDefinition(line);

    const expectedForeignKey: ForeignKeyDefinition = {
      column: 'Table1ID',
      references: {
        table: 'Table1',
        column: 'ID',
      }
    };
    assert.deepStrictEqual(foreignKey, expectedForeignKey);
  });
});