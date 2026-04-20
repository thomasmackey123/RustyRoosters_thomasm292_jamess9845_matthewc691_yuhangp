from flask import Flask, render_template, request, session, redirect, url_for, jsonify
from .data import *

app = Flask(__name__)
app.secret_key = "secret"

@app.route("/", methods=['GET', 'POST'])
def index():
    if 'username' in session:
        return redirect(url_for("dashboard"))

    return redirect(url_for("login"))

@app.route("/logout")
def logout():
    session.pop('username', None)
    return redirect(url_for("login"))

@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username').strip().lower()
        password = request.form.get('password').strip()


        if not username or not password:
            return render_template("register.html", error="No username or password inputted")

        acc = check_acc(username)
        if acc:
            return render_template("register.html", error="Username already exists")

        insert_acc(username, password)

        session['username'] = username
        return redirect(url_for("dashboard"))
    return render_template("register.html")

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # store username and password as a variable
        username = request.form.get('username').strip().lower()
        password = request.form.get('password').strip()


        if not username or not password:
            return render_template('login.html', error="No username or password inputted")


        account = check_password(username)


        if account is None:
            return render_template("login.html", error="Username or password is incorrect")


        if account[0] != password:
            return render_template("login.html", error="Username or password is incorrect")


        session["username"] = username
        return redirect(url_for("dashboard"))

    return render_template('login.html')

@app.route("/dashboard", methods=['GET', 'POST'])
def dashboard():
    # gets json request
    return render_template('dashboard.html',
                           username = session["username"])

@app.route("/profile", methods=['GET', 'POST'])
def profile():
    return render_template('profile.html')

@app.route("/visualize", methods=['GET', 'POST'])
def visualize():
    return render_template('visualize.html')

@app.route("/calculate", methods=['GET', 'POST'])
def calculate():
    search = request.args.get("searchbar")
    foods = []
    if search:
        search = search.strip().lower()
        foods = search_food(search)

    meal_items = []
    meal = get_meal(session['username'])
    if meal:
        meal_items = get_meal_items(meal['id'])
    return render_template('calculate.html',
                            foods = foods,
                            meal_items = meal_items)

@app.route("/add_food", methods=['GET', 'POST'])
def add_food():
    food_id = request.form.get("food_id")
    username = session['username']
    meal = get_meal(username)
    if meal:
        meal_id = meal['id']
    else:
        add_meal(username)
        meal = get_meal(username)
        meal_id = meal['id']
    add_meal_item(meal_id, food_id)
    return redirect('/calculate')

@app.route("/remove_food", methods=['GET', 'POST'])
def remove_food():
    food_id = request.form.get("rm_food")
    username = session['username']
    meal_id = get_meal(username)['id']
    remove_meal_item(meal_id, food_id)
    return redirect('/calculate')

@app.route("/add_quantity", methods=['GET', 'POST'])
def add_quantity():
    food_id = request.form.get("add_more")
    username = session['username']
    meal_id = get_meal(username)['id']
    add_more(meal_id, food_id, 1)
    return redirect('/calculate')

@app.route("/rm_quantity", methods=['GET', 'POST'])
def rm_quantity():
    food_id = request.form.get("add_less")
    username = session['username']
    meal_id = get_meal(username)['id']
    add_more(meal_id, food_id, -1)
    return redirect('/calculate')

@app.route("/error", methods=['GET', 'POST'])
def error():
    return render_template('error.html')

if __name__ == "__main__":
    app.debug = False
    app.run(host='0.0.0.0', port=8000)
