import sqlite3
import os
import csv

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

    c.execute("CREATE TABLE IF NOT EXISTS foods (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE COLLATE NOCASE, calories FLOAT, protein FLOAT, carbs FLOAT, fat FLOAT)")
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

def import_dataset(file):
    conn = get_db_connection()
    with open(file) as f:
        reader = csv.DictReader(f)
        rows = []
        for row in reader:
            rows.append((
                row["food"],
                float(row["Caloric Value"]),
                float(row["Protein"]),
                float(row["Carbohydrates"]),
                float(row["Fat"])
            ))
        conn.executemany("INSERT OR IGNORE INTO foods (name, calories, protein, carbs, fat) VALUES (?, ?, ?, ?, ?)", rows)
        conn.commit()
        conn.close()

csv_path1 = os.path.join(ABS_PATH, "static", "dataset", "FOOD-DATA-GROUP1.csv")
csv_path2 = os.path.join(ABS_PATH, "static", "dataset", "FOOD-DATA-GROUP2.csv")
csv_path3 = os.path.join(ABS_PATH, "static", "dataset", "FOOD-DATA-GROUP3.csv")
csv_path4 = os.path.join(ABS_PATH, "static", "dataset", "FOOD-DATA-GROUP4.csv")
csv_path5 = os.path.join(ABS_PATH, "static", "dataset", "FOOD-DATA-GROUP5.csv")

import_dataset(csv_path1)
import_dataset(csv_path2)
import_dataset(csv_path3)
import_dataset(csv_path4)
import_dataset(csv_path5)

def get_avg_nutrients():
    path = os.path.join(ABS_PATH, "static", "dataset", "user_nutritional_data.csv")
    total_protein = total_carbs = total_fat = cnt = 0
    with open(path) as f:
        reader = csv.DictReader(f)
        for row in reader:
            total_protein += float(row["Proteins"])
            total_carbs += float(row["Carbs"])
            total_fat += float(row["Fats"])
            cnt += 1
    return {
        "protein": total_protein/cnt,
        "carbs": total_carbs/cnt,
        "fat": total_fat/cnt
    }

def search_food(food):
    conn = get_db_connection()
    result = conn.execute("SELECT * FROM foods WHERE LOWER(name) LIKE ?", ("%" + food + "%",)).fetchall()
    conn.close()
    return result

def add_meal(username):
    conn = get_db_connection()
    conn.execute("INSERT INTO meals (username) VALUES (?)", (username,))
    conn.commit()
    conn.close()

def get_meal(username):
    conn = get_db_connection()
    meal = conn.execute("SELECT id FROM meals WHERE username = ? ORDER BY id DESC LIMIT 1", (username,)).fetchone()
    conn.close()
    return meal

def add_meal_item(meal_id, food_id):
    conn = get_db_connection()
    conn.execute("INSERT INTO meal_items (meal_id, food_id, quantity) VALUES (?, ?, ?)", (meal_id, food_id, 1,))
    conn.commit()
    conn.close()

def get_meal_items(meal_id):
    conn = get_db_connection()
    meal_items = conn.execute("""
                            SELECT meal_items.id, foods.name, foods.calories, foods.protein, foods.carbs, foods.fat, meal_items.quantity
                            FROM meal_items
                            JOIN foods ON foods.id = meal_items.food_id
                            WHERE meal_items.meal_id = ?
                            """, (meal_id,)).fetchall()
    conn.close()
    return meal_items

def remove_meal_item(item_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM meal_items WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()

def update_quantity(item_id, q):
    conn = get_db_connection()
    quantity = conn.execute("SELECT quantity FROM meal_items WHERE id = ?", (item_id,)).fetchone()[0]
    new_quantity = max(1, quantity + q)
    conn.execute("UPDATE meal_items SET quantity = ? WHERE id = ?", (new_quantity, item_id,))
    conn.commit()
    conn.close()
