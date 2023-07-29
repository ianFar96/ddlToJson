/* eslint-disable no-case-declarations */
import { ColumnDefinition, ForeignKeyDefinition, Statement } from '../../types/statement';
import { getColumnDefinitionRegex, getCreateTableRegex, getForeignKeyDefinitionRegex, getInlineForeignKeyDefinitionRegex, getNameWrappingCharactersRegex, getPrimaryKeyDefinitionRegex, getUnsupportedKeywordsRegex } from '../regexes';
import { getTextInParenthesis, splitTextByCommas } from '../utils';

export function parseCreateTableStatements(ddlFileContents: string) {
  const statements: Statement[] = [];
  
  const createTableRegexResults = ddlFileContents.matchAll(getCreateTableRegex());
  for (const match of createTableRegexResults ?? []) {
    if (!match.groups?.name) {
      throw new Error(`Parsing error: Table name not found for CREATE TABLE statement; Statement: ${match[0]}`);
    }
  
    if (!match.groups?.rest) {
      throw new Error(`Parsing error: Table definition not found for CREATE TABLE statement; Statement: ${match[0]}`);
    }
  
    // We remove all line breaks to ensure we have no logic based around them
    // In DDL syntax the line breaks can be ommited and the syntax is still valid
    const restWithoutLineBreaks = match.groups.rest.replaceAll('\n', '');
    const definition = getTextInParenthesis(restWithoutLineBreaks);
    const definitionLines = splitTextByCommas(definition).map(line => line.trim());

    const {columns, primaryKey, foreignKeys} = parseTableDefinition(definitionLines);

    statements.push({
      statement: 'CREATE',
      name: match.groups.name.replace(getNameWrappingCharactersRegex(), ''),
      columns,
      primaryKey,
      foreignKeys
    });
  }

  return statements;
}

function parseTableDefinition(definitionLines: string[]) {
  const columns: ColumnDefinition[] = [];
  let primaryKey: string[] = [];
  const foreignKeys: ForeignKeyDefinition[] = [];
  
  for (const line of definitionLines) {
    switch (true) {
    case getPrimaryKeyDefinitionRegex().test(line):
      primaryKey = parsePrimaryKeyDefinition(line);
      break;

    case getForeignKeyDefinitionRegex().test(line):
      foreignKeys.push(parseForeignKeyDefinition(line));
      break;

    // Skip lines with keyword we do not support
    // Any other line will be considered a column definition
    case getUnsupportedKeywordsRegex().test(line):
      break;

    case getColumnDefinitionRegex().test(line):
      // A single column definition can define also the primary or foreign key
      const {column, foreignKey, isPrimaryKey} = parseColumnDefinition(line);

      columns.push(column);
      if(foreignKey) { foreignKeys.push(foreignKey); }
      if(isPrimaryKey) { primaryKey = [column.name]; }
      break;
    }
  }

  return {
    columns,
    primaryKey,
    foreignKeys
  };
}

export function parseColumnDefinition(line: string) {
  const groups = getColumnDefinitionRegex().exec(line)!.groups!;

  const columnDefinition: ColumnDefinition = {
    name: groups.name.replace(getNameWrappingCharactersRegex(), ''),
    type: groups.type,
    constraints: groups.constraints || ''
  };

  const isPrimaryKey = columnDefinition.constraints.toUpperCase().includes('PRIMARY KEY');

  let foreignKey: ForeignKeyDefinition | undefined; 
  if (getInlineForeignKeyDefinitionRegex().test(columnDefinition.constraints)) {
    const groups = getInlineForeignKeyDefinitionRegex().exec(line)!.groups!;
    
    foreignKey = {
      column: columnDefinition.name,
      references: {
        table: groups.referenceTable.replace(getNameWrappingCharactersRegex(), ''),
        column: groups.referenceColumn.replace(getNameWrappingCharactersRegex(), '')
      }
    };
  }

  return {
    column: columnDefinition,
    isPrimaryKey,
    foreignKey
  };
}

export function parsePrimaryKeyDefinition(line: string) {
  const groups = getPrimaryKeyDefinitionRegex().exec(line)!.groups!;

  const primaryKey = groups.columns
    .replace(getNameWrappingCharactersRegex(), '')
    .replace(/\s/gm, '')
    .split(',');
  return primaryKey;
}

export function parseForeignKeyDefinition(line: string) {
  const groups = getForeignKeyDefinitionRegex().exec(line)!.groups!;

  const foreignKeyDefinition: ForeignKeyDefinition = {
    column: groups.column.replace(getNameWrappingCharactersRegex(), ''),
    references: {
      table: groups.referenceTable.replace(getNameWrappingCharactersRegex(), ''),
      column: groups.referenceColumn.replace(getNameWrappingCharactersRegex(), '')
    }
  };

  return foreignKeyDefinition;
}