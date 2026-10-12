#ifndef HTTP_SERVER_H
#define HTTP_SERVER_H

#include <stdbool.h>

typedef struct {
    int port;
    const char *db_path;
} HttpServerConfig;

int start_http_server(const HttpServerConfig *config);

#endif /* HTTP_SERVER_H */
