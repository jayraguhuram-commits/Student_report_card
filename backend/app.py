from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import time

app = Flask(__name__, static_folder='../dist', static_url_path='/')
CORS(app)  # Allow React dev server to call our API

DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")


def get_db():
    """Open a database connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Access columns by name
    return conn


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/login
#   Simulates: SELECT * FROM students WHERE student_id = ? AND password = ?
# ─────────────────────────────────────────────────────────────────────────────
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    student_id = data.get("student_id", "").strip().upper()
    password   = data.get("password", "").strip()

    if not student_id or not password:
        return jsonify({"error": "Student ID and password are required."}), 400

    conn   = get_db()
    cursor = conn.cursor()

    # SQL Query — mirrors: SELECT * FROM students WHERE student_id = ? AND password = ?
    cursor.execute(
        "SELECT student_id, full_name, class, section FROM students WHERE student_id = ? AND password = ?",
        (student_id, password)
    )
    student = cursor.fetchone()
    conn.close()

    if not student:
        return jsonify({"error": "Invalid Student ID or Password."}), 401

    # Simulate JWT-style token (student_id encoded in base64-like format)
    import base64
    token = base64.b64encode(f"{student['student_id']}:{student['full_name']}".encode()).decode()

    return jsonify({
        "message": "Login successful",
        "token": token,
        "student_id": student["student_id"],
        "full_name":  student["full_name"],
        "class":      student["class"],
        "section":    student["section"],
    }), 200


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/student/<student_id>
#   Simulates: SELECT * FROM marks WHERE student_id = ?
#   Includes time.sleep(1) to demo async loading state in React
# ─────────────────────────────────────────────────────────────────────────────
@app.route("/api/student/<student_id>", methods=["GET"])
def get_student(student_id):
    # Simulate server latency (1 second) — shows loading state in React
    time.sleep(1)

    student_id = student_id.strip().upper()

    conn   = get_db()
    cursor = conn.cursor()

    # Fetch student profile
    cursor.execute(
        "SELECT * FROM students WHERE student_id = ?",
        (student_id,)
    )
    student = cursor.fetchone()

    if not student:
        conn.close()
        return jsonify({"error": "Student not found."}), 404

    # Fetch marks
    cursor.execute(
        "SELECT subject, marks, max_marks, handwriting, content, presentation FROM marks WHERE student_id = ? ORDER BY subject",
        (student_id,)
    )
    marks_rows = cursor.fetchall()

    # Fetch remarks
    cursor.execute(
        "SELECT teacher, date, type, remark FROM remarks WHERE student_id = ? ORDER BY date DESC",
        (student_id,)
    )
    remarks_rows = cursor.fetchall()

    # Fetch activities
    cursor.execute(
        "SELECT title, date, status, type FROM activities WHERE student_id = ? ORDER BY date DESC",
        (student_id,)
    )
    activities_rows = cursor.fetchall()

    # Fetch queries
    cursor.execute(
        "SELECT teacher, query_text, date, status FROM parent_queries WHERE student_id = ? ORDER BY date DESC",
        (student_id,)
    )
    queries_rows = cursor.fetchall()

    # Fetch syllabus
    cursor.execute(
        "SELECT subject, lesson, class_coverage_pct, student_completion_pct FROM syllabus WHERE student_id = ?",
        (student_id,)
    )
    syllabus_rows = cursor.fetchall()

    conn.close()

    marks = [
        {
            "subject":      row["subject"],
            "marks":        row["marks"],
            "max_marks":    row["max_marks"],
            "handwriting":  row["handwriting"],
            "content":      row["content"],
            "presentation": row["presentation"],
            "status":       "Pass" if row["marks"] >= 40 else "Fail",
        }
        for row in marks_rows
    ]

    total_marks    = sum(m["marks"]     for m in marks)
    total_max      = sum(m["max_marks"] for m in marks)
    percentage     = round((total_marks / total_max) * 100, 2) if total_max else 0
    overall_status = "Pass" if all(m["status"] == "Pass" for m in marks) else "Fail"

    remarks = [{"teacher": r["teacher"], "date": r["date"], "type": r["type"], "remark": r["remark"]} for r in remarks_rows]
    activities = [{"title": a["title"], "date": a["date"], "status": a["status"], "type": a["type"]} for a in activities_rows]
    queries = [{"teacher": q["teacher"], "query_text": q["query_text"], "date": q["date"], "status": q["status"]} for q in queries_rows]
    syllabus = [{"subject": s["subject"], "lesson": s["lesson"], "class_coverage_pct": s["class_coverage_pct"], "student_completion_pct": s["student_completion_pct"]} for s in syllabus_rows]

    return jsonify({
        "student_id":     student["student_id"],
        "full_name":      student["full_name"],
        "class":          student["class"],
        "section":        student["section"],
        "roll_no":        student["roll_no"],
        "attendance":     student["attendance"],
        "avatar_color":   student["avatar_color"],
        "marks":          marks,
        "total_marks":    total_marks,
        "total_max":      total_max,
        "percentage":     percentage,
        "overall_status": overall_status,
        "remarks":        remarks,
        "activities":     activities,
        "queries":        queries,
        "syllabus":       syllabus,
    }), 200


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/search
#   Simulates: SELECT * FROM students WHERE full_name LIKE ?
# ─────────────────────────────────────────────────────────────────────────────
@app.route("/api/search", methods=["GET"])
def search_students():
    query = request.args.get("q", "").strip()
    if not query:
        return jsonify([])

    conn = get_db()
    cursor = conn.cursor()

    # Search query
    search_term = f"%{query}%"
    cursor.execute(
        "SELECT student_id, full_name, class, section, avatar_color FROM students WHERE full_name LIKE ?",
        (search_term,)
    )
    students = cursor.fetchall()

    results = []
    for s in students:
        s_id = s["student_id"]
        # Calculate percentage for each matched student
        cursor.execute("SELECT marks, max_marks FROM marks WHERE student_id = ?", (s_id,))
        marks_rows = cursor.fetchall()
        
        total_marks = sum(r["marks"] for r in marks_rows)
        total_max   = sum(r["max_marks"] for r in marks_rows)
        percentage  = round((total_marks / total_max) * 100, 2) if total_max else 0

        results.append({
            "student_id": s_id,
            "full_name": s["full_name"],
            "class": s["class"],
            "section": s["section"],
            "avatar_color": s["avatar_color"],
            "percentage": percentage
        })

    conn.close()
    return jsonify(results), 200


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/query
#   Save a new query from the parent
# ─────────────────────────────────────────────────────────────────────────────
@app.route("/api/query", methods=["POST"])
def submit_query():
    data = request.get_json()
    student_id = data.get("student_id", "").strip().upper()
    teacher = data.get("teacher", "").strip()
    query_text = data.get("query_text", "").strip()
    
    if not student_id or not teacher or not query_text:
        return jsonify({"error": "Missing fields"}), 400

    from datetime import datetime
    date_str = datetime.now().strftime("%Y-%m-%d")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO parent_queries (student_id, teacher, query_text, date, status) VALUES (?,?,?,?,?)",
        (student_id, teacher, query_text, date_str, "Pending")
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Query submitted successfully"}), 201

# ─────────────────────────────────────────────────────────────────────────────
# Catch-all Route: Serve React App
# ─────────────────────────────────────────────────────────────────────────────
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return app.send_static_file(path)
    else:
        return app.send_static_file('index.html')


if __name__ == "__main__":
    if not os.path.exists(DB_PATH):
        print("Database not found. Run setup_db.py first!")
    else:
        print("Flask API running at http://localhost:5000")
        app.run(debug=True, port=5000)
