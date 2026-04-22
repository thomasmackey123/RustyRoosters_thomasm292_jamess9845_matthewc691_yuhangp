# RustyRoosters

# Roster
Thomas Mackey (PM), James Sun, Matthew Ciu, Yuhang Pan

# Description
Fitness Genie is a meal calorie calculator. Users can sign up/login, track a meal’s calories through a db of known food calories from a dataset, save them to their account, and view them later on a personal profile page. Users can look through charts and graphs to view how their meals compare to a large sample of data.
#### Visit our live site at [Fitness Genie](http://104.236.38.28:8000)

# Install Guide
0. Download the datasets and move them into the app/static/dataset directory
[user-daily-nutritional-intake](https://www.kaggle.com/datasets/abdussamad123/user-daily-nutritional-intake)
[food-nutrition-dataset](https://www.kaggle.com/datasets/utsavdey1410/food-nutrition-dataset/data)
1. Clone the repository
```
git clone git@github.com:thomasmackey123/RustyRoosters_thomasm292_jamess9845_matthewc691_yuhangp.git FitnessGenie
```
2. Navigate into the cloned directory
```
cd FitnessGenie
```
3. Create virtual environment
```
python -m venv venv
```
4. Activate virtual environment (macOS/Linux)
```
. venv/bin/activate
```
5. Install packages
```
pip install -r requirements.txt
```
6. Create database
```
python app/data.py
```
7. Launch app
```
python -m app.__init__
```
8. In a browser, open the running app on
```
http://127.0.0.1:8000
```
