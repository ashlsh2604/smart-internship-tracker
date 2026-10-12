#ifndef DB_H
#define DB_H

#include "internship.h"
#include <stdbool.h>

#define MAX_EMAIL_LEN 128
#define MAX_NAME_LEN 128
#define MAX_HASH_LEN 65
#define MAX_SALT_LEN 33
#define MAX_TOKEN_LEN 65

typedef struct {
    char id[MAX_ID_LEN];
    char name[MAX_NAME_LEN];
    char email[MAX_EMAIL_LEN];
    char password_hash[MAX_HASH_LEN];
    char salt[MAX_SALT_LEN];
    char college[MAX_STR_LEN];
    char major[MAX_STR_LEN];
    char target_role[MAX_STR_LEN];
    char graduation_year[MAX_DATE_LEN];
    char created_at[MAX_DATE_LEN * 2];
} UserRecord;

/* Database lifecycle */
int db_init(const char *db_path);
void db_close(void);

/* User & Auth Operations */
bool db_find_user_by_email(const char *email, UserRecord *out_user);
bool db_find_user_by_id(const char *user_id, UserRecord *out_user);
bool db_create_user(const UserRecord *user);
bool db_update_user_profile(const char *user_id, const char *name, const char *college,
                            const char *major, const char *target_role, const char *graduation_year);

/* Session Operations */
bool db_create_session(const char *token, const char *user_id, int expiry_seconds);
bool db_find_session(const char *token, char *out_user_id);
bool db_delete_session(const char *token);

/* Internship Operations (Enforces user isolation) */
int db_get_user_internships(const char *user_id, InternshipRecord **out_records);
bool db_find_internship_by_id(const char *user_id, const char *record_id, InternshipRecord *out_rec);
bool db_insert_internship(const char *user_id, const InternshipRecord *record);
bool db_update_internship(const char *user_id, const InternshipRecord *record);
bool db_delete_internship(const char *user_id, const char *record_id);

#endif /* DB_H */
