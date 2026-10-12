/**
 * ============================================================================
 * SMART INTERNSHIP DEADLINE TRACKER - C BACKEND
 * Source: db.c
 * Persistent SQLite3 Database Operations with User Isolation & Password Hashing
 * ============================================================================
 */

#include "../include/db.h"
#include "../include/crypto.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <sqlite3.h>

static sqlite3 *g_db = NULL;

static const char *SCHEMA_SQL =
    "CREATE TABLE IF NOT EXISTS users ("
    "  id TEXT PRIMARY KEY,"
    "  name TEXT NOT NULL,"
    "  email TEXT UNIQUE NOT NULL,"
    "  password_hash TEXT NOT NULL,"
    "  salt TEXT NOT NULL,"
    "  college TEXT DEFAULT '',"
    "  major TEXT DEFAULT '',"
    "  target_role TEXT DEFAULT '',"
    "  graduation_year TEXT DEFAULT '',"
    "  created_at TEXT NOT NULL"
    ");"
    "CREATE TABLE IF NOT EXISTS sessions ("
    "  token TEXT PRIMARY KEY,"
    "  user_id TEXT NOT NULL,"
    "  created_at TEXT NOT NULL,"
    "  expires_at TEXT NOT NULL,"
    "  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE"
    ");"
    "CREATE TABLE IF NOT EXISTS internships ("
    "  id TEXT PRIMARY KEY,"
    "  user_id TEXT NOT NULL,"
    "  company_name TEXT NOT NULL,"
    "  job_role TEXT NOT NULL,"
    "  location TEXT NOT NULL,"
    "  deadline TEXT NOT NULL,"
    "  status TEXT NOT NULL,"
    "  priority TEXT NOT NULL,"
    "  application_date TEXT NOT NULL,"
    "  notes TEXT DEFAULT '',"
    "  stipend INTEGER DEFAULT 0,"
    "  interview_rounds INTEGER DEFAULT 1,"
    "  prep_hours_required INTEGER DEFAULT 0,"
    "  created_at TEXT NOT NULL,"
    "  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE"
    ");";

/* Initial blueprint seed records */
static InternshipRecord INITIAL_SEEDS[] = {
    {
        .id = "INT-101",
        .company_name = "Google",
        .job_role = "Software Engineering Intern",
        .location = "Mountain View, CA (Hybrid)",
        .deadline = "2026-10-15",
        .status = STATUS_APPLIED,
        .priority = PRIORITY_HIGH,
        .application_date = "2026-09-01",
        .notes = "Completed coding assessment. Reviewing DSA fundamentals.",
        .stipend = 9200,
        .interview_rounds = 3,
        .prep_hours_required = 20
    },
    {
        .id = "INT-102",
        .company_name = "Microsoft",
        .job_role = "Explore Intern (Engineering & PM)",
        .location = "Redmond, WA (On-site)",
        .deadline = "2026-09-25",
        .status = STATUS_INTERVIEWING,
        .priority = PRIORITY_HIGH,
        .application_date = "2026-08-20",
        .notes = "Round 1 technical scheduled on tree traversals & graphs.",
        .stipend = 8500,
        .interview_rounds = 4,
        .prep_hours_required = 16
    },
    {
        .id = "INT-103",
        .company_name = "Amazon",
        .job_role = "SDE Intern",
        .location = "Seattle, WA",
        .deadline = "2026-11-01",
        .status = STATUS_UNDER_REVIEW,
        .priority = PRIORITY_MEDIUM,
        .application_date = "2026-09-04",
        .notes = "Application submitted through campus portal.",
        .stipend = 8800,
        .interview_rounds = 3,
        .prep_hours_required = 14
    },
    {
        .id = "INT-104",
        .company_name = "Adobe",
        .job_role = "Frontend Engineering Intern",
        .location = "San Jose, CA (Remote Friendly)",
        .deadline = "2026-10-05",
        .status = STATUS_BOOKMARKED,
        .priority = PRIORITY_MEDIUM,
        .application_date = "2026-09-05",
        .notes = "Tailoring portfolio and highlighting React & TypeScript.",
        .stipend = 7600,
        .interview_rounds = 2,
        .prep_hours_required = 10
    },
    {
        .id = "INT-105",
        .company_name = "Stripe",
        .job_role = "Systems Engineering Intern",
        .location = "San Francisco, CA",
        .deadline = "2026-09-20",
        .status = STATUS_APPLIED,
        .priority = PRIORITY_HIGH,
        .application_date = "2026-08-28",
        .notes = "Urgent deadline in 2 weeks. High interest in payments infrastructure.",
        .stipend = 9800,
        .interview_rounds = 4,
        .prep_hours_required = 24
    }
};

