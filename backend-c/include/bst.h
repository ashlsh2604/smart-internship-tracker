/**
 * ============================================================================
 * Header: bst.h
 * Phase 2: Binary Search Tree (BST) for Hierarchical Internship Indexing
 * Includes Inorder (sorted), Preorder (serialization), & Postorder traversals
 * ============================================================================
 */

#ifndef BST_H
#define BST_H

#include "internship.h"

/* BST Node */
typedef struct BSTNode {
    InternshipRecord data;
    struct BSTNode* left;
    struct BSTNode* right;
} BSTNode;

typedef struct {
    BSTNode* root;
    int size;
} BinarySearchTree;

typedef void (*BSTVisitorCallback)(const InternshipRecord* record, int depth, void* user_data);

/* Operations */
BinarySearchTree* bst_create(void);
void bst_destroy(BinarySearchTree* tree);
int bst_insert(BinarySearchTree* tree, InternshipRecord record);
const BSTNode* bst_search(const BinarySearchTree* tree, const char* company_name);
int bst_delete(BinarySearchTree* tree, const char* company_name);
int bst_height(const BinarySearchTree* tree);
void bst_inorder(const BinarySearchTree* tree, BSTVisitorCallback cb, void* user_data);
void bst_preorder(const BinarySearchTree* tree, BSTVisitorCallback cb, void* user_data);
void bst_postorder(const BinarySearchTree* tree, BSTVisitorCallback cb, void* user_data);

#endif /* BST_H */
