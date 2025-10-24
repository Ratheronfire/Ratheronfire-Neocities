from abc import ABC
import re

from bs4 import BeautifulSoup
from classes.review_data import ReviewData


def reformat_html_text(text: str):
    text = re.sub(r'<br ?/>', '\n', text)
    text = re.sub(r'</p>', '\n\n', text)
    text = re.sub(r'(<div ?[^>]*>|</div>|<p>)', '', text)
    
    return text


def get_rating_from_str(text):
    return len([star for star in text if star == '★']) + (0.5 if '½' in text else 0)


class Scraper(ABC):
    document: BeautifulSoup
    
    username = 'ratheronfire'
    review_section = 'movies'
    
    def __init__(self):
         self.review_data = ReviewData()
    
    def select_elements(self, selector: str):
        return self.document.css.select(selector)
    
    def select_element(self, selector: str):
        elements = self.select_elements(selector)
        return elements[0] if len(elements) else None

    def handle_url(self, url: str) -> list[ReviewData]:
        pass
    
    def scrape_from_media_page(self, url: str) -> ReviewData:
        pass
    
    def scrape_from_review_list(self, url: str) -> list[ReviewData]:
        pass
