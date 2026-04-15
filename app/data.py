import sqlite3
import os

ABS_PATH = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(ABS_PATH, "data.db")

# conncects to db
def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

# creates all the tables
def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    # create tables if it isn't there already
    c.execute("CREATE TABLE IF NOT EXISTS users (name TEXT NOT NULL COLLATE NOCASE, password TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE(name))")

    c.execute("PRAGMA table_info(users)")
    columns = [column[1] for column in c.fetchall()]
    if 'created_at' not in columns:
        c.execute("ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP")

    c.execute("CREATE TABLE IF NOT EXISTS foods (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL COLLATE NOCASE, calories FLOAT, protein FLOAT, carbs FLOAT, fat FLOAT)")
    c.execute("CREATE TABLE IF NOT EXISTS meals (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL COLLATE NOCASE, FOREIGN KEY (username) REFERENCES users(name) ON DELETE CASCADE)")
    c.execute("CREATE TABLE IF NOT EXISTS meal_items (id INTEGER PRIMARY KEY AUTOINCREMENT, meal_id INTEGER NOT NULL, food_id INTEGER NOT NULL, quantity REAL DEFAULT 1, FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE, FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE)")
    
    conn.commit()
    conn.close()

init_db()

# get user for auth
def check_acc(username):
    conn = get_db_connection()
    user = conn.execute("SELECT 1 FROM users WHERE name = ?", (username,)).fetchone()
    conn.close()
    return user

# get passwrod for auth
def check_password(username):
    conn = get_db_connection()
    user = conn.execute("SELECT password FROM users WHERE name = ?", (username,)).fetchone()
    conn.close()
    return user

# add signed in acc to db
def insert_acc(username, password):
    conn = get_db_connection()
    conn.execute("INSERT INTO users (name, password, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)", (username, password))
    conn.commit()
    conn.close()

def get_user_info(username):
    conn = get_db_connection()
    user = conn.execute("SELECT name, created_at FROM users WHERE name = ?", (username,)).fetchone()
    conn.close()
    return user