static void seed_user_initial_internships(const char *user_id) {
    int seed_count = sizeof(INITIAL_SEEDS) / sizeof(INITIAL_SEEDS[0]);
    for (int i = 0; i < seed_count; i++) {
        InternshipRecord rec = INITIAL_SEEDS[i];
        /* Ensure unique ID per user seed */
        snprintf(rec.id, sizeof(rec.id), "%s_%d", INITIAL_SEEDS[i].id, (int)(time(NULL) % 10000));
        db_insert_internship(user_id, &rec);
    }
}

int db_init(const char *db_path) {
    if (!db_path) db_path = "tracker.db";

    int rc = sqlite3_open(db_path, &g_db);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "[C DB Error] Cannot open database %s: %s\n", db_path, sqlite3_errmsg(g_db));
        return -1;
    }

    char *err_msg = NULL;
    rc = sqlite3_exec(g_db, SCHEMA_SQL, NULL, NULL, &err_msg);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "[C DB Error] Schema execution error: %s\n", err_msg);
        sqlite3_free(err_msg);
        return -1;
    }

    /* Seed default demo user if not present */
    UserRecord demo_user;
    if (!db_find_user_by_email("student@college.edu", &demo_user)) {
        UserRecord new_demo;
        strcpy(new_demo.id, "usr_demo_101");
        strcpy(new_demo.name, "Alex Morgan");
        strcpy(new_demo.email, "student@college.edu");
        strcpy(new_demo.college, "School of Computer Science & Engineering");
        strcpy(new_demo.major, "B.Tech Computer Science");
        strcpy(new_demo.target_role, "Software Development Engineer Intern");
        strcpy(new_demo.graduation_year, "2027");

        time_t now = time(NULL);
        snprintf(new_demo.created_at, sizeof(new_demo.created_at), "%ld", (long)now);

        generate_salt(new_demo.salt);
        hash_password("password123", new_demo.salt, new_demo.password_hash);

        db_create_user(&new_demo);
        seed_user_initial_internships(new_demo.id);
        printf("[C DB] Seeded initial demo user: %s (Password: password123)\n", new_demo.email);
    }

    return 0;
}

void db_close(void) {
    if (g_db) {
        sqlite3_close(g_db);
        g_db = NULL;
    }
}

