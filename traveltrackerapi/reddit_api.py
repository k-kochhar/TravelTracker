import requests, os
import spacy
from collections import OrderedDict
from opencage.geocoder import OpenCageGeocode
from dotenv import load_dotenv

load_dotenv()
nlp = spacy.load("en_core_web_sm")
geocoder = OpenCageGeocode(os.getenv("OPENCAGE_API_KEY"))
cache = OrderedDict()

def extract_location(text):
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == 'GPE':
            return ent.text
    return None

def geocode_location(location_name):
    if location_name in cache:
        print(f"Cache hit for: {location_name}")
        return cache[location_name]

    try:
        result = geocoder.geocode(location_name, limit=1)
        if result:
            coordinates = {
                'latitude': result[0]['geometry']['lat'],
                'longitude': result[0]['geometry']['lng']
            }

            cache[location_name] = coordinates
            if len(cache) > 20:
                cache.popitem(last=False)

            return coordinates
    except Exception as e:
        print(f"Error geocoding {location_name}: {e}")

    return None


def fetch_reddit_posts(limit):
    url = f"https://www.reddit.com/r/travel/new.json?limit={limit}"

    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        posts_data = response.json()['data']['children']

        posts = []
        for post in posts_data:
            post_content = post['data'].get('selftext', '')
            post_title = post['data'].get('title', '')

            location = extract_location(post_title + ' ' + post_content)

            if location is None:
                continue

            geocoded_location = geocode_location(location)

            if geocoded_location is None:
                continue

            print(location, geocoded_location)

            posts.append({
                'title': post_title,
                'content': post_content,
                'location': location,
                'coordinates': geocoded_location
            })

        return posts

    except requests.exceptions.RequestException as e:
        print(f"Error fetching Reddit posts: {e}")
        return []


if __name__ == '__main__':
    fetch_reddit_posts(20)