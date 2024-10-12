import re
from dateutil import parser
from bs4 import BeautifulSoup
from classes.review_data import ReviewData
from scrapers.scraper import get_rating_from_str, reformat_html_text, Scraper
import requests


class LetterboxdScraper(Scraper):
    need_activity_page = False
    
    def handle_url(self, url: str) -> list[ReviewData]:
        self.need_activity_page = False
        
        try:
            review_data = self.scrape_from_media_page(url)
        except AttributeError as exc:
            print(f'Error encountered scraping {url}: {str(exc)}')
            review_data = None

        if self.need_activity_page:
            review_data = self.scrape_from_letterboxd_activity_page(review_data, url + '/activity')
        
        return [review_data]
    
    def scrape_from_media_page(self, url: str) -> ReviewData:
        page = requests.get(url)
        
        review_data = ReviewData()
        review_data.tags.append('movies')
        
        if page.status_code == 404 and self.username in page.url:
            # User page does not exist, so we'll just scrape the main film page instead.
            url = page.url.replace(f'/{self.username}/film', '/film')
            page = requests.get(url)
            
            self.need_activity_page = True
        
        if not page.ok:
            print(f'Unable to get movie page {url}. Error Code {page.status_code}: {page.reason}')
            return None
        
        review_data.external_review_url = page.url
        
        self.document = BeautifulSoup(page.content, features="html.parser")
        
        page_sections = page.url.split('/')
        film_page = page_sections[-2] if page_sections[-1] == '' else page_sections[-1]
        review_data.page_name = film_page
        
        poster_url = f'https://letterboxd.com/ajax/poster/film/{film_page}/hero/300x450/'
        poster_page = requests.get(poster_url)
        poster_document = BeautifulSoup(poster_page.content, features="html.parser")
        review_data.poster_url = poster_document.find('img')['src']
        
        if not self.need_activity_page:
            rating_text = self.select_element(".rating").get_text()
            review_data.rating = get_rating_from_str(rating_text)
            
            date_str = ' '.join([a.get_text() for a in self.select_elements(".date-links a")])
            if date_str == '':
                date_str = self.select_element(".view-date.date-links").get_text()
            
            date_str = re.sub(r'(\n|\t|Watched)', '', date_str)
            
            review_data.review_date = parser.parse(date_str)
        
            try:
                review_element = self.select_element(".review div:last-child div:last-child")
                if review_element:
                    review_data.review_text = reformat_html_text(str(review_element))
            except IndexError:
                pass
        
            review_data.title = self.select_element(".film-title-wrapper a").get_text()
            review_data.release_year = self.select_element(".film-title-wrapper .metadata").get_text()
            review_data.has_spoilers = len(self.select_elements(".contains-spoilers")) > 0
        
        try:
            review_data.fanart_url = self.document.find(id="backdrop")['data-backdrop']
        except:
            pass
        
        print(f'Found review from Letterboxd: {review_data.title}, posted {str(review_data.review_date)}.')
        return review_data
    
    def scrape_from_letterboxd_activity_page(self, review_data: ReviewData, url: str) -> ReviewData:
        activity_page = requests.get(url)
        
        if not activity_page.ok:
            print(f'Unable to get activity page {url}. Error Code {activity_page.status_code}: {activity_page.reason}')
            return None
        
        self.document = BeautifulSoup(activity_page.content, features="html.parser")
        
        try:
            review_data.review_text = str(self.select_element(".review div:last-child div:last-child"))
        except IndexError:
            pass
        
        rating_elem = self.select_element(".rating")
        rating_text = rating_elem.get_text()
        review_data.rating = get_rating_from_str(rating_text)
        
        date_str = rating_elem.parent.parent.parent.find('time')['datetime']
        review_data.review_date = parser.parse(date_str)
        
        review_data.title = self.select_element('.contextual-title a').get_text()
        review_data.release_year = self.select_element(".headline-2 .metadata").get_text()
        
        print(f'Found review from Letterboxd activity page: {review_data.title}, posted {str(review_data.review_date)}.')
        return review_data
    
    def scrape_from_review_list(self, url: str) -> list[ReviewData]:
        raise NotImplemented