bool db_find_user_by_email(const char *email, UserRecord *out_user) {
    if (!g_db || !email) return false;

    const char *sql = "SELECT id, name, email, password_hash, salt, college, major, target_role, graduation_year, created_at FROM users WHERE lower(email) = lower(?) LIMIT 1;";
    sqlite3_stmt *stmt;

    if (sqlite3_prepare_v2(g_db, sql, -1, &stmt, NULL) != SQLITE_OK) {
        return false;
    }

    sqlite3_bind_text(stmt, 1, email, -1, SQLITE_STATIC);

    bool found = false;
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        if (out_user) {
            strncpy(out_user->id, (const char*)sqlite3_column_text(stmt, 0), sizeof(out_user->id) - 1);
            strncpy(out_user->name, (const char*)sqlite3_column_text(stmt, 1), sizeof(out_user->name) - 1);
            strncpy(out_user->email, (const char*)sqlite3_column_text(stmt, 2), sizeof(out_user->email) - 1);
            strncpy(out_user->password_hash, (const char*)sqlite3_column_text(stmt, 3), sizeof(out_user->password_hash) - 1);
            strncpy(out_user->salt, (const char*)sqlite3_column_text(stmt, 4), sizeof(out_user->salt) - 1);
            strncpy(out_user->college, sqlite3_column_text(stmt, 5) ? (const char*)sqlite3_column_text(stmt, 5) : "", sizeof(out_user->college) - 1);
            strncpy(out_user->major, sqlite3_column_text(stmt, 6) ? (const char*)sqlite3_column_text(stmt, 6) : "", sizeof(out_user->major) - 1);
            strncpy(out_user->target_role, sqlite3_column_text(stmt, 7) ? (const char*)sqlite3_column_text(stmt, 7) : "", sizeof(out_user->target_role) - 1);
            strncpy(out_user->graduation_year, sqlite3_column_text(stmt, 8) ? (const char*)sqlite3_column_text(stmt, 8) : "", sizeof(out_user->graduation_year) - 1);
            strncpy(out_user->created_at, (const char*)sqlite3_column_text(stmt, 9), sizeof(out_user->created_at) - 1);
        }
        found = true;
    }

    sqlite3_finalize(stmt);
    return found;
}

bool db_find_user_by_id(const char *user_id, UserRecord *out_user) {
    if (!g_db || !user_id) return false;

    const char *sql = "SELECT id, name, email, password_hash, salt, college, major, target_role, graduation_year, created_at FROM users WHERE id = ? LIMIT 1;";
    sqlite3_stmt *stmt;

    if (sqlite3_prepare_v2(g_db, sql, -1, &stmt, NULL) != SQLITE_OK) {
        return false;
    }

    sqlite3_bind_text(stmt, 1, user_id, -1, SQLITE_STATIC);

    bool found = false;
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        if (out_user) {
            strncpy(out_user->id, (const char*)sqlite3_column_text(stmt, 0), sizeof(out_user->id) - 1);
            strncpy(out_user->name, (const char*)sqlite3_column_text(stmt, 1), sizeof(out_user->name) - 1);
            strncpy(out_user->email, (const char*)sqlite3_column_text(stmt, 2), sizeof(out_user->email) - 1);
            strncpy(out_user->password_hash, (const char*)sqlite3_column_text(stmt, 3), sizeof(out_user->password_hash) - 1);
            strncpy(out_user->salt, (const char*)sqlite3_column_text(stmt, 4), sizeof(out_user->salt) - 1);
            strncpy(out_user->college, sqlite3_column_text(stmt, 5) ? (const char*)sqlite3_column_text(stmt, 5) : "", sizeof(out_user->college) - 1);
            strncpy(out_user->major, sqlite3_column_text(stmt, 6) ? (const char*)sqlite3_column_text(stmt, 6) : "", sizeof(out_user->major) - 1);
            strncpy(out_user->target_role, sqlite3_column_text(stmt, 7) ? (const char*)sqlite3_column_text(stmt, 7) : "", sizeof(out_user->target_role) - 1);
            strncpy(out_user->graduation_year, sqlite3_column_text(stmt, 8) ? (const char*)sqlite3_column_text(stmt, 8) : "", sizeof(out_user->graduation_year) - 1);
            strncpy(out_user->created_at, (const char*)sqlite3_column_text(stmt, 9), sizeof(out_user->created_at) - 1);
        }
        found = true;
    }

    sqlite3_finalize(stmt);
    return found;
}

