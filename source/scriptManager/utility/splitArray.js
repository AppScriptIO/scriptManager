// divide an array into two separate arrays by an item value that equals the provided delimiter
// ['qqq', '--', 'eee', 'ppp'] => ['qqq'], [eee', 'ppp']
export function splitArrayToTwoByDelimiter({ array, delimiter }) {
    let beforeDelimiter = [], afterDelimiter = [];
    let delimiterIndex = array.indexOf(delimiter)
    if(delimiterIndex >= 0 ){
        beforeDelimiter = array.slice(0, delimiterIndex)
        afterDelimiter = array.slice(delimiterIndex + 1)
    } else 
        beforeDelimiter = array

    return [beforeDelimiter, afterDelimiter] // return empty array for `after` delimiter parameter.
}

/** 
 * Split array to two according to conditions
 * @return [<array of matching>, <array of not matching>]
 * Example: 
 *   ['Xz', 'qwr', 'tXt'] where condition is presense of 'X' => ['Xz', 'tXt'], ['qwr']
 */
export function divideArrayByFilter({ array, filterFunc }) {
    return array.reduce(([pass, fail], item) => {
        return filterFunc(item) ? [[...pass, item], fail] : [pass, [...fail, item]];
      }, [[], []]);    
}