import {emptyForm} from './app-lib';
import {NUMBER_NAMES, STRING_NAMES} from "./data";

describe('emptyForm', () => {
  const result = emptyForm();
  it('creates valid initial numbers', () => {
    const number = result.get(NUMBER_NAMES[0]);
    expect(number).toEqual(0);
  });
  it('creates valid initial strings', () => {
    const string = result.get(STRING_NAMES[0]);
    expect(string).toEqual('');
  });
  it('creates valid initial amount', () => {
    const amount = result.get('amount');
    expect(NUMBER_NAMES[0]).not.toEqual('amount');
    expect(amount).toEqual(1);
  });
});