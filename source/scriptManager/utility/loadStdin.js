/**
 * Handle stdin input using buffers rather than the event emitter of process.stdin, which will not keep waiting in an idle state if no piped values are passed (in the program was run without shell pipeline).
 * https://github.com/sindresorhus/get-stdin
  */
 export function loadStdin({ asBuffer = false } = {}) {
	const accumulator = []
	let len = 0

	return new Promise(resolve => {
		if (process.stdin.isTTY) {
            let result = (asBuffer) ? Buffer.concat([]) : accumulator.join('')
			resolve(result)
			return;
		}

		process.stdin.on('readable', () => {
			let chunk;
			while ((chunk = process.stdin.read())) {
				accumulator.push(chunk)
				len += chunk.length
			}
		})

		process.stdin.on('end', () => {
            let result = (asBuffer) ? Buffer.concat(accumulator, len) : accumulator.join('')
			resolve(result)
		})
	})
}
