import Module, { type MainModule } from '../pkg/rcheevos'

export type InitInput = WebAssembly.Module | BufferSource | Response | string | URL

export let wasmInit: (() => InitInput) | undefined = undefined
export const setWasmInit = (arg: () => InitInput) => {
	wasmInit = arg
}

export const initializeWasm = async (input: InitInput): Promise<WebAssembly.Instance | MainModule> => {
	input = await input

	return Module({
		instantiateWasm: async (imports: WebAssembly.Imports, resolve: (arg: WebAssembly.Instance) => void) => {
			if (input instanceof WebAssembly.Module) {
				return resolve(await WebAssembly.instantiate(input, imports))
			}

			if (isBufferSource(input)) {
				return resolve(await WebAssembly.instantiate(input, imports).then(w => w.instance))
			}

			if (input instanceof Response) {
				return resolve(await WebAssembly.instantiateStreaming(input, imports).then(w => w.instance))
			}

			if (typeof input === 'string' || input instanceof URL) {
				return resolve(await WebAssembly.instantiateStreaming(fetch(input), imports).then(w => w.instance))
			}

			throw new Error('Unsupported InitInput type')
		},
	})
}

const isBufferSource = (input: InitInput): input is BufferSource => {
	return input instanceof ArrayBuffer || ArrayBuffer.isView(input)
}
