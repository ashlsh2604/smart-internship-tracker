/**
 * ============================================================================
 * Header: graph.h
 * Phase 2: Graph Representation via Adjacency List
 * Includes Breadth-First Search (BFS) and Depth-First Search (DFS)
 * Models: Company -> Available Roles -> Required Skills
 * ============================================================================
 */

#ifndef GRAPH_H
#define GRAPH_H

#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define strcasecmp _stricmp
#define strncasecmp _strnicmp
#else
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>
#endif

#define MAX_VERTICES 32
#define MAX_VERTEX_NAME 64

typedef enum {
    NODE_COMPANY = 0,
    NODE_ROLE,
    NODE_SKILL
} NodeType;

/* Edge in Adjacency List */
typedef struct AdjEdgeNode {
    int dest_index;
    char relation[32];          /* e.g. "hires_for", "requires_skill" */
    int weight;                 /* e.g. importance score (1 - 5) */
    struct AdjEdgeNode* next;
} AdjEdgeNode;

/* Vertex entry */
typedef struct {
    char name[MAX_VERTEX_NAME];
    NodeType type;
    AdjEdgeNode* head;
} Vertex;

/* Graph Container */
typedef struct {
    int num_vertices;
    Vertex vertices[MAX_VERTICES];
} SkillGraph;

typedef struct {
    int order[MAX_VERTICES];
    int count;
    char path_description[1024];
} TraversalResult;

/* Operations */
SkillGraph* graph_create(void);
void graph_destroy(SkillGraph* g);
int graph_add_vertex(SkillGraph* g, const char* name, NodeType type);
int graph_find_vertex(const SkillGraph* g, const char* name);
int graph_add_edge(SkillGraph* g, const char* src, const char* dest, const char* relation, int weight);
TraversalResult graph_bfs(const SkillGraph* g, const char* start_vertex_name);
TraversalResult graph_dfs(const SkillGraph* g, const char* start_vertex_name);
void graph_populate_sample_data(SkillGraph* g);

#endif /* GRAPH_H */
