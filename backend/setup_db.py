import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# ── Create Tables ──────────────────────────────────────────────────
cursor.executescript("""
DROP TABLE IF EXISTS marks;
DROP TABLE IF EXISTS remarks;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS parent_queries;
DROP TABLE IF EXISTS syllabus;
DROP TABLE IF EXISTS students;

CREATE TABLE students (
    student_id   TEXT PRIMARY KEY,
    password     TEXT NOT NULL,
    full_name    TEXT NOT NULL,
    class        TEXT NOT NULL,
    section      TEXT NOT NULL,
    roll_no      INTEGER NOT NULL,
    attendance   INTEGER NOT NULL,
    avatar_color TEXT NOT NULL
);

CREATE TABLE marks (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id   TEXT NOT NULL,
    subject      TEXT NOT NULL,
    marks        INTEGER NOT NULL,
    max_marks    INTEGER NOT NULL DEFAULT 100,
    handwriting  INTEGER NOT NULL DEFAULT 0,
    content      INTEGER NOT NULL DEFAULT 0,
    presentation INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

CREATE TABLE remarks (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    teacher    TEXT NOT NULL,
    date       TEXT NOT NULL,
    type       TEXT NOT NULL,
    remark     TEXT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

CREATE TABLE activities (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    title      TEXT NOT NULL,
    date       TEXT NOT NULL,
    status     TEXT NOT NULL,
    type       TEXT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

CREATE TABLE parent_queries (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    teacher    TEXT NOT NULL,
    query_text TEXT NOT NULL,
    date       TEXT NOT NULL,
    status     TEXT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

CREATE TABLE syllabus (
    id                     INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id             TEXT NOT NULL,
    subject                TEXT NOT NULL,
    lesson                 TEXT NOT NULL,
    class_coverage_pct     INTEGER NOT NULL,
    student_completion_pct INTEGER NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);
""")


# ── Seed Students ──────────────────────────────────────────────────
students = [
    ("STU001", "pass123",  "Aarav Sharma",   "XII", "A", 1,  92, "#6366f1"),
    ("STU002", "pass456",  "Priya Patel",    "XII", "B", 5,  88, "#ec4899"),
    ("STU003", "pass789",  "Rohan Mehta",    "XII", "A", 12, 75, "#f59e0b"),
    ("STU004", "pass000",  "Sneha Iyer",     "XII", "C", 8,  95, "#10b981"),
    ("STU005", "pass321",  "Karan Verma",    "XII", "B", 3,  60, "#ef4444"),
]

cursor.executemany(
    "INSERT INTO students VALUES (?,?,?,?,?,?,?,?)", students
)

# ── Seed Marks ─────────────────────────────────────────────────────
marks = [
    # STU001 — Aarav Sharma
    ("STU001", "Mathematics",        88, 100, 9, 70, 9),
    ("STU001", "Physics",            76, 100, 8, 60, 8),
    ("STU001", "Chemistry",          91, 100, 9, 73, 9),
    ("STU001", "Computer Science",   95, 100, 10, 75, 10),
    ("STU001", "English",            80, 100, 8, 64, 8),

    # STU002 — Priya Patel
    ("STU002", "Mathematics",        72, 100, 7, 58, 7),
    ("STU002", "Physics",            65, 100, 7, 51, 7),
    ("STU002", "Chemistry",          80, 100, 8, 64, 8),
    ("STU002", "Computer Science",   90, 100, 9, 72, 9),
    ("STU002", "English",            88, 100, 9, 70, 9),

    # STU003 — Rohan Mehta
    ("STU003", "Mathematics",        55, 100, 5, 45, 5),
    ("STU003", "Physics",            42, 100, 4, 34, 4),
    ("STU003", "Chemistry",          38, 100, 4, 30, 4),   # FAIL
    ("STU003", "Computer Science",   60, 100, 6, 48, 6),
    ("STU003", "English",            50, 100, 5, 40, 5),

    # STU004 — Sneha Iyer
    ("STU004", "Mathematics",        97, 100, 10, 77, 10),
    ("STU004", "Physics",            93, 100, 9, 75, 9),
    ("STU004", "Chemistry",          89, 100, 9, 71, 9),
    ("STU004", "Computer Science",   99, 100, 10, 79, 10),
    ("STU004", "English",            95, 100, 10, 75, 10),

    # STU005 — Karan Verma
    ("STU005", "Mathematics",        35, 100, 3, 29, 3),   # FAIL
    ("STU005", "Physics",            38, 100, 4, 30, 4),   # FAIL
    ("STU005", "Chemistry",          45, 100, 5, 35, 5),
    ("STU005", "Computer Science",   52, 100, 5, 42, 5),
    ("STU005", "English",            40, 100, 4, 32, 4),
]

