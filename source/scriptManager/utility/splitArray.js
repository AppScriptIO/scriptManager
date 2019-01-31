
// divide an array into two separate arrays by an item value that equals the provided delimiter
export function splitArrayToTwoByDelimiter({ array, delimiter }) {
    let beforeDelimiter = [], afterDelimiter = [];
    let delimiterIndex = array.indexOf(delimiter)
    if(delimiterIndex){
        beforeDelimiter = array.slice(0, delimiterIndex)
        afterDelimiter = array.slice(delimiterIndex + 1)
    } else 
        beforeDelimiter = array

    return [beforeDelimiter, afterDelimiter] // return empty array for `after` delimiter parameter.
}