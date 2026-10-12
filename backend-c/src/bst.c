/**
 * ============================================================================
 * Source: bst.c
 * Phase 2: Binary Search Tree Implementation
 * Key: Company Name (case-insensitive alphabetical order)
 * ============================================================================
 */

#include "../include/bst.h"
#include <ctype.h>

BinarySearchTree* bst_create(void) {
    BinarySearchTree* tree = (BinarySearchTree*)malloc(sizeof(BinarySearchTree));
    if (!tree) return NULL;
    tree->root = NULL;
    tree->size = 0;
    return tree;
}

static void bst_free_subtree(BSTNode* node) {
    if (!node) return;
    bst_free_subtree(node->left);
    bst_free_subtree(node->right);
    free(node);
}

void bst_destroy(BinarySearchTree* tree) {
    if (!tree) return;
    bst_free_subtree(tree->root);
    free(tree);
}

static int compare_keys(const char* a, const char* b) {
    return strcasecmp(a, b);
}

static BSTNode* bst_insert_node(BSTNode* root, InternshipRecord record, int* inserted) {
    if (!root) {
        BSTNode* node = (BSTNode*)malloc(sizeof(BSTNode));
        if (!node) return NULL;
        node->data = record;
        node->left = NULL;
        node->right = NULL;
        *inserted = 1;
        return node;
    }

    int cmp = compare_keys(record.company_name, root->data.company_name);
    if (cmp < 0) {
        root->left = bst_insert_node(root->left, record, inserted);
    } else if (cmp > 0) {
        root->right = bst_insert_node(root->right, record, inserted);
    } else {
        /* Equal company name: secondary sort on id or update */
        int cmp_id = strcmp(record.id, root->data.id);
        if (cmp_id < 0) {
            root->left = bst_insert_node(root->left, record, inserted);
        } else {
            root->right = bst_insert_node(root->right, record, inserted);
        }
    }
    return root;
}

int bst_insert(BinarySearchTree* tree, InternshipRecord record) {
    if (!tree) return 0;
    int inserted = 0;
    tree->root = bst_insert_node(tree->root, record, &inserted);
    if (inserted) {
        tree->size++;
    }
    return inserted;
}

static const BSTNode* bst_search_node(const BSTNode* root, const char* company_name) {
    if (!root) return NULL;
    int cmp = compare_keys(company_name, root->data.company_name);
    if (cmp == 0) return root;
    if (cmp < 0) return bst_search_node(root->left, company_name);
    return bst_search_node(root->right, company_name);
}

const BSTNode* bst_search(const BinarySearchTree* tree, const char* company_name) {
    if (!tree || !company_name) return NULL;
    return bst_search_node(tree->root, company_name);
}

static BSTNode* find_min(BSTNode* node) {
    while (node && node->left) {
        node = node->left;
    }
    return node;
}

static BSTNode* bst_delete_node(BSTNode* root, const char* company_name, int* deleted) {
    if (!root) return NULL;

    int cmp = compare_keys(company_name, root->data.company_name);
    if (cmp < 0) {
        root->left = bst_delete_node(root->left, company_name, deleted);
    } else if (cmp > 0) {
        root->right = bst_delete_node(root->right, company_name, deleted);
    } else {
        /* Found node to delete */
        *deleted = 1;
        /* Case 1: No child or 1 child */
        if (!root->left) {
            BSTNode* temp = root->right;
            free(root);
            return temp;
        } else if (!root->right) {
            BSTNode* temp = root->left;
            free(root);
            return temp;
        }

        /* Case 2: 2 children - get inorder successor (smallest in right subtree) */
        BSTNode* temp = find_min(root->right);
        root->data = temp->data;
        root->right = bst_delete_node(root->right, temp->data.company_name, deleted);
    }
    return root;
}

int bst_delete(BinarySearchTree* tree, const char* company_name) {
    if (!tree || !company_name) return 0;
    int deleted = 0;
    tree->root = bst_delete_node(tree->root, company_name, &deleted);
    if (deleted) tree->size--;
    return deleted;
}

static int node_height(const BSTNode* node) {
    if (!node) return 0;
    int left_h = node_height(node->left);
    int right_h = node_height(node->right);
    return 1 + (left_h > right_h ? left_h : right_h);
}

int bst_height(const BinarySearchTree* tree) {
    return tree ? node_height(tree->root) : 0;
}

static void inorder_walk(const BSTNode* node, int depth, BSTVisitorCallback cb, void* user_data) {
    if (!node) return;
    inorder_walk(node->left, depth + 1, cb, user_data);
    cb(&node->data, depth, user_data);
    inorder_walk(node->right, depth + 1, cb, user_data);
}

void bst_inorder(const BinarySearchTree* tree, BSTVisitorCallback cb, void* user_data) {
    if (!tree || !cb) return;
    inorder_walk(tree->root, 0, cb, user_data);
}

static void preorder_walk(const BSTNode* node, int depth, BSTVisitorCallback cb, void* user_data) {
    if (!node) return;
    cb(&node->data, depth, user_data);
    preorder_walk(node->left, depth + 1, cb, user_data);
    preorder_walk(node->right, depth + 1, cb, user_data);
}

void bst_preorder(const BinarySearchTree* tree, BSTVisitorCallback cb, void* user_data) {
    if (!tree || !cb) return;
    preorder_walk(tree->root, 0, cb, user_data);
}

static void postorder_walk(const BSTNode* node, int depth, BSTVisitorCallback cb, void* user_data) {
    if (!node) return;
    postorder_walk(node->left, depth + 1, cb, user_data);
    postorder_walk(node->right, depth + 1, cb, user_data);
    cb(&node->data, depth, user_data);
}

void bst_postorder(const BinarySearchTree* tree, BSTVisitorCallback cb, void* user_data) {
    if (!tree || !cb) return;
    postorder_walk(tree->root, 0, cb, user_data);
}
