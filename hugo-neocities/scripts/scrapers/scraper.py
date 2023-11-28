from abc import ABC
from datetime import datetime
import re
from typing import Union

from bs4 import BeautifulSoup


def reformat_html_text(text: str):
    text = re.sub(r'<br ?/>', '\n', text)
    text = re.sub(r'</p>', '\n\n', text)
    text = re.sub(r'(<div>|</div>|<p>)', '', text)
    
    return text


def get_rating_from_str(text):
    return len([star for star in text if star == '★']) + (0.5 if '½' in text else 0)


class ReviewData:
        title: str
        release_year: int
        
        review_date: datetime
        rating: int
        review_text: str
        has_spoilers: bool
        
        fanart_url: str
        poster_url: str
        external_review_url: str
        
        page_name: str
        
        def __init__(self) -> None:
            self.title = ''
            self.release_year = -1
            
            self.review_date = datetime.now()
            self.rating = 0
            self.review_text = ''
            self.has_spoilers = False
            
            self.fanart_url = ''
            self.poster_url = ''
            self.external_review_url = ''
            
            self.page_name = ''
        
        def to_dict(self):
            return {
                'type': 'review',
                'title': self.title,
                'year': self.release_year,
                'date': self.review_date,
                'categories': ['reviews'],
                'draft': False,
                'rating': self.rating,
                'has_spoilers': self.has_spoilers,
                'fanart_url': self.fanart_url,
                'poster_url': self.poster_url,
                'external_review_url': self.external_review_url,
                'page_name': self.page_name
            }


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
