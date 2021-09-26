import streamlit as st
from PIL import Image
from google.cloud import vision
from google.cloud.vision_v1 import types
import os
import io
from utils import get_calories, get_bmr, get_macros, get_food


BASE_PATH = r'test_images'
st.title("Food Vision Recognition")

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'silken-champion-326214-2c1e03407b57.json'

def predict(content):

    client = vision.ImageAnnotatorClient()

    image = types.Image(content = content)

    response = client.label_detection(image = image)
    labels = response.label_annotations

    food_item = []
    for label in labels:
        food_item.append(label.description)

    remove_list = ['Food', 'Dish', 'Cuisine', 'Recipe', 'Ingredient', 'Fruit', 'Fast food', 'Natural foods', 'Produce', 'Tableware', 'Plate', 'Plant', 'Bun', 'Baked goods', 'Deep frying']

    for item in remove_list:
        try:
            food_item.remove(item)
        except:
            pass
    return food_item[0]



uploaded_file = st.file_uploader("Choose an image...", type="jpg")
if uploaded_file is not None:
    image = Image.open(uploaded_file)
    st.image(image, caption='Uploaded Image.', use_column_width=True)
    st.write("")
    with io.open(os.path.join(BASE_PATH, uploaded_file.name), 'rb') as image_file:
        content = image_file.read()
    image = Image.open(uploaded_file)
    #st.image(image, caption='Uploaded Image.', use_column_width=True)
    #st.write("")
    st.write("Classifying...")
    label = predict(content)
    st.write(label)
    nut = get_calories(label)
    st.write("Calories: ")
    st.write(nut['calories'])
    st.write("Fats: ")
    st.write(nut['fat'])

