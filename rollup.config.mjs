import { wasm } from '@rollup/plugin-wasm'
import typescript from '@rollup/plugin-typescript'

const outdir = (fmt, env) => {
	if (env == 'node') return `node`
	else return `${fmt}${env == 'slim' ? '-slim' : ''}`
}

const rolls = (fmt, env) => ({
	input: env !== 'slim' ? 'src/entrypoints/index.ts' : 'src/entrypoints/index_slim.ts',
	output: {
		dir: `dist`,
		format: fmt,
		name: 'rcheevos',
		entryFileNames: outdir(fmt, env) + `/[name].` + (fmt === 'cjs' ? 'cjs' : 'js'),
	},
	plugins: [
		// We want to inline our wasm bundle as base64. Not needing browser users
		// to fetch an additional asset is a boon as there's less room for errors
		env != 'slim' &&
			wasm(
				env == 'node'
					? { maxFileSize: 0, targetEnv: 'node', publicPath: '../', fileName: '[name][extname]' }
					: { targetEnv: 'auto-inline' }
			),
		typescript({
			target: fmt == 'es' ? 'ES2022' : 'ES2017',
			outDir: `dist/${outdir(fmt, env)}`,
			rootDir: 'src',
		}),
	],
})

export default [
	rolls('umd', 'fat'),
	rolls('es', 'fat'),
	rolls('cjs', 'fat'),
	rolls('cjs', 'node'),
	rolls('es', 'slim'),
	rolls('cjs', 'slim'),
]
