import requests
import pandas as pd

global bf
global lunch
global dinner

df = pd.read_csv('data_new.csv')

bf = df[df['Category'] == 'breakfast']
lunch = df[df['Category'] == 'lunch']
dinner = df[df['Category'] == 'dinner']

# print(bf.head())


def get_bmr(height, weight, age, sex):

    if(sex == 'M'): # Male
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)

    if(sex == 'F'): # Female
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)

    return bmr


def get_macros(height, weight, BMR):

    calories = 0.7 * BMR

    protein = (0.10 * calories) / 4 

    fats = (0.3 * calories) / 9

    carbs = (0.3 * calories) / 4

    return (calories, carbs, protein, fats)


def get_calories(food):

    # bdfd6b5e9ddbe62e9e147e51236bd8bd

    url = "https://nutritionix-api.p.rapidapi.com/v1_1/search/{}".format(food)

    querystring = {"fields":"item_name,item_id,brand_name,nf_calories,nf_total_fat"}

    headers = {
        'x-rapidapi-key': "e4573ac34fmshc71719554be1369p1d0fcajsnc45c98c12e74",
        'x-rapidapi-host': "nutritionix-api.p.rapidapi.com"
        }

    response = requests.request("GET", url, headers=headers, params=querystring)

    output = response.json()

    calories = []
    fat = []

    hits = output["hits"]
    calories = hits[0]["fields"]["nf_calories"]
    fat = hits[0]["fields"]["nf_total_fat"]

    nutrients = {"calories": calories,
                 "fat": fat}

    # nutrients = json.dumps(res)

    return nutrients


def check_diff(val1, val2, threshold):
    if(abs(val1 - val2) < threshold):
        return True
    else:
        return False


# bf : 0.25
# lunch : 0.375
# dinner : 0.375

def get_food(bf, bf_calories, bf_carbs, bf_protein, bf_fats):

    food_to_have = []
    quantity = []

    thres = 0.5

    bf = bf.sample(frac = 1).reset_index(drop = True)
    #print(bf)

    for index, row in bf.iterrows():
        
        for quant in range(1, row['Quantity'] + 1):

            #print(quant)

            calories = quant * int(row['Calories'])
            carb = quant * int(row['Carbs'])
            protein = quant * int(row['Protein'])
            fat = quant * int(row['Fats'])

            if(check_diff(carb, bf_carbs, thres * bf_carbs) and check_diff(protein, bf_protein, thres * bf_protein) 
                and check_diff(fat, bf_fats, thres * bf_fats) and check_diff(calories, bf_calories, thres * bf_calories)):
                quantity.append(quant)
                food_to_have.append(row)

    try:

        quant = quantity[0]
        row = food_to_have[0]
        print("You should have {} {} \n Calories: {} \n Carbs : {} \n Protein: {} \n Fats: {} \n".format(quant, row['Food'], (quant * row['Calories']), (quant * row['Carbs']), (quant * row['Protein']), (quant * row['Fats'])))

    except:
        print("Food does not exist in the database to match your requirements")
                

"""
BMR = get_bmr(180, 72, 20, 'M')

print("BMR: {}".format(BMR))
print()

calories, carbs, protein, fats = get_macros(180, 72, BMR)

print("Calories to eat: {}".format(calories))
print("Protein to eat: {}".format(protein))
print("Carbs to eat: {}".format(carbs))
print("Fats to eat: {}".format(fats))
print()

bf_calories = 0.25 * calories
bf_carbs = 0.25 * carbs
bf_protein = 0.25 * protein
bf_fats = 0.25 * fats

lunch_calories = 0.375 * calories
lunch_carbs = 0.375 * carbs
lunch_protein = 0.375 * protein
lunch_fats = 0.375 * fats

dinner_calories = 0.375 * calories
dinner_carbs = 0.375 * carbs
dinner_protein = 0.375 * protein
dinner_fats = 0.375 * fats



get_food(bf, bf_calories, bf_carbs, bf_protein, bf_fats)

get_food(lunch, lunch_calories, lunch_carbs, lunch_protein, lunch_fats)

get_food(dinner, dinner_calories, dinner_carbs, dinner_protein, dinner_fats)

"""