/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// AMD2ESM mirgation relevant

declare global {


	/**
	 * @deprecated node modules that are in used in a context that
	 * shouldn't have access to node_modules (node-free renderer or
	 * shared process)
	 */
	var _VSCODE_NODE_MODULES: {
		crypto: typeof import('crypto');
		zlib: typeof import('zlib');
		net: typeof import('net');
		os: typeof import('os');
		module: typeof import('module');
		fs: typeof import('fs'),
		vm: typeof import('vm'),
		['native-watchdog']: typeof import('native-watchdog')
		perf_hooks: typeof import('perf_hooks');

		['vsda']: any,
		['vscode-encrypt']: any,

		// ESM-required (because of the shared process)
		['node:module']: typeof import('node:module');
		fs: typeof import('fs'),
		vm: typeof import('vm'),
		util: typeof import('util'),
		child_process: typeof import('child_process'),
		path: typeof import('path'),
		yauzl: typeof import('yauzl'),
		yazl: typeof import('yazl'),
		['graceful-fs']: typeof import('graceful-fs'),
		minimist: typeof import('minimist'),
		https: typeof import('https'),
		['xterm-headless']: typeof import('xterm-headless'),
		console: typeof import('console'),
		xterm: typeof import('xterm'),
	}
}

// fake export to make global work
export { }
