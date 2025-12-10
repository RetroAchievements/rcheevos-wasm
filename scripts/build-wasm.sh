#!/usr/bin/env bash
set -euo pipefail

rm -rf src/pkg
mkdir -p src/pkg

emcc -O3 -s WASM=1 -sALLOW_MEMORY_GROWTH \
    -o src/pkg/rcheevos.mjs \
    --emit-tsd rcheevos.d.ts \
    -s EXPORTED_RUNTIME_METHODS='["cwrap","UTF8ToString","HEAPU8"]' \
    -s EXPORTED_FUNCTIONS='["_hash_from_buffer","_malloc","_free","_rcheevos_version"]' \
    -I rcheevos/include \
    -I rcheevos/src \
    src/lib.c \
    rcheevos/src/rhash/*.c rcheevos/src/rc_version.c
