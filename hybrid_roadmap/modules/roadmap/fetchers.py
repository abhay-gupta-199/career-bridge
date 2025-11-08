import requests
from ..utils.config import YOUTUBE_API_KEY

def fetch_youtube_links(skill: str, max_results: int = 3) -> list[str]:
    if not YOUTUBE_API_KEY:
        return []  # skip if no key
    try:
        r = requests.get(
            "https://www.googleapis.com/youtube/v3/search",
            params={
                "part": "snippet",
                "maxResults": max_results,
                "q": f"{skill} tutorial",
                "key": YOUTUBE_API_KEY,
                "type": "video"
            },
            timeout=10
        )
        data = r.json()
        return [f"https://www.youtube.com/watch?v={it['id']['videoId']}" for it in data.get("items", [])]
    except Exception:
        return []

def fetch_github_projects(skill: str, max_results: int = 3) -> list[str]:
    try:
        r = requests.get(
            "https://api.github.com/search/repositories",
            params={"q": f"{skill} projects", "sort": "stars", "per_page": max_results},
            timeout=10
        )
        data = r.json()
        return [repo["html_url"] for repo in data.get("items", [])]
    except Exception:
        return []
