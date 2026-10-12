/**
 * ============================================================================
 * Source: graph.c
 * Phase 2: Adjacency List Graph Implementation with BFS & DFS
 * ============================================================================
 */

#include "../include/graph.h"

SkillGraph* graph_create(void) {
    SkillGraph* g = (SkillGraph*)malloc(sizeof(SkillGraph));
    if (!g) return NULL;
    g->num_vertices = 0;
    for (int i = 0; i < MAX_VERTICES; i++) {
        g->vertices[i].head = NULL;
        g->vertices[i].name[0] = '\0';
    }
    return g;
}

void graph_destroy(SkillGraph* g) {
    if (!g) return;
    for (int i = 0; i < g->num_vertices; i++) {
        AdjEdgeNode* curr = g->vertices[i].head;
        while (curr) {
            AdjEdgeNode* next = curr->next;
            free(curr);
            curr = next;
        }
    }
    free(g);
}

int graph_find_vertex(const SkillGraph* g, const char* name) {
    if (!g || !name) return -1;
    for (int i = 0; i < g->num_vertices; i++) {
        if (strcasecmp(g->vertices[i].name, name) == 0) {
            return i;
        }
    }
    return -1;
}

int graph_add_vertex(SkillGraph* g, const char* name, NodeType type) {
    if (!g || !name) return -1;
    int idx = graph_find_vertex(g, name);
    if (idx != -1) return idx;

    if (g->num_vertices >= MAX_VERTICES) return -1;
    idx = g->num_vertices++;
    strncpy(g->vertices[idx].name, name, MAX_VERTEX_NAME - 1);
    g->vertices[idx].name[MAX_VERTEX_NAME - 1] = '\0';
    g->vertices[idx].type = type;
    g->vertices[idx].head = NULL;
    return idx;
}

int graph_add_edge(SkillGraph* g, const char* src, const char* dest, const char* relation, int weight) {
    if (!g || !src || !dest) return 0;
    int src_idx = graph_find_vertex(g, src);
    int dest_idx = graph_find_vertex(g, dest);
    if (src_idx == -1 || dest_idx == -1) return 0;

    AdjEdgeNode* edge = (AdjEdgeNode*)malloc(sizeof(AdjEdgeNode));
    if (!edge) return 0;
    edge->dest_index = dest_idx;
    strncpy(edge->relation, relation ? relation : "relates_to", sizeof(edge->relation) - 1);
    edge->relation[sizeof(edge->relation) - 1] = '\0';
    edge->weight = weight;
    edge->next = g->vertices[src_idx].head;
    g->vertices[src_idx].head = edge;
    return 1;
}

/* BFS using a simple circular array queue */
TraversalResult graph_bfs(const SkillGraph* g, const char* start_vertex_name) {
    TraversalResult res;
    res.count = 0;
    res.path_description[0] = '\0';

    if (!g) return res;
    int start_idx = graph_find_vertex(g, start_vertex_name);
    if (start_idx == -1) return res;

    int visited[MAX_VERTICES] = {0};
    int queue[MAX_VERTICES];
    int front = 0, rear = 0;

    visited[start_idx] = 1;
    queue[rear++] = start_idx;

    char buffer[256];

    while (front < rear) {
        int curr = queue[front++];
        res.order[res.count++] = curr;

        snprintf(buffer, sizeof(buffer), "%s%s",
                 (res.count == 1 ? "" : " -> "),
                 g->vertices[curr].name);
        strncat(res.path_description, buffer, sizeof(res.path_description) - strlen(res.path_description) - 1);

        AdjEdgeNode* edge = g->vertices[curr].head;
        while (edge) {
            int neighbor = edge->dest_index;
            if (!visited[neighbor]) {
                visited[neighbor] = 1;
                queue[rear++] = neighbor;
            }
            edge = edge->next;
        }
    }
    return res;
}

/* DFS recursive helper */
static void dfs_helper(const SkillGraph* g, int curr, int visited[], TraversalResult* res) {
    visited[curr] = 1;
    res->order[res->count++] = curr;

    char buffer[256];
    snprintf(buffer, sizeof(buffer), "%s%s",
             (res->count == 1 ? "" : " -> "),
             g->vertices[curr].name);
    strncat(res->path_description, buffer, sizeof(res->path_description) - strlen(res->path_description) - 1);

    AdjEdgeNode* edge = g->vertices[curr].head;
    while (edge) {
        int neighbor = edge->dest_index;
        if (!visited[neighbor]) {
            dfs_helper(g, neighbor, visited, res);
        }
        edge = edge->next;
    }
}

TraversalResult graph_dfs(const SkillGraph* g, const char* start_vertex_name) {
    TraversalResult res;
    res.count = 0;
    res.path_description[0] = '\0';

    if (!g) return res;
    int start_idx = graph_find_vertex(g, start_vertex_name);
    if (start_idx == -1) return res;

    int visited[MAX_VERTICES] = {0};
    dfs_helper(g, start_idx, visited, &res);
    return res;
}

void graph_populate_sample_data(SkillGraph* g) {
    if (!g) return;

    /* Add Company Vertices */
    graph_add_vertex(g, "Google", NODE_COMPANY);
    graph_add_vertex(g, "Microsoft", NODE_COMPANY);
    graph_add_vertex(g, "Amazon", NODE_COMPANY);
    graph_add_vertex(g, "Stripe", NODE_COMPANY);

    /* Add Role Vertices */
    graph_add_vertex(g, "SWE Intern", NODE_ROLE);
    graph_add_vertex(g, "Explore Intern", NODE_ROLE);
    graph_add_vertex(g, "Cloud SDE Intern", NODE_ROLE);
    graph_add_vertex(g, "Systems Intern", NODE_ROLE);

    /* Add Skill Vertices */
    graph_add_vertex(g, "Data Structures & C", NODE_SKILL);
    graph_add_vertex(g, "Algorithms & Graphs", NODE_SKILL);
    graph_add_vertex(g, "Systems Programming", NODE_SKILL);
    graph_add_vertex(g, "Distributed Systems", NODE_SKILL);
    graph_add_vertex(g, "React & Frontend", NODE_SKILL);

    /* Edges: Company -> Role */
    graph_add_edge(g, "Google", "SWE Intern", "hires_for", 5);
    graph_add_edge(g, "Microsoft", "Explore Intern", "hires_for", 4);
    graph_add_edge(g, "Amazon", "Cloud SDE Intern", "hires_for", 5);
    graph_add_edge(g, "Stripe", "Systems Intern", "hires_for", 5);

    /* Edges: Role -> Skill */
    graph_add_edge(g, "SWE Intern", "Data Structures & C", "requires", 5);
    graph_add_edge(g, "SWE Intern", "Algorithms & Graphs", "requires", 5);
    graph_add_edge(g, "Explore Intern", "Data Structures & C", "requires", 4);
    graph_add_edge(g, "Cloud SDE Intern", "Algorithms & Graphs", "requires", 5);
    graph_add_edge(g, "Cloud SDE Intern", "Distributed Systems", "requires", 4);
    graph_add_edge(g, "Systems Intern", "Systems Programming", "requires", 5);
    graph_add_edge(g, "Systems Intern", "Data Structures & C", "requires", 5);
}
