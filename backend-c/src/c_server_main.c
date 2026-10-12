/**
 * ============================================================================
 * SMART INTERNSHIP DEADLINE TRACKER - C BACKEND REST SERVER ENTRY POINT
 * Source: c_server_main.c
 * Standalone C executable starting the HTTP REST API server with SQLite3
 * ============================================================================
 */

#include "../include/http_server.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[]) {
    int port = 8080;
    const char *db_path = "tracker.db";

    /* Parse command line arguments */
    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "--port") == 0 && i + 1 < argc) {
            port = atoi(argv[++i]);
        } else if (strcmp(argv[i], "-p") == 0 && i + 1 < argc) {
            port = atoi(argv[++i]);
        } else if (strcmp(argv[i], "--db") == 0 && i + 1 < argc) {
            db_path = argv[++i];
        } else if (strcmp(argv[i], "-d") == 0 && i + 1 < argc) {
            db_path = argv[++i];
        }
    }

    /* Check environment variables if not passed in flags */
    const char *env_port = getenv("PORT");
    if (!env_port) env_port = getenv("C_BACKEND_PORT");
    if (env_port && port == 8080) {
        int ep = atoi(env_port);
        if (ep > 0) port = ep;
    }

    const char *env_db = getenv("DB_PATH");
    if (env_db) {
        db_path = env_db;
    }

    HttpServerConfig config;
    config.port = port;
    config.db_path = db_path;

    return start_http_server(&config);
}