cursor.executemany(
    "INSERT INTO marks (student_id, subject, marks, max_marks, handwriting, content, presentation) VALUES (?,?,?,?,?,?,?)",
    marks
)

# ── Seed Remarks ───────────────────────────────────────────────────
remarks = [
    ("STU001", "Mr. Sharma (Math)", "2026-05-10", "Positive", "Aarav has shown excellent problem-solving skills recently."),
    ("STU001", "Mrs. Gupta (English)", "2026-05-08", "Needs Improvement", "Needs to participate more in group discussions."),
    ("STU001", "Mr. Patel (Physics)", "2026-05-01", "General", "Consistent performance, keep it up."),
    ("STU002", "Mr. Sharma (Math)", "2026-05-11", "Positive", "Great improvement in calculus."),
]
cursor.executemany("INSERT INTO remarks (student_id, teacher, date, type, remark) VALUES (?,?,?,?,?)", remarks)

# ── Seed Activities ────────────────────────────────────────────────
activities = [
    ("STU001", "Physics Lab Report", "2026-05-14", "Completed", "Lab Work"),
    ("STU001", "Math Assignment 4", "2026-05-12", "Pending", "Assignment"),
    ("STU001", "Chemistry Presentation", "2026-05-09", "Completed", "Presentation"),
    ("STU001", "English Essay", "2026-05-05", "Missed", "Assignment"),
]
cursor.executemany("INSERT INTO activities (student_id, title, date, status, type) VALUES (?,?,?,?,?)", activities)

# ── Seed Parent Queries ────────────────────────────────────────────
queries = [
    ("STU001", "Mr. Sharma (Math)", "Could you provide extra practice sheets for Calculus?", "2026-05-13", "Pending"),
]
cursor.executemany("INSERT INTO parent_queries (student_id, teacher, query_text, date, status) VALUES (?,?,?,?,?)", queries)

# ── Seed Syllabus ──────────────────────────────────────────────────
syllabus = [
    ("STU001", "Mathematics", "Calculus", 100, 85),
    ("STU001", "Mathematics", "Algebra", 100, 100),
    ("STU001", "Mathematics", "Trigonometry", 50, 40),
    ("STU001", "Mathematics", "Statistics", 0, 0),
    
    ("STU001", "Physics", "Mechanics", 100, 60),
    ("STU001", "Physics", "Thermodynamics", 100, 90),
    ("STU001", "Physics", "Electromagnetism", 80, 75),
    ("STU001", "Physics", "Optics", 20, 10),
    
    ("STU001", "Chemistry", "Organic Chemistry", 100, 100),
    ("STU001", "Chemistry", "Inorganic Chemistry", 60, 50),
    
    ("STU001", "Computer Science", "Data Structures", 100, 95),
    ("STU001", "Computer Science", "Algorithms", 80, 80),
]
cursor.executemany("INSERT INTO syllabus (student_id, subject, lesson, class_coverage_pct, student_completion_pct) VALUES (?,?,?,?,?)", syllabus)

conn.commit()
conn.close()

print("✅ Database initialized successfully!")
print(f"   Location: {DB_PATH}")
print(f"   Tables  : students, marks, remarks, activities, parent_queries, syllabus")
print(f"   Students: {len(students)} records seeded")
print("\n📋 Login Credentials:")
for s in students:
    print(f"   ID: {s[0]}  |  Password: {s[1]}  |  Name: {s[2]}")

