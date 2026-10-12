# Makefile for Smart Internship Deadline Tracker C Backend
CC = gcc
CFLAGS = -Wall -Wextra -O2 -Iinclude -std=c11
LDFLAGS = -lsqlite3 -lpthread

SRC_DIR = src
INC_DIR = include
OBJ_DIR = obj

# Binaries
ENGINE_BIN = c_engine
SERVER_BIN = c_http_server

# Common DSA object files
COMMON_OBJS = $(OBJ_DIR)/bst.o \
              $(OBJ_DIR)/expression_stack.o \
              $(OBJ_DIR)/graph.o \
              $(OBJ_DIR)/linked_list.o \
              $(OBJ_DIR)/problem_solving.o \
              $(OBJ_DIR)/queue.o \
              $(OBJ_DIR)/searching.o \
              $(OBJ_DIR)/sorting.o \
              $(OBJ_DIR)/stack.o

# Engine objects
ENGINE_OBJS = $(COMMON_OBJS) $(OBJ_DIR)/c_engine.o

# Server objects
SERVER_OBJS = $(COMMON_OBJS) \
              $(OBJ_DIR)/crypto.o \
              $(OBJ_DIR)/db.o \
              $(OBJ_DIR)/http_server.o \
              $(OBJ_DIR)/c_server_main.o

all: $(ENGINE_BIN) $(SERVER_BIN)

$(OBJ_DIR):
	mkdir -p $(OBJ_DIR)

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c | $(OBJ_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

$(ENGINE_BIN): $(ENGINE_OBJS)
	$(CC) $(ENGINE_OBJS) -o $@
	chmod +x $@

$(SERVER_BIN): $(SERVER_OBJS)
	$(CC) $(SERVER_OBJS) -o $@ $(LDFLAGS)
	chmod +x $@

test: $(ENGINE_BIN)
	./$(ENGINE_BIN)

clean:
	rm -rf $(OBJ_DIR) $(ENGINE_BIN) $(SERVER_BIN) *.db

.PHONY: all test clean

