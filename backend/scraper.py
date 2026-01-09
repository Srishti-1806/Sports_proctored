import requests
from bs4 import BeautifulSoup
import re

def scrape_bms_sports_ncr():
    url = "https://in.bookmyshow.com/explore/sports-national-capital-region-ncr"
    
    # mimic a real browser
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                      "AppleWebKit/537.36 (KHTML, like Gecko) "
                      "Chrome/120.0 Safari/537.36"
    }

    resp = requests.get(url, headers=headers, timeout=15)
    resp.raise_for_status()
    
    soup = BeautifulSoup(resp.text, "html.parser")
    
    # container for events — inspect the page to refine
    listings = soup.find_all("div", {"class": re.compile(r"^__event-card|event-card")})
    
    print(f"Found {len(listings)} events")
    
    events = []
    for card in listings:
        try:
            # Event title
            title_tag = card.find("h4")
            title = title_tag.text.strip() if title_tag else None
            
            # Event page link
            link_tag = card.find("a", href=True)
            link = "https://in.bookmyshow.com" + link_tag["href"] if link_tag else None
            
            # Category (sport type) if available
            cat_tag = card.find("span", {"class": re.compile(r"^__category")})
            category = cat_tag.text.strip() if cat_tag else None
            
            # Venue information
            venue_tag = card.find("span", {"class": re.compile(r"venue|location")})
            venue = venue_tag.text.strip() if venue_tag else None
            
            # Price information
            price_tag = card.find("span", {"class": re.compile(r"price")})
            price = price_tag.text.strip() if price_tag else None
            
            events.append({
                "title": title,
                "category": category,
                "venue": venue,
                "price": price,
                "link": link
            })
        except Exception as e:
            # skip if any parsing fails
            print("Error parsing one card:", e)
            continue
    
    return events

if __name__ == "__main__":
    events = scrape_bms_sports_ncr()
    for e in events:
        print(e)
