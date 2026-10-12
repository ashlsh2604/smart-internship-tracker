#ifndef CRYPTO_H
#define CRYPTO_H

#include <stddef.h>
#include <stdint.h>

/* SHA-256 context structure */
typedef struct {
    uint8_t data[64];
    uint32_t datalen;
    uint64_t bitlen;
    uint32_t state[8];
} SHA256_CTX;

void sha256_init(SHA256_CTX *ctx);
void sha256_update(SHA256_CTX *ctx, const uint8_t *data, size_t len);
void sha256_final(SHA256_CTX *ctx, uint8_t hash[32]);

/* Helper functions for password security */
void sha256_hash_string(const char *input, char output_hex[65]);
void generate_salt(char output_hex[33]);
void hash_password(const char *password, const char *salt, char output_hash[65]);
void generate_token(char output_token[65]);

#endif /* CRYPTO_H */
