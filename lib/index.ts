import { Statement } from '../types/statement';
import { parseCreateTableStatements } from './parsers/parseCreateTableStatements';

export default function ddlToJson(ddlFileContents: string) {
  const statements: Statement[] = [];
  
  // Parse and push CREATE TABLE statements
  const cerateTableStatements = parseCreateTableStatements(ddlFileContents);
  statements.push(...cerateTableStatements);

  return statements;
}