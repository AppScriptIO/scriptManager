"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.loadStdin = loadStdin;



function loadStdin({ asBuffer = false } = {}) {
  const accumulator = [];
  let len = 0;

  return new Promise(resolve => {
    if (process.stdin.isTTY) {
      let result = asBuffer ? Buffer.concat([]) : accumulator.join('');
      resolve(result);
      return;
    }
    debugger;
    process.stdin.on('readable', () => {
      let chunk;
      while (chunk = process.stdin.read()) {
        accumulator.push(chunk);
        len += chunk.length;
      }
    });

    process.stdin.on('end', () => {
      let result = asBuffer ? Buffer.concat(accumulator, len) : accumulator.join('');
      resolve(result);
    });
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NvdXJjZS9zY3JpcHRNYW5hZ2VyL3V0aWxpdHkvbG9hZFN0ZGluLmpzIl0sIm5hbWVzIjpbImxvYWRTdGRpbiIsImFzQnVmZmVyIiwiYWNjdW11bGF0b3IiLCJsZW4iLCJQcm9taXNlIiwicmVzb2x2ZSIsInByb2Nlc3MiLCJzdGRpbiIsImlzVFRZIiwicmVzdWx0IiwiQnVmZmVyIiwiY29uY2F0Iiwiam9pbiIsIm9uIiwiY2h1bmsiLCJyZWFkIiwicHVzaCIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7OztBQUlPLFNBQVNBLFNBQVQsQ0FBbUIsRUFBRUMsUUFBUSxHQUFHLEtBQWIsS0FBdUIsRUFBMUMsRUFBOEM7QUFDbkQsUUFBTUMsV0FBVyxHQUFHLEVBQXBCO0FBQ0EsTUFBSUMsR0FBRyxHQUFHLENBQVY7O0FBRUEsU0FBTyxJQUFJQyxPQUFKLENBQVlDLE9BQU8sSUFBSTtBQUM1QixRQUFJQyxPQUFPLENBQUNDLEtBQVIsQ0FBY0MsS0FBbEIsRUFBeUI7QUFDdkIsVUFBSUMsTUFBTSxHQUFHUixRQUFRLEdBQUdTLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsQ0FBSCxHQUF1QlQsV0FBVyxDQUFDVSxJQUFaLENBQWlCLEVBQWpCLENBQTVDO0FBQ0FQLE1BQUFBLE9BQU8sQ0FBQ0ksTUFBRCxDQUFQO0FBQ0E7QUFDRDtBQUNEO0FBQ0FILElBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjTSxFQUFkLENBQWlCLFVBQWpCLEVBQTZCLE1BQU07QUFDakMsVUFBSUMsS0FBSjtBQUNBLGFBQVFBLEtBQUssR0FBR1IsT0FBTyxDQUFDQyxLQUFSLENBQWNRLElBQWQsRUFBaEIsRUFBdUM7QUFDckNiLFFBQUFBLFdBQVcsQ0FBQ2MsSUFBWixDQUFpQkYsS0FBakI7QUFDQVgsUUFBQUEsR0FBRyxJQUFJVyxLQUFLLENBQUNHLE1BQWI7QUFDRDtBQUNGLEtBTkQ7O0FBUUFYLElBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjTSxFQUFkLENBQWlCLEtBQWpCLEVBQXdCLE1BQU07QUFDNUIsVUFBSUosTUFBTSxHQUFHUixRQUFRLEdBQUdTLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjVCxXQUFkLEVBQTJCQyxHQUEzQixDQUFILEdBQXFDRCxXQUFXLENBQUNVLElBQVosQ0FBaUIsRUFBakIsQ0FBMUQ7QUFDQVAsTUFBQUEsT0FBTyxDQUFDSSxNQUFELENBQVA7QUFDRCxLQUhEO0FBSUQsR0FuQk0sQ0FBUDtBQW9CRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogSGFuZGxlIHN0ZGluIGlucHV0IHVzaW5nIGJ1ZmZlcnMgcmF0aGVyIHRoYW4gdGhlIGV2ZW50IGVtaXR0ZXIgb2YgcHJvY2Vzcy5zdGRpbiwgd2hpY2ggd2lsbCBub3Qga2VlcCB3YWl0aW5nIGluIGFuIGlkbGUgc3RhdGUgaWYgbm8gcGlwZWQgdmFsdWVzIGFyZSBwYXNzZWQgKGluIHRoZSBwcm9ncmFtIHdhcyBydW4gd2l0aG91dCBzaGVsbCBwaXBlbGluZSkuXG4gKiBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL2dldC1zdGRpblxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZFN0ZGluKHsgYXNCdWZmZXIgPSBmYWxzZSB9ID0ge30pIHtcbiAgY29uc3QgYWNjdW11bGF0b3IgPSBbXVxuICBsZXQgbGVuID0gMFxuXG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICBpZiAocHJvY2Vzcy5zdGRpbi5pc1RUWSkge1xuICAgICAgbGV0IHJlc3VsdCA9IGFzQnVmZmVyID8gQnVmZmVyLmNvbmNhdChbXSkgOiBhY2N1bXVsYXRvci5qb2luKCcnKVxuICAgICAgcmVzb2x2ZShyZXN1bHQpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgZGVidWdnZXJcbiAgICBwcm9jZXNzLnN0ZGluLm9uKCdyZWFkYWJsZScsICgpID0+IHtcbiAgICAgIGxldCBjaHVua1xuICAgICAgd2hpbGUgKChjaHVuayA9IHByb2Nlc3Muc3RkaW4ucmVhZCgpKSkge1xuICAgICAgICBhY2N1bXVsYXRvci5wdXNoKGNodW5rKVxuICAgICAgICBsZW4gKz0gY2h1bmsubGVuZ3RoXG4gICAgICB9XG4gICAgfSlcblxuICAgIHByb2Nlc3Muc3RkaW4ub24oJ2VuZCcsICgpID0+IHtcbiAgICAgIGxldCByZXN1bHQgPSBhc0J1ZmZlciA/IEJ1ZmZlci5jb25jYXQoYWNjdW11bGF0b3IsIGxlbikgOiBhY2N1bXVsYXRvci5qb2luKCcnKVxuICAgICAgcmVzb2x2ZShyZXN1bHQpXG4gICAgfSlcbiAgfSlcbn1cbiJdfQ==