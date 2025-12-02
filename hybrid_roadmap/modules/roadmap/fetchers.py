
import requests
from ..utils.config import YOUTUBE_API_KEY

import requests
from ..utils.config import YOUTUBE_API_KEY


def fetch_youtube_links(query: str, max_results: int = 3):
    """Fetch top YouTube tutorials for any topic"""
    try:
        if not YOUTUBE_API_KEY:
            return []

        r = requests.get(
            "https://www.googleapis.com/youtube/v3/search",
            params={
                "part": "snippet",
                "maxResults": max_results,
                "q": f"{query} tutorial",
                "key": YOUTUBE_API_KEY,
                "type": "video"
            },
            timeout=10
        )

        data = r.json()

        return [
            f"https://www.youtube.com/watch?v={item['id']['videoId']}"
            for item in data.get("items", [])
        ]

    except Exception:
        return []



def fetch_github_projects(skill: str, max_results: int = 3):
    try:
        r = requests.get(
            "https://api.github.com/search/repositories",
            params={
                "q": f"{skill} project",
                "sort": "stars",
                "per_page": max_results
            },
            timeout=10
        )
        data = r.json()
        return [repo["html_url"] for repo in data.get("items", [])]
    except:
        return []



