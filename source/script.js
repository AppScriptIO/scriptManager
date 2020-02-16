"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.scriptManager = scriptManager;

var _scriptExecution = require("@deployment/scriptExecution");
var _ProjectClass = require("./Project.class.js");
var _javascriptTranspilation = require("@deployment/javascriptTranspilation");

async function scriptManager({
  targetProjectConfigPath,
  scriptKeyToInvoke,
  jsCodeToEvaluate,
  shouldCompileScript = false })
{
  console.assert(scriptKeyToInvoke, '\x1b[41m%s\x1b[0m', '❌ `scriptKeyToInvoke` parameter must be set.');

  let project = new _ProjectClass.Project({ configurationPath: targetProjectConfigPath });


  let scriptConfigArray = project.configuration['script'];
  console.assert(scriptConfigArray, '\x1b[41m%s\x1b[0m', `❌ config['script'] option in targetProject configuration must exist.`);

  let scriptConfiguration = await (0, _scriptExecution.lookup)({
    script: scriptConfigArray,
    projectRootPath: project.configuration.rootPath,
    scriptKeyToInvoke }).
  catch(error => {
    throw error;
  });

  if (shouldCompileScript) {
    let compiler = new _javascriptTranspilation.Compiler({
      babelConfig: project.configuration.getTranspilation() });

    compiler.requireHook({ restrictToTargetProject: false });




  }

  await (0, _scriptExecution.execute)({

    scriptConfig: scriptConfiguration,
    jsCodeToEvaluate,
    parameter: {
      api: {
        project: project } } }).


  catch(error => {
    console.error(error);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9zY3JpcHQuanMiXSwibmFtZXMiOlsic2NyaXB0TWFuYWdlciIsInRhcmdldFByb2plY3RDb25maWdQYXRoIiwic2NyaXB0S2V5VG9JbnZva2UiLCJqc0NvZGVUb0V2YWx1YXRlIiwic2hvdWxkQ29tcGlsZVNjcmlwdCIsImNvbnNvbGUiLCJhc3NlcnQiLCJwcm9qZWN0IiwiUHJvamVjdCIsImNvbmZpZ3VyYXRpb25QYXRoIiwic2NyaXB0Q29uZmlnQXJyYXkiLCJjb25maWd1cmF0aW9uIiwic2NyaXB0Q29uZmlndXJhdGlvbiIsInNjcmlwdCIsInByb2plY3RSb290UGF0aCIsInJvb3RQYXRoIiwiY2F0Y2giLCJlcnJvciIsImNvbXBpbGVyIiwiQ29tcGlsZXIiLCJiYWJlbENvbmZpZyIsImdldFRyYW5zcGlsYXRpb24iLCJyZXF1aXJlSG9vayIsInJlc3RyaWN0VG9UYXJnZXRQcm9qZWN0Iiwic2NyaXB0Q29uZmlnIiwicGFyYW1ldGVyIiwiYXBpIl0sIm1hcHBpbmdzIjoiOztBQUVBO0FBQ0E7QUFDQTs7QUFFTyxlQUFlQSxhQUFmLENBQTZCO0FBQ2xDQyxFQUFBQSx1QkFEa0M7QUFFbENDLEVBQUFBLGlCQUZrQztBQUdsQ0MsRUFBQUEsZ0JBSGtDO0FBSWxDQyxFQUFBQSxtQkFBbUIsR0FBRyxLQUpZLEVBQTdCO0FBS0o7QUFDREMsRUFBQUEsT0FBTyxDQUFDQyxNQUFSLENBQWVKLGlCQUFmLEVBQWtDLG1CQUFsQyxFQUF1RCw4Q0FBdkQ7O0FBRUEsTUFBSUssT0FBTyxHQUFHLElBQUlDLHFCQUFKLENBQVksRUFBRUMsaUJBQWlCLEVBQUVSLHVCQUFyQixFQUFaLENBQWQ7OztBQUdBLE1BQUlTLGlCQUFpQixHQUFHSCxPQUFPLENBQUNJLGFBQVIsQ0FBc0IsUUFBdEIsQ0FBeEI7QUFDQU4sRUFBQUEsT0FBTyxDQUFDQyxNQUFSLENBQWVJLGlCQUFmLEVBQWtDLG1CQUFsQyxFQUF3RCxzRUFBeEQ7O0FBRUEsTUFBSUUsbUJBQW1CLEdBQUcsTUFBTSw2QkFBTztBQUNyQ0MsSUFBQUEsTUFBTSxFQUFFSCxpQkFENkI7QUFFckNJLElBQUFBLGVBQWUsRUFBRVAsT0FBTyxDQUFDSSxhQUFSLENBQXNCSSxRQUZGO0FBR3JDYixJQUFBQSxpQkFIcUMsRUFBUDtBQUk3QmMsRUFBQUEsS0FKNkIsQ0FJdkJDLEtBQUssSUFBSTtBQUNoQixVQUFNQSxLQUFOO0FBQ0QsR0FOK0IsQ0FBaEM7O0FBUUEsTUFBSWIsbUJBQUosRUFBeUI7QUFDdkIsUUFBSWMsUUFBUSxHQUFHLElBQUlDLGlDQUFKLENBQWE7QUFDMUJDLE1BQUFBLFdBQVcsRUFBRWIsT0FBTyxDQUFDSSxhQUFSLENBQXNCVSxnQkFBdEIsRUFEYSxFQUFiLENBQWY7O0FBR0FILElBQUFBLFFBQVEsQ0FBQ0ksV0FBVCxDQUFxQixFQUFFQyx1QkFBdUIsRUFBRSxLQUEzQixFQUFyQjs7Ozs7QUFLRDs7QUFFRCxRQUFNLDhCQUFROztBQUVaQyxJQUFBQSxZQUFZLEVBQUVaLG1CQUZGO0FBR1pULElBQUFBLGdCQUhZO0FBSVpzQixJQUFBQSxTQUFTLEVBQUU7QUFDVEMsTUFBQUEsR0FBRyxFQUFFO0FBQ0huQixRQUFBQSxPQUFPLEVBQUVBLE9BRE4sRUFESSxFQUpDLEVBQVI7OztBQVNIUyxFQUFBQSxLQVRHLENBU0dDLEtBQUssSUFBSTtBQUNoQlosSUFBQUEsT0FBTyxDQUFDWSxLQUFSLENBQWNBLEtBQWQ7QUFDRCxHQVhLLENBQU47QUFZRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmaWxlc3lzdGVtIGZyb20gJ2ZzJ1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgeyBleGVjdXRlLCBsb29rdXAgfSBmcm9tICdAZGVwbG95bWVudC9zY3JpcHRFeGVjdXRpb24nXHJcbmltcG9ydCB7IFByb2plY3QgfSBmcm9tICcuL1Byb2plY3QuY2xhc3MuanMnXHJcbmltcG9ydCB7IENvbXBpbGVyIH0gZnJvbSAnQGRlcGxveW1lbnQvamF2YXNjcmlwdFRyYW5zcGlsYXRpb24nXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2NyaXB0TWFuYWdlcih7XHJcbiAgdGFyZ2V0UHJvamVjdENvbmZpZ1BhdGgsIC8vIGNvbmZpZ3VyYXRpb24gb2JqZWN0IG9mIHRoZSB0YXJnZXQgcHJvamVjdC5cclxuICBzY3JpcHRLZXlUb0ludm9rZSwgLy8gdGhlIGtleSBuYW1lIGZvciB0aGUgc2NyaXB0IHRoYXQgc2hvdWxkIGJlIGV4ZWN1dGVkIChjb21wYXJlZCB3aXRoIHRoZSBrZXkgaW4gdGhlIGNvbmZpZ3VyYXRpb24gZmlsZS4pXHJcbiAganNDb2RlVG9FdmFsdWF0ZSwgLy8ganMgdG8gZXZhbHVhdGUgb24gdGhlIHJlcXVpcmVkIHNjcmlwdCA9PiAncmVxdWlyZSg8c2NyaXB0UGF0aD4pPGV2YWx1YXRlIGpzPidcclxuICBzaG91bGRDb21waWxlU2NyaXB0ID0gZmFsc2UsIC8vIGNvbXBpbGUgdXNpbmcgdGhlIHRhcmdldCBwcm9qZWN0cydzIGNvbmZpZ3VyYXRpb24gZmlsZXMuXHJcbn0pIHtcclxuICBjb25zb2xlLmFzc2VydChzY3JpcHRLZXlUb0ludm9rZSwgJ1xceDFiWzQxbSVzXFx4MWJbMG0nLCAn4p2MIGBzY3JpcHRLZXlUb0ludm9rZWAgcGFyYW1ldGVyIG11c3QgYmUgc2V0LicpXHJcblxyXG4gIGxldCBwcm9qZWN0ID0gbmV3IFByb2plY3QoeyBjb25maWd1cmF0aW9uUGF0aDogdGFyZ2V0UHJvamVjdENvbmZpZ1BhdGggfSlcclxuXHJcbiAgLy8gbG9hZCBlbnRyeXBvaW50IGNvbmZpZ3VyYXRpb24gYW5kIGNoZWNrIGZvciAnZW50cnlwb2ludCcga2V5IChlbnRyeXBvaW50IGtleSBob2xkcyBvYmplY3Qgd2l0aCBlbnRyeXBvaW50IGluZm9ybWF0aW9uIGxpa2UgZmlsZSBwYXRoIG1hcHBpbmcpXHJcbiAgbGV0IHNjcmlwdENvbmZpZ0FycmF5ID0gcHJvamVjdC5jb25maWd1cmF0aW9uWydzY3JpcHQnXVxyXG4gIGNvbnNvbGUuYXNzZXJ0KHNjcmlwdENvbmZpZ0FycmF5LCAnXFx4MWJbNDFtJXNcXHgxYlswbScsIGDinYwgY29uZmlnWydzY3JpcHQnXSBvcHRpb24gaW4gdGFyZ2V0UHJvamVjdCBjb25maWd1cmF0aW9uIG11c3QgZXhpc3QuYClcclxuXHJcbiAgbGV0IHNjcmlwdENvbmZpZ3VyYXRpb24gPSBhd2FpdCBsb29rdXAoe1xyXG4gICAgc2NyaXB0OiBzY3JpcHRDb25maWdBcnJheSxcclxuICAgIHByb2plY3RSb290UGF0aDogcHJvamVjdC5jb25maWd1cmF0aW9uLnJvb3RQYXRoLFxyXG4gICAgc2NyaXB0S2V5VG9JbnZva2UsXHJcbiAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgdGhyb3cgZXJyb3JcclxuICB9KVxyXG5cclxuICBpZiAoc2hvdWxkQ29tcGlsZVNjcmlwdCkge1xyXG4gICAgbGV0IGNvbXBpbGVyID0gbmV3IENvbXBpbGVyKHtcclxuICAgICAgYmFiZWxDb25maWc6IHByb2plY3QuY29uZmlndXJhdGlvbi5nZXRUcmFuc3BpbGF0aW9uKCkgLyoqIFNlYXJjaCBmb3IgY29uZmlndXJhdGlvbiBmaWxlcyBmcm9tIHRhcmdldCBwcm9qZWN0ICovLFxyXG4gICAgfSlcclxuICAgIGNvbXBpbGVyLnJlcXVpcmVIb29rKHsgcmVzdHJpY3RUb1RhcmdldFByb2plY3Q6IGZhbHNlIC8qIFRyYW5zcGlsZSBmaWxlcyBvZiB0aGUgdGFyZ2V0IHByb2plY3QgKi8gfSlcclxuICAgIC8vIHByb2Nlc3Mub24oJ2V4aXQnLCAoKSA9PiB7XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKGNvbXBpbGVyLmxvYWRlZEZpbGVzLm1hcCh2YWx1ZSA9PiB2YWx1ZS5maWxlbmFtZSkpXHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKGNvbXBpbGVyLmNvbmZpZy5pZ25vcmUpXHJcbiAgICAvLyB9KVxyXG4gIH1cclxuXHJcbiAgYXdhaXQgZXhlY3V0ZSh7XHJcbiAgICAvLyBBc3N1bWluZyBzY3JpcHQgaXMgc3luY2hyb25vdXNcclxuICAgIHNjcmlwdENvbmZpZzogc2NyaXB0Q29uZmlndXJhdGlvbixcclxuICAgIGpzQ29kZVRvRXZhbHVhdGUsXHJcbiAgICBwYXJhbWV0ZXI6IHtcclxuICAgICAgYXBpOiB7XHJcbiAgICAgICAgcHJvamVjdDogcHJvamVjdCwgLy8gcGFzc2VkIHRvIHRoZSBleGVjdXRlZCB0YXJnZXQgc2NyaXB0LlxyXG4gICAgICB9LCAvLyBwYXNzIHByb2plY3QgYXBpXHJcbiAgICB9LFxyXG4gIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgfSlcclxufVxyXG4iXX0=