import { ColumnDefinition, ForeignKeyDefinition, Statement } from '../../types/statement';
import { getColumnDefinitionRegex, getCreateTableRegex, getNameWrappingCharactersRegex } from '../regexes';

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

    const {columns, primaryKeys, foreignkeys} = parseTableDefinition(definitionLines);

    statements.push({
      statement: 'CREATE',
      name: match.groups.name.replace(getNameWrappingCharactersRegex(), ''),
      columns,
      primaryKeys,
      foreignkeys
    });
  }

  return statements;
}

/**
 * Gets the text within two parenthesis given a text starting with parenthesis
 * 
 * Example:
 * ```
 * const fooBar = "(Foo) Bar"
 * console.log(getTextWithingParenthesis(fooBar)) // Output: "Foo"
 * ```
 * 
 * @param restStatement string starting with `(`
 * @returns 
 */
function getTextInParenthesis(restStatement: string) {
  let acc = '';
  let parenthesisCount = 0;

  for (const char of restStatement) {
    if (char === '(') {
      parenthesisCount++;
    } else if (char === ')') {
      parenthesisCount--;
    }

    acc += char;
    
    if (parenthesisCount === 0) {
      break;
    }
  }

  return acc.slice(1, -1);
}

/**
 * Split text by commas, ignoring the commas between parenthesis
 * 
 * Example:
 * ```
 * const fooBar = "One, enum(Two, Three), Four"
 * console.log(getTextWithingParenthesis(fooBar)) // Output: "['One', 'enum(Two, Three)', 'Four']"
 * ```
 * 
 * @param text text
 * @returns 
 */
function splitTextByCommas(text: string) {
  const results: string[] = [];

  let acc = '';
  let parenthesisCount = 0;

  for (const char of text) {
    if (char === '(') {
      parenthesisCount++;
    } else if (char === ')') {
      parenthesisCount--;
    }
    
    if (parenthesisCount === 0 && char === ',') {
      results.push(acc);
      acc = '';
    } else {
      acc += char;
    }
  }

  return results;
}

function parseTableDefinition(definitionLines: string[]) {
  const columns: ColumnDefinition[] = [];
  const primaryKeys: string[] = [];
  const foreignkeys: ForeignKeyDefinition[] = [];
  
  for (const line of definitionLines) {
    if (getColumnDefinitionRegex().test(line)) {
      columns.push(parseColumnDefinition(line));
    }
  }

  console.log({columns});
  

  return {
    columns,
    primaryKeys,
    foreignkeys
  };
}

function parseColumnDefinition(line: string) {
  const groups = getColumnDefinitionRegex().exec(line)!.groups!;

  const columnDefinition: ColumnDefinition = {
    name: groups.name.replace(getNameWrappingCharactersRegex(), ''),
    type: groups.type,
    constraints: groups.constraints
  };

  return columnDefinition;
}