bool db_create_user(const UserRecord *user) {
    if (!g_db || !user) return false;

    const char *sql = "INSERT INTO users (id, name, email, password_hash, salt, college, major, target_role, graduation_year, created_at) "
                      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    sqlite3_stmt *stmt;

    if (sqlite3_prepare_v2(g_db, sql, -1, &stmt, NULL) != SQLITE_OK) {
        return false;
    }

    sqlite3_bind_text(stmt, 1, user->id, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, user->name, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 3, user->email, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 4, user->password_hash, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 5, user->salt, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 6, user->college, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 7, user->major, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 8, user->target_role, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 9, user->graduation_year, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 10, user->created_at, -1, SQLITE_STATIC);

    int rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);

    if (rc == SQLITE_DONE) {
        /* Seed initial applications for the new student */
        seed_user_initial_internships(user->id);
        return true;
    }
    return false;
}

bool db_update_user_profile(const char *user_id, const char *name, const char *college,
                            const char *major, const char *target_role, const char *graduation_year) {
    if (!g_db || !user_id) return false;

    const char *sql = "UPDATE users SET name = ?, college = ?, major = ?, target_role = ?, graduation_year = ? WHERE id = ?;";
    sqlite3_stmt *stmt;

    if (sqlite3_prepare_v2(g_db, sql, -1, &stmt, NULL) != SQLITE_OK) return false;

    sqlite3_bind_text(stmt, 1, name ? name : "", -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, college ? college : "", -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 3, major ? major : "", -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 4, target_role ? target_role : "", -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 5, graduation_year ? graduation_year : "", -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 6, user_id, -1, SQLITE_STATIC);

    int rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);
    return (rc == SQLITE_DONE);
}

bool db_create_session(const char *token, const char *user_id, int expiry_seconds) {
    if (!g_db || !token || !user_id) return false;

    time_t now = time(NULL);
    time_t expires = now + expiry_seconds;

    char created_str[32], expires_str[32];
    snprintf(created_str, sizeof(created_str), "%ld", (long)now);
    snprintf(expires_str, sizeof(expires_str), "%ld", (long)expires);

    const char *sql = "INSERT OR REPLACE INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?);";
    sqlite3_stmt *stmt;

    if (sqlite3_prepare_v2(g_db, sql, -1, &stmt, NULL) != SQLITE_OK) return false;

    sqlite3_bind_text(stmt, 1, token, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, user_id, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 3, created_str, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 4, expires_str, -1, SQLITE_STATIC);

    int rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);
    return (rc == SQLITE_DONE);
}

bool db_find_session(const char *token, char *out_user_id) {
    if (!g_db || !token) return false;

    const char *sql = "SELECT user_id, expires_at FROM sessions WHERE token = ? LIMIT 1;";
    sqlite3_stmt *stmt;

    if (sqlite3_prepare_v2(g_db, sql, -1, &stmt, NULL) != SQLITE_OK) return false;

    sqlite3_bind_text(stmt, 1, token, -1, SQLITE_STATIC);

    bool valid = false;
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        const char *uid = (const char*)sqlite3_column_text(stmt, 0);
        const char *exp_str = (const char*)sqlite3_column_text(stmt, 1);
        long expires = atol(exp_str);
        time_t now = time(NULL);

        if (expires > now) {
            if (out_user_id && uid) {
                strcpy(out_user_id, uid);
            }
            valid = true;
        } else {
            /* Expired session -> clean up */
            db_delete_session(token);
        }
    }

    sqlite3_finalize(stmt);
    return valid;
}

bool db_delete_session(const char *token) {
    if (!g_db || !token) return false;

    const char *sql = "DELETE FROM sessions WHERE token = ?;";
    sqlite3_stmt *stmt;

    if (sqlite3_prepare_v2(g_db, sql, -1, &stmt, NULL) != SQLITE_OK) return false;
    sqlite3_bind_text(stmt, 1, token, -1, SQLITE_STATIC);

    int rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);
    return (rc == SQLITE_DONE);
}

/* --------------------------------------------------------------------------
 * User-Isolated Internship Operations
 * -------------------------------------------------------------------------- */

