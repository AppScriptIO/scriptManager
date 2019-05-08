"use strict";


module.exports = function () {






  const preserveSymlinkOption = 'NODE_PRESERVE_SYMLINKS';
  if (!process.env[preserveSymlinkOption]) throw new Error('Node\'s preserve symlink option must be turned on (NODE_PRESERVE_SYMLINKS)');

  return require('./script.js');
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9ydW5JbkNvbnRhaW5lci9wcmVzZXJ2ZVN5bWxpbmsuZW50cnlwb2ludC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwicHJlc2VydmVTeW1saW5rT3B0aW9uIiwicHJvY2VzcyIsImVudiIsIkVycm9yIiwicmVxdWlyZSJdLCJtYXBwaW5ncyI6Ijs7O0FBR0FBLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQixZQUFXOzs7Ozs7O0FBT3hCLFFBQU1DLHFCQUFxQixHQUFHLHdCQUE5QjtBQUNBLE1BQUcsQ0FBQ0MsT0FBTyxDQUFDQyxHQUFSLENBQVlGLHFCQUFaLENBQUosRUFBd0MsTUFBTSxJQUFJRyxLQUFKLENBQVUsNEVBQVYsQ0FBTjs7QUFFeEMsU0FBT0MsT0FBTyxDQUFDLGFBQUQsQ0FBZDtBQUNILENBWEQiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIENoZWNrIHRoYXQgcHJlc2VydmUgc3ltbGluayBpcyBlbmFibGVkLiBcbiAgICAgKiBOb2RlIHByb2Nlc3MgbXVzdCBiZSBydW4gd2l0aCBgcHJlc2V2ZSBzeW1saW5rYCBvcHRpb24gKGZsYWcgb3IgZW52IHZhcmlhYmxlKSwgYnkgTm9kZSdzIGRlZmF1bHQgaXQgaXMgb2ZmLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2NsaS5odG1sI2NsaV9ub2RlX3ByZXNlcnZlX3N5bWxpbmtzXzFcbiAgICAgKiBBcyB0aGlzIG1vZHVsZSByZWxpZXMgb24gbm9kZV9tb2R1bGVzIGJlaW5nIHJlc29sdmVkIGZyb20gdGhlIHN5bWxpbmsgbG9jYXRpb24gaW4gY2FzZSB0aGUgbW9kdWxlIGlzIHN5bWxpbmtzIGZyb20gb3V0c2lkZSBvZiB0aGUgYXBwbGljYXRpb24gcm9vdCBwYXRoIChmb3IgZGV2ZWxvcG1lbnQgcHVycG9zZXMpLlxuICAgICAqIFRoaXMgaW1wbGVtZW50YXRpb24gY2hlY2tzIG9ubHkgZm9yIGVudmlyb25tZW50IHZhcmlhYmxlIChub3QgZmxhZykuXG4gICAgICovXG4gICAgY29uc3QgcHJlc2VydmVTeW1saW5rT3B0aW9uID0gJ05PREVfUFJFU0VSVkVfU1lNTElOS1MnXG4gICAgaWYoIXByb2Nlc3MuZW52W3ByZXNlcnZlU3ltbGlua09wdGlvbl0pIHRocm93IG5ldyBFcnJvcignTm9kZVxcJ3MgcHJlc2VydmUgc3ltbGluayBvcHRpb24gbXVzdCBiZSB0dXJuZWQgb24gKE5PREVfUFJFU0VSVkVfU1lNTElOS1MpJylcblxuICAgIHJldHVybiByZXF1aXJlKCcuL3NjcmlwdC5qcycpXG59Il19