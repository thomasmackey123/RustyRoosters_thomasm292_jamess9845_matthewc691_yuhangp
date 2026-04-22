# RustyRoosters

# Roster
Thomas Mackey (PM), James Sun, Matthew Ciu, Yuhang Pan

# Description
Fitness Genie is a meal calorie calculator. Users can sign up/login, track a meal’s calories through a db of known food calories from a dataset, save them to their account, and view them later on a personal profile page. Users can look through charts and graphs to view how their meals compare to a large sample of data.
#### Visit our live site at [Fitness Genie](http://104.236.38.28:8000)

# Install Guide
0. Download the datasets and move them into the `app/static/dataset` directory after you clone
- [User Daily Nutritional Intake Dataset](https://www.kaggle.com/datasets/abdussamad123/user-daily-nutritional-intake)  
- [Food Nutrition Dataset](https://www.kaggle.com/datasets/utsavdey1410/food-nutrition-dataset)
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

### FEATURE SPOTLIGHT
* On the Calculate page, search for any food and instantly add it to your meal. It will appear in your daily intake and be bar graph will be updated accordingly.
* The Dashboard shows your current total calorie intake along with a quick note on your calorie range, whether it's too high/low or just right.
* On the Visualize page, compare your protein, carbs, and fat intake against:
- your own data
- averages from a 2000-person dataset
- recommended values based on your calories
* Try hovering over the graphs to see exact values!

### KNOWN BUGS/ISSUES
* We should have all know bugs fixed, but there are improvements that we cant make:
- Since we only used js for the visualizations, not everything is updated dynamically. For example, if you add food/change quantity on the calculate page, it refreshes the entire page.
- The recommended values come from a fixed table and does not vary based on other factors like gender, weight, etc. Would be nice if we found a dataset for that.