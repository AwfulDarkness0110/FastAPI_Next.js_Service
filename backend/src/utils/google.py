import requests, os

from dotenv import load_dotenv

load_dotenv()


def get_google_oauth_token(code):
    root_url = "https://oauth2.googleapis.com/token"

    options = {
        "code": code,
        "client_id": os.getenv("googleClientId"),
        "client_secret": os.getenv("googleClientSecret"),
        "redirect_uri": os.getenv("googleOauthRedirect"),
        "grant_type": "authorization_code",
    }
    try:
        response = requests.post(root_url, data=options)
        response.raise_for_status()
        data = response.json()

        return data
    except requests.exceptions.RequestException as err:
        print("Failed to fetch Google Oauth Tokens")
        raise err
