/**
 * Gets the text within two parenthesis given a text starting with parenthesis
 * 
 * Example:
 * ```
 * const fooBar = "(Foo) Bar"
 * console.log(getTextWithingParenthesis(fooBar)) // Output: "Foo"
 * ```
 * 
 * @param text string starting with `(`
 * @returns 
 */
export function getTextInParenthesis(text: string) {
  let acc = '';
  let parenthesisCount = 0;

  for (const char of text) {
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
export function splitTextByCommas(text: string) {
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

  results.push(acc);

  return results;
}