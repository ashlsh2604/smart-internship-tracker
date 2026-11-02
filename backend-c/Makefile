# Makefile for Smart Internship Deadline Tracker C Backend (Windows 10/11 & POSIX)
CC ?= gcc
CFLAGS = -Wall -Wextra -O2 -Iinclude -std=c11

SRC_DIR = src
INC_DIR = include
OBJ_DIR = obj

# Cross-platform Windows & POSIX Detection
ifeq ($(OS),Windows_NT)
    EXE = .exe
    LDFLAGS = -lws2_32 -lsqlite3
    MKDIR_CMD = if not exist $(OBJ_DIR) mkdir $(OBJ_DIR)
    CHMOD_CMD = 
else
    EXE =
    LDFLAGS = -lsqlite3 -lpthread
    MKDIR_CMD = mkdir -p $(OBJ_DIR)
    CHMOD_CMD = chmod +x
endif

ENGINE_BIN = c_engine$(EXE)
SERVER_BIN = c_http_server$(EXE)

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
	@$(MKDIR_CMD)

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c | $(OBJ_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

$(ENGINE_BIN): $(ENGINE_OBJS)
	$(CC) $(ENGINE_OBJS) -o $@
ifneq ($(CHMOD_CMD),)
	@$(CHMOD_CMD) $@
endif

$(SERVER_BIN): $(SERVER_OBJS)
	$(CC) $(SERVER_OBJS) -o $@ $(LDFLAGS)
ifneq ($(CHMOD_CMD),)
	@$(CHMOD_CMD) $@
endif

test: $(ENGINE_BIN)
ifeq ($(OS),Windows_NT)
	$(ENGINE_BIN)
else
	./$(ENGINE_BIN)
endif

clean:
ifeq ($(OS),Windows_NT)
	-if exist $(OBJ_DIR) rmdir /S /Q $(OBJ_DIR)
	-if exist $(ENGINE_BIN) del /Q /F $(ENGINE_BIN)
	-if exist $(SERVER_BIN) del /Q /F $(SERVER_BIN)
	-if exist *.db del /Q /F *.db
else
	rm -rf $(OBJ_DIR) $(ENGINE_BIN) $(SERVER_BIN) *.db
endif

.PHONY: all test clean
