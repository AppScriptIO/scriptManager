// check if command argument (string) is a Javascript code that should be evaluated on an imported module. This allows for exposing modules to commandline with javascript code, i.e. execute js in commandline.
export function isJSCodeToEvaluate({ 
  string, 
  // e.g. '(' for executing function, '.' maybe used through '.apply' to execute 'scriptManager' function.
  symbolsForActingOnExports = ['(', '.', '['] // exported modules could be function or objects, the operator to evaluate them starts with one of these symbols.
}) {
  if (!string) return false
  return symbolsForActingOnExports.some(symbol => string.startsWith(symbol))
}
