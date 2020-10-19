/**
 * Full credit to 'ChriwW' from StackOverflow. I really liked his approach as I thought it would
 * produce the tidiest test cases by providing expected values. This function compares an object
 * with an example object. For every item within subject, it must deeply equal the example.
 *
 * @param subject - the subject to test.
 * @param example - the example to compare to.
 * @param optional - any optional properties to ignore.
 */
export function assertEquals<T>(subject: any, example: T, optional?: Set<string>): T {
  // this is called recursively to compare each element
  // tslint:disable-next-line:no-shadowed-variable
  function assertEquals
  (found: any, wanted: any, keyNames?: string): void {
    if (typeof wanted !== typeof found) {
      throw new Error(`assertEquals
             expected ${typeof wanted} but found ${typeof found}`);
    }
    switch (typeof wanted) {
      case "boolean":
      case "number":
      case "string":
        if (found !== wanted)
          throw new Error(`assertEquals expected '${wanted}' but found '${found}'`);
        return; // primitive value type -- done checking
      case "object":
        break; // more to check
      case "undefined":
      case "symbol":
      case "function":
      default:
        throw new Error(`assertEquals
                 does not support ${typeof wanted}`);
    }
    if (Array.isArray(wanted)) {
      if (!Array.isArray(found)) {
        throw new Error(`assertEquals
                 expected an array but found ${found}`);
      }
      // assume we want a tuple
      if (found.length !== wanted.length) {
        throw new Error(
          `assertEquals
                     expected tuple length ${wanted.length} found ${found.length}`);
      }
      for (let i = 0; i < wanted.length; ++i) {
        assertEquals
        (found[i], wanted[i]);
      }
      return;
    }
    for (const key in wanted) {
      if (!wanted.hasOwnProperty(key)) continue;

      const expectedKey = keyNames ? keyNames + "." + key : key;
      if (typeof found[key] === 'undefined') {
        if (!optional || !optional.has(expectedKey)) {
          throw new Error(`assertEquals
                     expected key ${expectedKey}`);
        }
      } else {
        assertEquals
        (found[key], wanted[key], expectedKey);
      }
    }
  }

  assertEquals
  (subject, example);
  return subject as T;
}
