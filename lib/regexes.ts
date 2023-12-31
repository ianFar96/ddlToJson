/**
 * Regexes must be functions so they return every time a copy of the regex
 * This is because there are bugs on the regex engine in JS
 * Which makes regexes not reset properly once they are used
 * So the results of their functions become unpredictable 
 * https://stackoverflow.com/a/3891672/7277753
 */

export const getCreateTableRegex = () => /CREATE TABLE (?<name>.*?) (?<rest>\(.*?);/gmsi;
export const getColumnDefinitionRegex = () => /^(?<name>.*?|".*?"|`.*?`|\[.*?\])\s(?<type>(?:\w+\s*\([^)]+\))|\S+)\s?(?<constraints>.*)?$/;
export const getNameWrappingCharactersRegex = () => /`|"|\[|\]/gm;
export const getPrimaryKeyDefinitionRegex = () => /PRIMARY KEY \((?<columns>.*?)\)/gmi;
export const getForeignKeyDefinitionRegex = () => /FOREIGN KEY \((?<column>.*?)\) REFERENCES (?<referenceTable>.*?)\s?\((?<referenceColumn>.*?)\)/gmi;
export const getInlineForeignKeyDefinitionRegex = () => /REFERENCES (?<referenceTable>.*?)\s?\((?<referenceColumn>.*?)\)/gmi;
export const getInlinePrimaryKeyDefinitionRegex = () => /PRIMARY KEY/gmi;
export const getUnsupportedKeywordsRegex = () => /^KEY|UNIQUE|CHECK/gmi;