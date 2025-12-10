import { Console } from './types/consoles'
import type { MainModule } from './pkg/rcheevos'
import { initializeWasm, InitInput, wasmInit } from './lib/wasm'

export class RCheevos {
	private constructor(private module: MainModule) {}

	public version(): string {
		const outPtr = this.module._rcheevos_version()
		return this.module.UTF8ToString(outPtr)
	}

	public computeHash(console: Console, file: ArrayBuffer): string | null {
		const data = new Uint8Array(file)
		const inPtr = this.module._malloc(data.length)
		const heapU8 = this.module.HEAPU8
		heapU8.set(data, inPtr)
		const outPtr = this.module._malloc(33) // 32-byte hash + null terminator
		const ok = this.module._hash_from_buffer(outPtr, console, inPtr, data.length)
		const hash = this.module.UTF8ToString(outPtr)
		this.module._free(inPtr)
		this.module._free(outPtr)
		return ok ? hash : null
	}

	/**
	 * Initializes a rcheevos instance. There is a one time global setup fee (sub 30ms), but subsequent
	 * requests to initialize will be instantaneous, so it's not imperative to reuse the same instance.
	 */
	public static initialize = async (options?: LoadOptions) => {
		if (initialized === undefined) {
			const loadModule = options?.wasm ?? wasmInit!()
			initialized = initializeWasm(loadModule) as unknown as Promise<MainModule>
		}

		return new RCheevos(await initialized)
	}

	/**
	 * Resets initialization so that one can initialize the module again. Only intended for tests.
	 */
	public static resetModule = () => {
		initialized = undefined
	}
}

/**
 * Customize how rcheevos is loaded
 */
export interface LoadOptions {
	/**
	 * Controls how the Wasm module is instantiated.
	 */
	wasm?: InitInput
}

let initialized: Promise<MainModule> | undefined = undefined
