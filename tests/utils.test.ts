import { describe, it } from 'node:test';
import { getTextInParenthesis, splitTextByCommas } from '../lib/utils';
import assert from 'node:assert';

describe('test getTextInParenthesis', () => {
  it('should work', async () => {
    const text = '(Must return (all the text (between the first parenthesis))) But not this part';
    
    const result = getTextInParenthesis(text);
    const expectedResult = 'Must return (all the text (between the first parenthesis))';

    assert.equal(result, expectedResult);
  });
});

describe('test splitTextByCommas', () => {
  it('should work', async () => {
    const text = 'Should return, this splitted text, but not what\'s between this enum("One", "Two", "Three"), and also this';
    
    const result = splitTextByCommas(text);
    const expectedResult = [
      'Should return',
      ' this splitted text',
      ' but not what\'s between this enum("One", "Two", "Three")',
      ' and also this'
    ];

    assert.deepStrictEqual(result, expectedResult);
  });
});