"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");







var _path = _interopRequireDefault(require("path"));


var _vm = _interopRequireDefault(require("vm"));
var _functionalityConfig = _interopRequireDefault(require("../functionality.config.js"));
var _parseKeyValuePairSeparatedBySymbol = require("@dependency/parseKeyValuePairSeparatedBySymbol");
var _configurationManagement = require("@deployment/configurationManagement");
var _script = require("../script.js");
var _loadStdin = require("../utility/loadStdin.js");
var _isJSCodeToEvaluate = require("../utility/isJSCodeToEvaluate.js");
var _splitArray = require("../utility/splitArray.js");let style = { title: '\x1b[33m\x1b[1m\x1b[7m\x1b[36m', message: '\x1b[96m', italic: '\x1b[2m\x1b[3m', default: '\x1b[0m' };console.log(`\x1b[2m\x1b[3m%s\x1b[0m`, `• Environment variables:`);console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `Command:`, `${process.argv.join(' ')}`);console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `entrypointConfigurationKey = ${process.env.entrypointConfigurationKey}`);console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `entrypointConfigurationPath = ${process.env.entrypointConfigurationPath}`);console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `targetAppBasePath = ${process.env.targetAppBasePath}`);

cliInterface().catch(error => console.error(error));























async function cliInterface({
  commandArgument = process.argv.slice(2),
  argumentDelimiter = '-',
  currentDirectory = process.env.PWD || process.cwd(),
  envrironmentArgument = process.env,
  scriptKeyToInvoke,
  targetProjectConfigPath,
  jsCodeToEvaluate,
  shouldCompileScript } =
[]) {






  let standartInputData = await (0, _loadStdin.loadStdin)();

  let [ownCommandArgument, targetScriptCommandArgument] = (0, _splitArray.splitArrayToTwoByDelimiter)({ array: commandArgument, delimiter: argumentDelimiter });
  let [pairArgument, nonPairArgument] = (0, _splitArray.divideArrayByFilter)({ array: ownCommandArgument, filterFunc: item => item.includes('=') });
  let parsedCommandArgument = (0, _parseKeyValuePairSeparatedBySymbol.parseKeyValuePairSeparatedBySymbolFromArray)({ array: pairArgument, separatingSymbol: '=' });

  process.argv = [process.argv[0], process.argv[1], ...targetScriptCommandArgument];


  let configurationFileLookupCallback = configPath => {
    configPath = (0, _configurationManagement.configurationFileLookup)({
      configurationPath: configPath,
      currentDirectory,
      configurationBasePath: _functionalityConfig.default.targetApp.configurationBasePath }).
    path;

    console.assert(require.resolve(configPath), '\x1b[41m%s\x1b[0m', `❌ Configuration file doesn't exist in ${configPath}`);
    return configPath;
  };


  async function evaluateInterface() {
    scriptKeyToInvoke || (scriptKeyToInvoke = envrironmentArgument.scriptKeyToInvoke);
    targetProjectConfigPath || (targetProjectConfigPath = standartInputData || envrironmentArgument.targetConfig);
    shouldCompileScript || (shouldCompileScript = envrironmentArgument.shouldCompileScript);
    targetProjectConfigPath = configurationFileLookupCallback(targetProjectConfigPath);

    let codeToEvaluateForOwnModule = ownCommandArgument[0],
    defaultEvaluateCallValueForFirstParameter = { targetProjectConfigPath, scriptKeyToInvoke, jsCodeToEvaluate, shouldCompileScript };

    let contextEnvironment = _vm.default.createContext(
    Object.assign(global, {


      _requiredModuleScriptManagerWrapper_: async (...args) => {


        args[0] = Object.assign(defaultEvaluateCallValueForFirstParameter, args[0]);
        await (0, _script.scriptManager)(...args).catch(error => console.log(error));
      } }));


    try {

      let vmScript = new _vm.default.Script(`_requiredModuleScriptManagerWrapper_${codeToEvaluateForOwnModule}`, {
        filename: _path.default.resolve('../') });


      vmScript.runInContext(contextEnvironment, { breakOnSigint: true });
    } catch (error) {
      console.log(`❌ Running 'vm runInContext' code failed during execution.`);
      throw error;
    }
  }


  async function passedArgumentInterface() {
    scriptKeyToInvoke || (scriptKeyToInvoke = parsedCommandArgument.scriptKeyToInvoke || envrironmentArgument.scriptKeyToInvoke || nonPairArgument[0]);
    jsCodeToEvaluate || (jsCodeToEvaluate = parsedCommandArgument.jsCodeToEvaluate || envrironmentArgument.scriptKeyToInvoke || nonPairArgument[1]);
    shouldCompileScript || (shouldCompileScript = parsedCommandArgument.shouldCompileScript || envrironmentArgument.shouldCompileScript || nonPairArgument[2]);
    process.argv[1] = scriptKeyToInvoke || process.argv[1];

    targetProjectConfigPath || (targetProjectConfigPath = parsedCommandArgument.targetConfig || standartInputData || envrironmentArgument.targetConfig);
    targetProjectConfigPath = configurationFileLookupCallback(targetProjectConfigPath);
    await (0, _script.scriptManager)({ targetProjectConfigPath, scriptKeyToInvoke, jsCodeToEvaluate, shouldCompileScript }).catch(error => console.error(error));
  }


  (0, _isJSCodeToEvaluate.isJSCodeToEvaluate)({ string: nonPairArgument[0] }) ? await evaluateInterface() : await passedArgumentInterface();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9jbGllbnRJbnRlcmZhY2UvY29tbWFuZExpbmUuanMiXSwibmFtZXMiOlsic3R5bGUiLCJ0aXRsZSIsIm1lc3NhZ2UiLCJpdGFsaWMiLCJkZWZhdWx0IiwiY29uc29sZSIsImxvZyIsInByb2Nlc3MiLCJhcmd2Iiwiam9pbiIsImVudiIsImVudHJ5cG9pbnRDb25maWd1cmF0aW9uS2V5IiwiZW50cnlwb2ludENvbmZpZ3VyYXRpb25QYXRoIiwidGFyZ2V0QXBwQmFzZVBhdGgiLCJjbGlJbnRlcmZhY2UiLCJjYXRjaCIsImVycm9yIiwiY29tbWFuZEFyZ3VtZW50Iiwic2xpY2UiLCJhcmd1bWVudERlbGltaXRlciIsImN1cnJlbnREaXJlY3RvcnkiLCJQV0QiLCJjd2QiLCJlbnZyaXJvbm1lbnRBcmd1bWVudCIsInNjcmlwdEtleVRvSW52b2tlIiwidGFyZ2V0UHJvamVjdENvbmZpZ1BhdGgiLCJqc0NvZGVUb0V2YWx1YXRlIiwic2hvdWxkQ29tcGlsZVNjcmlwdCIsInN0YW5kYXJ0SW5wdXREYXRhIiwib3duQ29tbWFuZEFyZ3VtZW50IiwidGFyZ2V0U2NyaXB0Q29tbWFuZEFyZ3VtZW50IiwiYXJyYXkiLCJkZWxpbWl0ZXIiLCJwYWlyQXJndW1lbnQiLCJub25QYWlyQXJndW1lbnQiLCJmaWx0ZXJGdW5jIiwiaXRlbSIsImluY2x1ZGVzIiwicGFyc2VkQ29tbWFuZEFyZ3VtZW50Iiwic2VwYXJhdGluZ1N5bWJvbCIsImNvbmZpZ3VyYXRpb25GaWxlTG9va3VwQ2FsbGJhY2siLCJjb25maWdQYXRoIiwiY29uZmlndXJhdGlvblBhdGgiLCJjb25maWd1cmF0aW9uQmFzZVBhdGgiLCJvd25Db25maWd1cmF0aW9uIiwidGFyZ2V0QXBwIiwicGF0aCIsImFzc2VydCIsInJlcXVpcmUiLCJyZXNvbHZlIiwiZXZhbHVhdGVJbnRlcmZhY2UiLCJ0YXJnZXRDb25maWciLCJjb2RlVG9FdmFsdWF0ZUZvck93bk1vZHVsZSIsImRlZmF1bHRFdmFsdWF0ZUNhbGxWYWx1ZUZvckZpcnN0UGFyYW1ldGVyIiwiY29udGV4dEVudmlyb25tZW50Iiwidm0iLCJjcmVhdGVDb250ZXh0IiwiT2JqZWN0IiwiYXNzaWduIiwiZ2xvYmFsIiwiX3JlcXVpcmVkTW9kdWxlU2NyaXB0TWFuYWdlcldyYXBwZXJfIiwiYXJncyIsInZtU2NyaXB0IiwiU2NyaXB0IiwiZmlsZW5hbWUiLCJydW5JbkNvbnRleHQiLCJicmVha09uU2lnaW50IiwicGFzc2VkQXJndW1lbnRJbnRlcmZhY2UiLCJzdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBUUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBbEJBLElBQUlBLEtBQUssR0FBRyxFQUFFQyxLQUFLLEVBQUUsZ0NBQVQsRUFBMkNDLE9BQU8sRUFBRSxVQUFwRCxFQUFnRUMsTUFBTSxFQUFFLGdCQUF4RSxFQUEwRkMsT0FBTyxFQUFFLFNBQW5HLEVBQVosQ0FDQUMsT0FBTyxDQUFDQyxHQUFSLENBQWEseUJBQWIsRUFBd0MsMEJBQXhDLEVBQ0FELE9BQU8sQ0FBQ0MsR0FBUixDQUFhLEtBQUlOLEtBQUssQ0FBQ0csTUFBTyxLQUFJSCxLQUFLLENBQUNJLE9BQVEsSUFBR0osS0FBSyxDQUFDRSxPQUFRLEtBQUlGLEtBQUssQ0FBQ0ksT0FBUSxFQUFuRixFQUF1RixVQUF2RixFQUFtRyxHQUFFRyxPQUFPLENBQUNDLElBQVIsQ0FBYUMsSUFBYixDQUFrQixHQUFsQixDQUF1QixFQUE1SCxFQUVBSixPQUFPLENBQUNDLEdBQVIsQ0FBYSxLQUFJTixLQUFLLENBQUNHLE1BQU8sS0FBSUgsS0FBSyxDQUFDSSxPQUFRLElBQUdKLEtBQUssQ0FBQ0UsT0FBUSxLQUFJRixLQUFLLENBQUNJLE9BQVEsRUFBbkYsRUFBdUYsTUFBdkYsRUFBK0YsZ0NBQStCRyxPQUFPLENBQUNHLEdBQVIsQ0FBWUMsMEJBQTJCLEVBQXJLLEVBQ0FOLE9BQU8sQ0FBQ0MsR0FBUixDQUFhLEtBQUlOLEtBQUssQ0FB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aUIsdUJBQXVCLEVBQTlHO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgc3R5bGUgPSB7IHRpdGxlOiAnXFx4MWJbMzNtXFx4MWJbMW1cXHgxYls3bVxceDFiWzM2bScsIG1lc3NhZ2U6ICdcXHgxYls5Nm0nLCBpdGFsaWM6ICdcXHgxYlsybVxceDFiWzNtJywgZGVmYXVsdDogJ1xceDFiWzBtJyB9XHJcbmNvbnNvbGUubG9nKGBcXHgxYlsybVxceDFiWzNtJXNcXHgxYlswbWAsIGDigKIgRW52aXJvbm1lbnQgdmFyaWFibGVzOmApXHJcbmNvbnNvbGUubG9nKGBcXHQke3N0eWxlLml0YWxpY30lcyR7c3R5bGUuZGVmYXVsdH0gJHtzdHlsZS5tZXNzYWdlfSVzJHtzdHlsZS5kZWZhdWx0fWAsIGBDb21tYW5kOmAsIGAke3Byb2Nlc3MuYXJndi5qb2luKCcgJyl9YClcclxuLyogc2hlbGwgc2NyaXB0IGVudmlyb25tbmV0IGFyZ3VtZW50cyAtIExvZyBlbnZpcm9ubWVudCB2YXJpYWJsZXMgJiBzaGVsbCBjb21tYW5kIGFyZ3VtZW50cyAqL1xyXG5jb25zb2xlLmxvZyhgXFx0JHtzdHlsZS5pdGFsaWN9JXMke3N0eWxlLmRlZmF1bHR9ICR7c3R5bGUubWVzc2FnZX0lcyR7c3R5bGUuZGVmYXVsdH1gLCBgZW52OmAsIGBlbnRyeXBvaW50Q29uZmlndXJhdGlvbktleSA9ICR7cHJvY2Vzcy5lbnYuZW50cnlwb2ludENvbmZpZ3VyYXRpb25LZXl9YClcclxuY29uc29sZS5sb2coYFxcdCR7c3R5bGUuaXRhbGljfSVzJHtzdHlsZS5kZWZhdWx0fSAke3N0eWxlLm1lc3NhZ2V9JXMke3N0eWxlLmRlZmF1bHR9YCwgYGVudjpgLCBgZW50cnlwb2ludENvbmZpZ3VyYXRpb25QYXRoID0gJHtwcm9jZXNzLmVudi5lbnRyeXBvaW50Q29uZmlndXJhdGlvblBhdGh9YClcclxuY29uc29sZS5sb2coYFxcdCR7c3R5bGUuaXRhbGljfSVzJHtzdHlsZS5kZWZhdWx0fSAke3N0eWxlLm1lc3NhZ2V9JXMke3N0eWxlLmRlZmF1bHR9YCwgYGVudjpgLCBgdGFyZ2V0QXBwQmFzZVBhdGggPSAke3Byb2Nlc3MuZW52LnRhcmdldEFwcEJhc2VQYXRofWApXHJcblxyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCdcclxuaW1wb3J0IGZpbGVzeXN0ZW0gZnJvbSAnZnMnXHJcbmltcG9ydCB2bSBmcm9tICd2bSdcclxuaW1wb3J0IG93bkNvbmZpZ3VyYXRpb24gZnJvbSAnLi4vZnVuY3Rpb25hbGl0eS5jb25maWcuanMnXHJcbmltcG9ydCB7IHBhcnNlS2V5VmFsdWVQYWlyU2VwYXJhdGVkQnlTeW1ib2xGcm9tQXJyYXksIGNvbWJpbmVLZXlWYWx1ZU9iamVjdEludG9TdHJpbmcgfSBmcm9tICdAZGVwZW5kZW5jeS9wYXJzZUtleVZhbHVlUGFpclNlcGFyYXRlZEJ5U3ltYm9sJ1xyXG5pbXBvcnQgeyBjb25maWd1cmF0aW9uRmlsZUxvb2t1cCB9IGZyb20gJ0BkZXBsb3ltZW50L2NvbmZpZ3VyYXRpb25NYW5hZ2VtZW50J1xyXG5pbXBvcnQgeyBzY3JpcHRNYW5hZ2VyIH0gZnJvbSAnLi4vc2NyaXB0LmpzJ1xyXG5pbXBvcnQgeyBsb2FkU3RkaW4gfSBmcm9tICcuLi91dGlsaXR5L2xvYWRTdGRpbi5qcydcclxuaW1wb3J0IHsgaXNKU0NvZGVUb0V2YWx1YXRlIH0gZnJvbSAnLi4vdXRpbGl0eS9pc0pTQ29kZVRvRXZhbHVhdGUuanMnXHJcbmltcG9ydCB7IHNwbGl0QXJyYXlUb1R3b0J5RGVsaW1pdGVyLCBkaXZpZGVBcnJheUJ5RmlsdGVyIH0gZnJvbSAnLi4vdXRpbGl0eS9zcGxpdEFycmF5LmpzJ1xyXG5cclxuY2xpSW50ZXJmYWNlKCkuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpXHJcblxyXG4vKipcclxuICogQ291bGQgcnVuIGluIHR3byBtb2RlczpcclxuICogIDEuIEV2YWx1YXRlIGNvZGUgaW50ZXJmYWNlOiBBbGxvd3MgZm9yIGNhbGxpbmcgdGhpcyBtb2R1bGUgYHNjcmlwdE1hbmFnZXJgIHVzaW5nIGphdmFzcmlwdCBjb2RlIGZyb20gdGhlIGNvbW1hbmRsaW5lLlxyXG4gKiAgICAgSW4gdGhpcyBjYXNlIHRoZXJlIGFyZSBubyBwYXJzZWQgY29tbWFuZCBhcmd1bWVudHMsIG9ubHkgdGhlIGZpcnN0IGFyZ3VtZW50IHRoYXQgY29udGFpbnMgSlMgY29kZSB3aXRoIGFsbCBuZWNlc3NhcnkgcGFyYW1ldGVycy5cclxuICogICAgIFVTQUdFOlxyXG4gKiAgICAgICBgeWFybiBydW4gc2NyaXB0TWFuYWdlciBcIih7IHNjcmlwdEtleVRvSW52b2tlOiAnc2xlZXAnIH0pXCJgXHJcbiAqICAgICAgIGB5YXJuIHJ1biBzY3JpcHRNYW5hZ2VyIFwiKHsgc2NyaXB0S2V5VG9JbnZva2U6ICdzbGVlcCcsIGpzQ29kZVRvRXZhbHVhdGU6ICcuc2V0SW50ZXJ2YWwoKScgfSlcImBcclxuICogICAgICAgYHlhcm4gcnVuIHNjcmlwdE1hbmFnZXIgXCIuYXBwbHkoKVwiYCAtIHRha2Ugbm90ZSB0aGF0IGFsc28gJy4nIGlzIGNvbnNpZGVyZWQgZXZhbHVhdGUgY29kZS5cclxuICogIDIuIHBhcnNlZCBhcmd1bWVudHMgaW50ZXJmYWNlOiBUaGlzIGltcGxlbWVudGF0aW9uLCBpbiBjb250cmFzdCB0byB0aGUgb3RoZXIgY29kZSBldmFsdWF0aW9uIGludGVyZmFjZSwgcmVxdWlyZXMgbWFwcGluZyB0aGUgbmVlZGVkIGNvbW1hbmRsaW5lIHBhcnNlZCBhcmd1bWVudHMgdG8gdGhlIG1ldGhvZCBwYXJhbWV0ZXJzLlxyXG4gKiAgICAgIE5vdGU6IHRoaXMgY29udGFpbnMgZXZhbHVhdGlvbiBjb2RlIHRoYXQgaXMgdXNlZCBieSBzdWJzZXF1ZW50IG1vZHVsZXMgbGlrZSBcInNjcmlwdEV4ZWN1dGlvblwiXHJcbiAqICAgICBVU0FHRTpcclxuICogICAgICBzY3JpcHQgaW52b2thdGlvbiBmcm9tIHNoZWxsIHVzaW5nOiBucHggfHwgeWFybiBydW4gfHwgPHBhdGhUb1NjcmlwdCBlLmcuICcuL25vZGVfbW9kdWxlcy8uYmluL3NjcmlwdE1hbmFnZXInPiAgIChgeWFybiBydW5gIGlzIHByZWZlcmVkIG92ZXIgYG5weGAgYmVjYXVzZSBpdCBjb3JyZWN0bHkgY2F0Y2hlcyBlcnJvcnMsIGkuZS4gaXRzIGltcGxlbWVudGF0aW9uIGlzIG1vcmUgY29tcGxldGUuKVxyXG4gKiAgICAgICQgYHlhcm4gcnVuIHNjcmlwdE1hbmFnZXIgdGFyZ2V0UHJvamVjdENvbmZpZ1BhdGg9PD4gc2NyaXB0S2V5VG9JbnZva2U9PGZpbGVuYW1lPiBqc0NvZGVUb0V2YWx1YXRlPTxqcyBjb2RlPiAtIDxhcmd1bWVudHMgcGFzc2VkIHRvIHRhcmdldCBzY3JpcHQ+YFxyXG4gKiAgICAgICQgYHlhcm4gcnVuIHNjcmlwdE1hbmFnZXIgdGVzdCAtIHRlc3RUeXBlPXVuaXRUZXN0IGRlYnVnYFxyXG4gKiAgICAgIHdoZXJlIGAtYCBtZWFucyB0aGUgZW5kIG9mIG93biBtb2R1bGUgYXJncyBhbmQgYmVnaW5uaW5nIG9mIHRhcmdldCBzY3JpcHQgYXJncyAoYSBzbGlnaHRsdCBkaWZmZXJlbnQgbWVhbmluZyB0aGFuIHRoZSBjb252ZW50aW9uIGluIG90aGVyIHNoZWxsIHNjcmlwdHMgaHR0cHM6Ly9zZXJ2ZXJmYXVsdC5jb20vcXVlc3Rpb25zLzExNDg5Ny93aGF0LWRvZXMtZG91YmxlLWRhc2gtbWVhbi1pbi10aGlzLXNoZWxsLWNvbW1hbmQpLlxyXG4gKiAgICAgIHNob3J0aGFuZCAkIGB5YXJuIHJ1biBzY3JpcHRNYW5hZ2VyIDxzY3JpcHRUb0ludm9rZT4gPGpzQ29kZVRvRXZhbHVhdGU+IC0gPGFyZ3VtZW50cyB0byB0YXJnZXQgc2NyaXB0PmAgZS5nLiBgeWFybiBydW4gc2NyaXB0TWFuYWdlciBzbGVlcCAnLnNldEludGVydmFsKCknYFxyXG4gKiAgICAgICBgeWFybiBzY3JpcHRNYW5hZ2VyIHRlc3QgXCIucnVuVGVzdCh7IHRlc3RQYXRoOiAnJHtQV0R9L3Rlc3QnLCB0YXJnZXRQcm9qZWN0OiBhcGkucHJvamVjdCB9KVwiYCAvLyB3aGVyZSBgYXBpYCBpcyBleHBvc2VkIGJ5IHRoZSBzY3JpcHRNYW5hZ2VyIHRvIHRoZSBldmFsdWF0ZWQgc2NyaXB0LlxyXG4gKiAgICAgICBzY3JpcHRDb25maWcgYWRhcHRlckZ1bmN0aW9uICsgYHlhcm4gc2NyaXB0TWFuYWdlciB0ZXN0IFwiLnJ1blRlc3QoeyB0ZXN0UGF0aDogJyR7UFdEfS90ZXN0JyB9KVwiYCAvLyB3aGVyZSBhbiBhZGFwdGVyIGlzIHByb3ZpZGVkIGluIHNjcmlwdENvbmZpZyB0byBzZXQgdGhlICd0YXJnZXRQcm9qZWN0JyBmcm9tIHRoZSBhcGkgb2Ygc2NyaXB0TWFuYWdlci5cclxuICpcclxuICpcclxuICogW25vdGVdIGRpc3Rpbmd1aXNoIGJldHdlZW4gdGhlIG93bkNvbmZpZ3VyYXRpb24gYW5kIHRoZSB0YXJnZXQgYXBwbGljYXRpb24gY29uZmlndXJhdGlvbi5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGNsaUludGVyZmFjZSh7XHJcbiAgY29tbWFuZEFyZ3VtZW50ID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpIC8qIHJlbW92ZSBmaXJzdCB0d28gYXJndW1lbnRzIGBydW50aW1lYCwgYG1vZHVsZSBwYXRoYCAqLyxcclxuICBhcmd1bWVudERlbGltaXRlciA9ICctJywgLy8gZGVsaW1pdGVyIHN5bWJvbCBmb3IgZGlmZmVyZW50aWF0aW5nIG93biBhcmd1bWVudHMgZnJvbSB0aGUgdGFyZ2V0IHNjcmlwdCBhcmd1bWVudHMuIHVzaW5nIGAtYCBpbnN0ZWFkIG9mIGAtLWAgYmVjYXVzZSB5YXJuIHJlbW92ZXMgdGhlIGRvdWJsZSBzbGFzaCAoYWx0aG91Z2ggaW4gZnV0dXJlIHZlcnNpb24gaXQgd29uJ3QsIGFzIHdhcyBtZW50aW9uZWQpLlxyXG4gIGN1cnJlbnREaXJlY3RvcnkgPSBwcm9jZXNzLmVudi5QV0QgfHwgcHJvY2Vzcy5jd2QoKSAvKkluIGNhc2UgcnVuIGluIFdpbmRvd3Mgd2hlcmUgUFdEIGlzIG5vdCBzZXQuKi8sXHJcbiAgZW52cmlyb25tZW50QXJndW1lbnQgPSBwcm9jZXNzLmVudixcclxuICBzY3JpcHRLZXlUb0ludm9rZSwgLy8gdGhlIGtleSBuYW1lIGZvciB0aGUgc2NyaXB0IHRoYXQgc2hvdWxkIGJlIGV4ZWN1dGVkIChjb21wYXJlZCB3aXRoIHRoZSBrZXkgaW4gdGhlIGNvbmZpZ3VyYXRpb24gZmlsZS4pXHJcbiAgdGFyZ2V0UHJvamVjdENvbmZpZ1BhdGgsIC8vIHRoZSBwYXRoIHRvIHRoZSBjb25maWd1cmF0aW9uIGZpbGUgb2YgdGhlIHRhcmdldCBhcHBsaWNhdGlvbi4gcmVsYXRpdmUgcGF0aCB0byB0YXJnZXQgcHJvamVjdCBjb25maWd1cmF0aW9uIGZyb20gY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS5cclxuICBqc0NvZGVUb0V2YWx1YXRlLFxyXG4gIHNob3VsZENvbXBpbGVTY3JpcHQsXHJcbn0gPSBbXSkge1xyXG4gIC8qKiBBcmd1bWVudCBpbml0aWFsaXphdGlvbiwgdmFsaWRhdGlvbiwgc2FuaXRpemF0aW9uXHJcbiAgICogZ2V0IGFyZ3VtZW50cyAtIEFQSSBvZiBhY2NlcHRlZCB2YXJpYmFsZXMgZnJvbSAocHJpb3JpdHkgbGlzdClcclxuICAgKiAxLiBpbW1lZGlhdGVseSBwYXNzZWQgYXJndW1lbnQgaW4gY29kZS5cclxuICAgKiAyLiBFbnZpcm9ubWVudCB2YXJpYWJsZXNcclxuICAgKiAzLiBDb21tYW5kbGluZSBhcmd1bWVudHNcclxuICAgKi9cclxuICBsZXQgc3RhbmRhcnRJbnB1dERhdGEgPSBhd2FpdCBsb2FkU3RkaW4oKSAvLyBpbiBjYXNlIGluIHNoZWxsIHBpcGVsaW5lIC0gZ2V0IGlucHV0XHJcbiAgLy8gc3BsaXQgY29tbWFuZGxpbmUgYXJndW1lbnRzIGJ5IGRlbGltaXRlclxyXG4gIGxldCBbb3duQ29tbWFuZEFyZ3VtZW50LCB0YXJnZXRTY3JpcHRDb21tYW5kQXJndW1lbnRdID0gc3BsaXRBcnJheVRvVHdvQnlEZWxpbWl0ZXIoeyBhcnJheTogY29tbWFuZEFyZ3VtZW50LCBkZWxpbWl0ZXI6IGFyZ3VtZW50RGVsaW1pdGVyIH0pXHJcbiAgbGV0IFtwYWlyQXJndW1lbnQsIG5vblBhaXJBcmd1bWVudF0gPSBkaXZpZGVBcnJheUJ5RmlsdGVyKHsgYXJyYXk6IG93bkNvbW1hbmRBcmd1bWVudCwgZmlsdGVyRnVuYzogaXRlbSA9PiBpdGVtLmluY2x1ZGVzKCc9JykgfSkgLy8gc2VwYXJhdGUgYXJndW1lbnRzIHRoYXQgYXJlIGtleS12YWx1ZSBwYWlyIGZyb20gdGhlIHJlc3RcclxuICBsZXQgcGFyc2VkQ29tbWFuZEFyZ3VtZW50ID0gcGFyc2VLZXlWYWx1ZVBhaXJTZXBhcmF0ZWRCeVN5bWJvbEZyb21BcnJheSh7IGFycmF5OiBwYWlyQXJndW1lbnQsIHNlcGFyYXRpbmdTeW1ib2w6ICc9JyB9KSAvLyBwYXJzZSBga2V5PXZhbHVlYCBub2RlIGNvbW1hbmQgbGluZSBhcmd1bWVudHNcclxuICAvLyBjcmVhdGUgY29tbWFuZCBhcmd1bWVudHMgZm9yIHRhcmdldCBzY3JpcHQuXHJcbiAgcHJvY2Vzcy5hcmd2ID0gW3Byb2Nlc3MuYXJndlswXSwgcHJvY2Vzcy5hcmd2WzFdIC8qIHNob3VsZCBiZSBzdWJzdGl0dXRlZCBieSBmdWxsIHRhcmdldCBzY3JpcHQgcGF0aCBhZnRlciBsb29rdXAgKi8sIC4uLnRhcmdldFNjcmlwdENvbW1hbmRBcmd1bWVudF1cclxuXHJcbiAgLy8gdGFyZ2V0IGFwcGxpY2F0aW9uIGNvbmZpZ3VyYXRpb24gZmlsZTpcclxuICBsZXQgY29uZmlndXJhdGlvbkZpbGVMb29rdXBDYWxsYmFjayA9IGNvbmZpZ1BhdGggPT4ge1xyXG4gICAgY29uZmlnUGF0aCA9IGNvbmZpZ3VyYXRpb25GaWxlTG9va3VwKHtcclxuICAgICAgY29uZmlndXJhdGlvblBhdGg6IGNvbmZpZ1BhdGgsXHJcbiAgICAgIGN1cnJlbnREaXJlY3RvcnksXHJcbiAgICAgIGNvbmZpZ3VyYXRpb25CYXNlUGF0aDogb3duQ29uZmlndXJhdGlvbi50YXJnZXRBcHAuY29uZmlndXJhdGlvbkJhc2VQYXRoLFxyXG4gICAgfSkucGF0aFxyXG4gICAgLy8gYXNzcmV0IGVudHJ5cG9pbnQgY29uZmlndXJhdGlvbiBvYmplY3RzL29wdGlvbnMgZXhpc3QuXHJcbiAgICBjb25zb2xlLmFzc2VydChyZXF1aXJlLnJlc29sdmUoY29uZmlnUGF0aCksICdcXHgxYls0MW0lc1xceDFiWzBtJywgYOKdjCBDb25maWd1cmF0aW9uIGZpbGUgZG9lc24ndCBleGlzdCBpbiAke2NvbmZpZ1BhdGh9YClcclxuICAgIHJldHVybiBjb25maWdQYXRoXHJcbiAgfVxyXG5cclxuICAvLyBbMV0gYWNjZXB0cyBhIHNpbmdsZSBhcmd1bWVudCBzdHJpbmcgdG8gYmUgZXZhbHVhdGVkIGFzIEpTIGNvZGUsIGluIGFkZGl0aW9uIHRvIGVudmlyb25tZW50IHZhcmlhYmxlcyBmb3IgZXhlY3V0aW9uIG9mIHRoZSBwcm9ncmFtbWF0aWMgYXBpLlxyXG4gIGFzeW5jIGZ1bmN0aW9uIGV2YWx1YXRlSW50ZXJmYWNlKCkge1xyXG4gICAgc2NyaXB0S2V5VG9JbnZva2UgfHw9IGVudnJpcm9ubWVudEFyZ3VtZW50LnNjcmlwdEtleVRvSW52b2tlXHJcbiAgICB0YXJnZXRQcm9qZWN0Q29uZmlnUGF0aCB8fD0gc3RhbmRhcnRJbnB1dERhdGEgfHwgZW52cmlyb25tZW50QXJndW1lbnQudGFyZ2V0Q29uZmlnXHJcbiAgICBzaG91bGRDb21waWxlU2NyaXB0IHx8PSBlbnZyaXJvbm1lbnRBcmd1bWVudC5zaG91bGRDb21waWxlU2NyaXB0XHJcbiAgICB0YXJnZXRQcm9qZWN0Q29uZmlnUGF0aCA9IGNvbmZpZ3VyYXRpb25GaWxlTG9va3VwQ2FsbGJhY2sodGFyZ2V0UHJvamVjdENvbmZpZ1BhdGgpXHJcbiAgICAvLyBzdHJpbmcganMgY29kZSB0aGF0IHdpbGwgYmUgdXNlZCBvbiB0aGUgY2FsbGJhY2suXHJcbiAgICBsZXQgY29kZVRvRXZhbHVhdGVGb3JPd25Nb2R1bGUgPSBvd25Db21tYW5kQXJndW1lbnRbMF0sXHJcbiAgICAgIGRlZmF1bHRFdmFsdWF0ZUNhbGxWYWx1ZUZvckZpcnN0UGFyYW1ldGVyID0geyB0YXJnZXRQcm9qZWN0Q29uZmlnUGF0aCwgc2NyaXB0S2V5VG9JbnZva2UsIGpzQ29kZVRvRXZhbHVhdGUsIHNob3VsZENvbXBpbGVTY3JpcHQgfVxyXG4gICAgLy8gZXhlY3V0ZSBhcGkgdXNpbmcgc3RyaW5nIGV2YWx1YXRlZCBjb2RlLlxyXG4gICAgbGV0IGNvbnRleHRFbnZpcm9ubWVudCA9IHZtLmNyZWF0ZUNvbnRleHQoXHJcbiAgICAgIE9iamVjdC5hc3NpZ24oZ2xvYmFsLCB7XHJcbiAgICAgICAgLy8gd3JhcHBlciBmdW5jdGlvbiBhcm91bmcgJ3NjcmlwdE1hbmFnZXInIGluIG9yZGVyIHRvIGFwcGx5IGRlZmF1bHQgdmFsdWVzXHJcbiAgICAgICAgLy8gVE9ETzogVXNlciBzeW1ib2xzIGlmIHBvc3NpYmxlIGluc3RlYWQgb2YgYSBzdHJpbmcgZm9yIHRoZSB3cmFwcGluZyBmdW5jdGlvbi5cclxuICAgICAgICBfcmVxdWlyZWRNb2R1bGVTY3JpcHRNYW5hZ2VyV3JhcHBlcl86IGFzeW5jICguLi5hcmdzKSA9PiB7XHJcbiAgICAgICAgICAvLyBzaW1pbGFyIHRvIGEgY3VycnkgZnVuY3Rpb24gd3JhcHBlciwgc2V0dGluZyBkZWZhdWx0IHZhbHVlc1xyXG4gICAgICAgICAgLy8gcHJvY2VzcyBhcmdzIHNldHRpbmcgZGVmYXVsdCB2YWx1ZXNcclxuICAgICAgICAgIGFyZ3NbMF0gPSBPYmplY3QuYXNzaWduKGRlZmF1bHRFdmFsdWF0ZUNhbGxWYWx1ZUZvckZpcnN0UGFyYW1ldGVyLCBhcmdzWzBdKSAvLyB0aGVzZSBhcmUgaXMgc3BlY2lmaWMgbnVtYmVyIG9mIHBhcmFtZXRlcnMgdGhhdCBgc2NyaXB0TWFuYWdlcmAgZnVuY3Rpb24gaGFzXHJcbiAgICAgICAgICBhd2FpdCBzY3JpcHRNYW5hZ2VyKC4uLmFyZ3MpLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSlcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgIClcclxuICAgIHRyeSB7XHJcbiAgICAgIC8vIHdoZXJlIGBfYCBhdmFpbGFibGUgaW4gY29udGV4dCBvZiB2bSwgY2FsbHMgYHNjcmlwdE1hbmFnZXJgIG1vZHVsZS5cclxuICAgICAgbGV0IHZtU2NyaXB0ID0gbmV3IHZtLlNjcmlwdChgX3JlcXVpcmVkTW9kdWxlU2NyaXB0TWFuYWdlcldyYXBwZXJfJHtjb2RlVG9FdmFsdWF0ZUZvck93bk1vZHVsZX1gLCB7XHJcbiAgICAgICAgZmlsZW5hbWU6IHBhdGgucmVzb2x2ZSgnLi4vJykgLyogYWRkIGZpbGUgdG8gTm9kZSdzIGV2ZW50IGxvb3Agc3RhY2sgdHJhY2UgKi8sXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICB2bVNjcmlwdC5ydW5JbkNvbnRleHQoY29udGV4dEVudmlyb25tZW50LCB7IGJyZWFrT25TaWdpbnQ6IHRydWUgLyogYnJlYWsgd2hlbiBDdHJsK0MgaXMgcmVjZWl2ZWQuICovIH0pXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmxvZyhg4p2MIFJ1bm5pbmcgJ3ZtIHJ1bkluQ29udGV4dCcgY29kZSBmYWlsZWQgZHVyaW5nIGV4ZWN1dGlvbi5gKVxyXG4gICAgICB0aHJvdyBlcnJvclxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gWzJdIGFjY2VwdHMgY29tbWFuZCBhcmd1bWVudHMgb3IgZW52aXJvbm1lbnQgdmFyaWFibGVzIGFzIHBhcmFtZXRlcnMgZm9yIHRoZSBleGVjdXRpb24gb2YgdGhlIHByb2dyYW1tYXRpYyBhcGkuXHJcbiAgYXN5bmMgZnVuY3Rpb24gcGFzc2VkQXJndW1lbnRJbnRlcmZhY2UoKSB7XHJcbiAgICBzY3JpcHRLZXlUb0ludm9rZSB8fD0gcGFyc2VkQ29tbWFuZEFyZ3VtZW50LnNjcmlwdEtleVRvSW52b2tlIHx8IGVudnJpcm9ubWVudEFyZ3VtZW50LnNjcmlwdEtleVRvSW52b2tlIHx8IG5vblBhaXJBcmd1bWVudFswXSAvLyBhbGxvdyBmb3Igc2hvcnRoYW5kIGNvbW1hbmQgY2FsbC5cclxuICAgIGpzQ29kZVRvRXZhbHVhdGUgfHw9IHBhcnNlZENvbW1hbmRBcmd1bWVudC5qc0NvZGVUb0V2YWx1YXRlIHx8IGVudnJpcm9ubWVudEFyZ3VtZW50LnNjcmlwdEtleVRvSW52b2tlIHx8IG5vblBhaXJBcmd1bWVudFsxXVxyXG4gICAgc2hvdWxkQ29tcGlsZVNjcmlwdCB8fD0gcGFyc2VkQ29tbWFuZEFyZ3VtZW50LnNob3VsZENvbXBpbGVTY3JpcHQgfHwgZW52cmlyb25tZW50QXJndW1lbnQuc2hvdWxkQ29tcGlsZVNjcmlwdCB8fCBub25QYWlyQXJndW1lbnRbMl1cclxuICAgIHByb2Nlc3MuYXJndlsxXSA9IHNjcmlwdEtleVRvSW52b2tlIHx8IHByb2Nlc3MuYXJndlsxXSAvL1RoZSBwYXRoIHRvIHRoZSBzY3JpcHQgc2hvdWxkIGJlIGNoYW5nZWQgYWZ0ZXIgc2NyaXB0IGxvb2t1cCBieSBzdWNjZWVkaW5nIG1vZHVsZXMuXHJcbiAgICAvLyB0YXJnZXQgYXBwbGljYXRpb24ncyBjb25maWd1cmF0aW9uIGZpbGUgcGFyYW1ldGVyIGhpZXJhcmNoeVxyXG4gICAgdGFyZ2V0UHJvamVjdENvbmZpZ1BhdGggfHw9IHBhcnNlZENvbW1hbmRBcmd1bWVudC50YXJnZXRDb25maWcgfHwgc3RhbmRhcnRJbnB1dERhdGEgLyogc3RkaW4gaW5wdXQgKi8gfHwgZW52cmlyb25tZW50QXJndW1lbnQudGFyZ2V0Q29uZmlnXHJcbiAgICB0YXJnZXRQcm9qZWN0Q29uZmlnUGF0aCA9IGNvbmZpZ3VyYXRpb25GaWxlTG9va3VwQ2FsbGJhY2sodGFyZ2V0UHJvamVjdENvbmZpZ1BhdGgpXHJcbiAgICBhd2FpdCBzY3JpcHRNYW5hZ2VyKHsgdGFyZ2V0UHJvamVjdENvbmZpZ1BhdGgsIHNjcmlwdEtleVRvSW52b2tlLCBqc0NvZGVUb0V2YWx1YXRlLCBzaG91bGRDb21waWxlU2NyaXB0IH0pLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKVxyXG4gIH1cclxuXHJcbiAgLy8gY2hlY2sgaWYgdGhlIGZpcnN0IGFyZ3VtZW50IGZvciBpcyBhIEphdmFzY3JpcHQgY29kZSB0aGF0IHNob3VsZCBiZSBldmFsdWF0ZWQgb24gYW4gaW1wb3J0ZWQgbW9kdWxlLlxyXG4gIGlzSlNDb2RlVG9FdmFsdWF0ZSh7IHN0cmluZzogbm9uUGFpckFyZ3VtZW50WzBdIH0pID8gYXdhaXQgZXZhbHVhdGVJbnRlcmZhY2UoKSA6IGF3YWl0IHBhc3NlZEFyZ3VtZW50SW50ZXJmYWNlKClcclxufVxyXG4iXX0=