int db_get_user_internships(const char *user_id, InternshipRecord **out_records) {
    if (!g_db || !user_id || !out_records) return 0;

    const char *sql = "SELECT id, company_name, job_role, location, deadline, status, priority, application_date, notes, stipend, interview_rounds, prep_hours_required "
                      "FROM internships WHERE user_id = ? ORDER BY deadline ASC;";
    sqlite3_stmt *stmt;

    if (sqlite3_prepare_v2(g_db, sql, -1, &stmt, NULL) != SQLITE_OK) return 0;

    sqlite3_bind_text(stmt, 1, user_id, -1, SQLITE_STATIC);

    int capacity = 16;
    int count = 0;
    InternshipRecord *records = (InternshipRecord*)malloc(sizeof(InternshipRecord) * capacity);

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        if (count >= capacity) {
            capacity *= 2;
            records = (InternshipRecord*)realloc(records, sizeof(InternshipRecord) * capacity);
        }

        InternshipRecord *r = &records[count];
        strncpy(r->id, (const char*)sqlite3_column_text(stmt, 0), sizeof(r->id) - 1);
        strncpy(r->company_name, (const char*)sqlite3_column_text(stmt, 1), sizeof(r->company_name) - 1);
        strncpy(r->job_role, (const char*)sqlite3_column_text(stmt, 2), sizeof(r->job_role) - 1);
        strncpy(r->location, (const char*)sqlite3_column_text(stmt, 3), sizeof(r->location) - 1);
        strncpy(r->deadline, (const char*)sqlite3_column_text(stmt, 4), sizeof(r->deadline) - 1);

        const char *status_str = (const char*)sqlite3_column_text(stmt, 5);
        r->status = string_to_status(status_str ? status_str : "Applied");

        const char *prio_str = (const char*)sqlite3_column_text(stmt, 6);
        r->priority = string_to_priority(prio_str ? prio_str : "Medium");

        strncpy(r->application_date, (const char*)sqlite3_column_text(stmt, 7), sizeof(r->application_date) - 1);
        strncpy(r->notes, sqlite3_column_text(stmt, 8) ? (const char*)sqlite3_column_text(stmt, 8) : "", sizeof(r->notes) - 1);
        r->stipend = sqlite3_column_int(stmt, 9);
        r->interview_rounds = sqlite3_column_int(stmt, 10);
        r->prep_hours_required = sqlite3_column_int(stmt, 11);

        count++;
    }

    sqlite3_finalize(stmt);
    *out_records = records;
    return count;
}

bool db_find_internship_by_id(const char *user_id, const char *record_id, InternshipRecord *out_rec) {
    if (!g_db || !user_id || !record_id) return false;

    const char *sql = "SELECT id, company_name, job_role, location, deadline, status, priority, application_date, notes, stipend, interview_rounds, prep_hours_required "
                      "FROM internships WHERE user_id = ? AND id = ? LIMIT 1;";
    sqlite3_stmt *stmt;

    if (sqlite3_prepare_v2(g_db, sql, -1, &stmt, NULL) != SQLITE_OK) return false;

    sqlite3_bind_text(stmt, 1, user_id, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, record_id, -1, SQLITE_STATIC);

    bool found = false;
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        if (out_rec) {
            strncpy(out_rec->id, (const char*)sqlite3_column_text(stmt, 0), sizeof(out_rec->id) - 1);
            strncpy(out_rec->company_name, (const char*)sqlite3_column_text(stmt, 1), sizeof(out_rec->company_name) - 1);
            strncpy(out_rec->job_role, (const char*)sqlite3_column_text(stmt, 2), sizeof(out_rec->job_role) - 1);
            strncpy(out_rec->location, (const char*)sqlite3_column_text(stmt, 3), sizeof(out_rec->location) - 1);
            strncpy(out_rec->deadline, (const char*)sqlite3_column_text(stmt, 4), sizeof(out_rec->deadline) - 1);
            out_rec->status = string_to_status((const char*)sqlite3_column_text(stmt, 5));
            out_rec->priority = string_to_priority((const char*)sqlite3_column_text(stmt, 6));
            strncpy(out_rec->application_date, (const char*)sqlite3_column_text(stmt, 7), sizeof(out_rec->application_date) - 1);
            strncpy(out_rec->notes, sqlite3_column_text(stmt, 8) ? (const char*)sqlite3_column_text(stmt, 8) : "", sizeof(out_rec->notes) - 1);
            out_rec->stipend = sqlite3_column_int(stmt, 9);
            out_rec->interview_rounds = sqlite3_column_int(stmt, 10);
            out_rec->prep_hours_required = sqlite3_column_int(stmt, 11);
        }
        found = true;
    }

    sqlite3_finalize(stmt);
    return found;
}

