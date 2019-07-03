import {memoize, PMap} from "./immutable-lib";
import {Seq} from 'immutable';
import {NUMBER_NAMES, STRING_NAMES} from "./data";

export function emptyForm() {
  let entries = Seq(NUMBER_NAMES.map(x => [x, 0]));
  entries = entries.concat([['amount', 1]]);
  entries = entries.concat(STRING_NAMES.map(x => [x, '']));
  return PMap(entries);
}
emptyForm = memoize(emptyForm);
