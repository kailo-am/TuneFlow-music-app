import requests

AUDIUS_API_URL = "https://api.audius.co/v1"


def search_audius_tracks(query):
    response = requests.get(
        f"{AUDIUS_API_URL}/tracks/search",
        params={"query": query, "limit": 10},
        timeout=15,
    )
    response.raise_for_status()
    return response.json().get("data", [])