bool db_insert_internship(const char *user_id, const InternshipRecord *record) {
    if (!g_db || !user_id || !record) return false;

    const char *sql = "INSERT INTO internships (id, user_id, company_name, job_role, location, deadline, status, priority, application_date, notes, stipend, interview_rounds, prep_hours_required, created_at) "
                      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    sqlite3_stmt *stmt;

    if (sqlite3_prepare_v2(g_db, sql, -1, &stmt, NULL) != SQLITE_OK) return false;

    time_t now = time(NULL);
    char now_str[32];
    snprintf(now_str, sizeof(now_str), "%ld", (long)now);

    sqlite3_bind_text(stmt, 1, record->id, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, user_id, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 3, record->company_name, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 4, record->job_role, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 5, record->location, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 6, record->deadline, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 7, status_to_string(record->status), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 8, priority_to_string(record->priority), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 9, record->application_date, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 10, record->notes, -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 11, record->stipend);
    sqlite3_bind_int(stmt, 12, record->interview_rounds);
    sqlite3_bind_int(stmt, 13, record->prep_hours_required);
    sqlite3_bind_text(stmt, 14, now_str, -1, SQLITE_STATIC);

    int rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);
    return (rc == SQLITE_DONE);
}

bool db_update_internship(const char *user_id, const InternshipRecord *record) {
    if (!g_db || !user_id || !record) return false;

    const char *sql = "UPDATE internships SET company_name = ?, job_role = ?, location = ?, deadline = ?, status = ?, priority = ?, application_date = ?, notes = ?, stipend = ?, interview_rounds = ?, prep_hours_required = ? "
                      "WHERE user_id = ? AND id = ?;";
    sqlite3_stmt *stmt;

    if (sqlite3_prepare_v2(g_db, sql, -1, &stmt, NULL) != SQLITE_OK) return false;

    sqlite3_bind_text(stmt, 1, record->company_name, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, record->job_role, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 3, record->location, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 4, record->deadline, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 5, status_to_string(record->status), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 6, priority_to_string(record->priority), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 7, record->application_date, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 8, record->notes, -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 9, record->stipend);
    sqlite3_bind_int(stmt, 10, record->interview_rounds);
    sqlite3_bind_int(stmt, 11, record->prep_hours_required);
    sqlite3_bind_text(stmt, 12, user_id, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 13, record->id, -1, SQLITE_STATIC);

    int rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);
    return (rc == SQLITE_DONE);
}

bool db_delete_internship(const char *user_id, const char *record_id) {
    if (!g_db || !user_id || !record_id) return false;

    const char *sql = "DELETE FROM internships WHERE user_id = ? AND id = ?;";
    sqlite3_stmt *stmt;

    if (sqlite3_prepare_v2(g_db, sql, -1, &stmt, NULL) != SQLITE_OK) return false;

    sqlite3_bind_text(stmt, 1, user_id, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, record_id, -1, SQLITE_STATIC);

    int rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);
    return (rc == SQLITE_DONE);
}
