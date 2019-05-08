"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.convertObjectToDockerEnvFlag = convertObjectToDockerEnvFlag;
function convertObjectToDockerEnvFlag(
envObject)
{
  let dockerEnvStringArray = [];
  Object.entries(envObject).forEach(
  ([key, value]) => {
    dockerEnvStringArray.push(`--env "${escapeWithBackslash(key)}=${escapeWithBackslash(value)}"`);
  });


  return dockerEnvStringArray;
}

function escapeWithBackslash(string) {
  let jsonString = JSON.stringify(String(string));
  let escapedString = jsonString.substring(1, jsonString.length - 1);
  return escapedString;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NvdXJjZS9ydW5JbkNvbnRhaW5lci91dGlsaXR5L2NvbnZlcnRPYmplY3RUb0RvY2tlckVudkZsYWcuanMiXSwibmFtZXMiOlsiY29udmVydE9iamVjdFRvRG9ja2VyRW52RmxhZyIsImVudk9iamVjdCIsImRvY2tlckVudlN0cmluZ0FycmF5IiwiT2JqZWN0IiwiZW50cmllcyIsImZvckVhY2giLCJrZXkiLCJ2YWx1ZSIsInB1c2giLCJlc2NhcGVXaXRoQmFja3NsYXNoIiwic3RyaW5nIiwianNvblN0cmluZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJTdHJpbmciLCJlc2NhcGVkU3RyaW5nIiwic3Vic3RyaW5nIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiO0FBQ08sU0FBU0EsNEJBQVQ7QUFDSEMsU0FERztBQUVMO0FBQ0UsTUFBSUMsb0JBQW9CLEdBQUcsRUFBM0I7QUFDQUMsRUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWVILFNBQWYsRUFBMEJJLE9BQTFCO0FBQ0ksR0FBQyxDQUFDQyxHQUFELEVBQU1DLEtBQU4sQ0FBRCxLQUFrQjtBQUNkTCxJQUFBQSxvQkFBb0IsQ0FBQ00sSUFBckIsQ0FBMkIsVUFBU0MsbUJBQW1CLENBQUNILEdBQUQsQ0FBTSxJQUFHRyxtQkFBbUIsQ0FBQ0YsS0FBRCxDQUFRLEdBQTNGO0FBQ0gsR0FITDs7O0FBTUEsU0FBT0wsb0JBQVA7QUFDSDs7QUFFRCxTQUFTTyxtQkFBVCxDQUE2QkMsTUFBN0IsRUFBcUM7QUFDakMsTUFBSUMsVUFBVSxHQUFHQyxJQUFJLENBQUNDLFNBQUwsQ0FBZUMsTUFBTSxDQUFDSixNQUFELENBQXJCLENBQWpCO0FBQ0EsTUFBSUssYUFBYSxHQUFHSixVQUFVLENBQUNLLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0JMLFVBQVUsQ0FBQ00sTUFBWCxHQUFrQixDQUExQyxDQUFwQjtBQUNBLFNBQU9GLGFBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbnZlcnQgYW4gb2JqZWN0IG9mIEtleS1TdHJpbmcgcGFpciB0byBhbm4gYXJyYXkgb2Ygc3RyaW5ncyBgLS1lbnYgPGtleT49PHZhbHVlPmAgZm9yIHBhc3NpbmcgcHJvY2Vzcy5lbnYgdG8gZG9ja2VyIHJ1biBjb21tYW5kIGluIGNoaWxkIHByb2Nlc3MuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydE9iamVjdFRvRG9ja2VyRW52RmxhZyhcbiAgICBlbnZPYmplY3QgLy8gT2JqZWN0IG9mIGtleSAtIHN0cmluZyBwYWlyc1xuKSB7XG4gICAgbGV0IGRvY2tlckVudlN0cmluZ0FycmF5ID0gW11cbiAgICBPYmplY3QuZW50cmllcyhlbnZPYmplY3QpLmZvckVhY2goXG4gICAgICAgIChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICAgIGRvY2tlckVudlN0cmluZ0FycmF5LnB1c2goYC0tZW52IFwiJHtlc2NhcGVXaXRoQmFja3NsYXNoKGtleSl9PSR7ZXNjYXBlV2l0aEJhY2tzbGFzaCh2YWx1ZSl9XCJgKSAvLyBlc2NhcGUgc3BlY2lhbCBjaGFyYWN0ZXJzXG4gICAgICAgIH1cbiAgICApO1xuICAgIFxuICAgIHJldHVybiBkb2NrZXJFbnZTdHJpbmdBcnJheSBcbn1cblxuZnVuY3Rpb24gZXNjYXBlV2l0aEJhY2tzbGFzaChzdHJpbmcpIHsgIC8vIGVzY2FwZSB1c2luZyBKU09OLnN0cmluZ2lmeVxuICAgIGxldCBqc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoU3RyaW5nKHN0cmluZykpXG4gICAgbGV0IGVzY2FwZWRTdHJpbmcgPSBqc29uU3RyaW5nLnN1YnN0cmluZygxLCBqc29uU3RyaW5nLmxlbmd0aC0xKVxuICAgIHJldHVybiBlc2NhcGVkU3RyaW5nXG59Il19