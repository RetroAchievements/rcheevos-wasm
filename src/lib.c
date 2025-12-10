#include <rc_hash.h>
#include <rc_version.h>
#include "emscripten.h"

EMSCRIPTEN_KEEPALIVE
int hash_from_buffer(char hash[33], uint32_t console_id, const uint8_t *buffer, size_t buffer_size)
{
    return rc_hash_generate_from_buffer(hash, console_id, buffer, buffer_size);
}

EMSCRIPTEN_KEEPALIVE
char *rcheevos_version(void)
{
    return RCHEEVOS_VERSION_STRING;
}
