export * from './index_core'
import { setWasmInit } from '../lib/wasm'
import rcheevos_wasm from '../pkg/rcheevos.wasm'

// @ts-ignore
setWasmInit(() => rcheevos_wasm())
