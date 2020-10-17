/**
 * Full credit to 'ChriwW' from StackOverflow. I really liked his approach as I thought it would
 * produce the tidiest test cases by providing expected values.
 *
 * @param loaded - TODO
 * @param wanted - TODO
 * @param optional - TODO
 */
export function assertTypeT<T>(loaded: any, wanted: T, optional?: Set<string>): T {
    // this is called recursively to compare each element
    // tslint:disable-next-line:no-shadowed-variable
    function assertType(found: any, wanted: any, keyNames?: string): void {
        if (typeof wanted !== typeof found) {
            throw new Error(`assertType expected ${typeof wanted} but found ${typeof found}`);
        }
        switch (typeof wanted) {
            case "boolean":
            case "number":
            case "string":
                return; // primitive value type -- done checking
            case "object":
                break; // more to check
            case "undefined":
            case "symbol":
            case "function":
            default:
                throw new Error(`assertType does not support ${typeof wanted}`);
        }
        if (Array.isArray(wanted)) {
            if (!Array.isArray(found)) {
                throw new Error(`assertType expected an array but found ${found}`);
            }
            if (wanted.length === 1) {
                // assume we want a homogenous array with all elements the same type
                for (const element of found) {
                    assertType(element, wanted[0]);
                }
            } else {
                // assume we want a tuple
                if (found.length !== wanted.length) {
                    throw new Error(
                        `assertType expected tuple length ${wanted.length} found ${found.length}`);
                }
                for (let i = 0; i < wanted.length; ++i) {
                    assertType(found[i], wanted[i]);
                }
            }
            return;
        }
        for (const key in wanted) {
            if (!wanted.hasOwnProperty(key)) continue;

            const expectedKey = keyNames ? keyNames + "." + key : key;
            if (typeof found[key] === 'undefined') {
                if (!optional || !optional.has(expectedKey)) {
                    throw new Error(`assertType expected key ${expectedKey}`);
                }
            } else {
                assertType(found[key], wanted[key], expectedKey);
            }
        }
    }

    assertType(loaded, wanted);
    return loaded as T;
}
