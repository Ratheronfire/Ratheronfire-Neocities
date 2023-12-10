import re
from dateutil import parser
from bs4 import BeautifulSoup

import requests

from classes.review_data import ReviewData
from scrapers.scraper import Scraper


class BackloggdScraper(Scraper):
    # TODO: Handle pagination
    review_section = 'games'
    
    def handle_url(self, url: str) -> list[ReviewData]:
        url_sections = url.split('/')
        
        review_datas = []
        
        if 'u' in url_sections:
            print('Found user page; converting URL to grab games with ratings.')
            url = re.sub(r'games\/(([\w-])+\/)?(type:\w+)?', 'games/user-rating/type:played', url)
            review_datas = self.scrape_from_review_list(url)
        
        review_datas = self.scrape_written_reviews(review_datas)
        
        return review_datas
    
    def scrape_from_media_page(self, url: str) -> ReviewData:
        page = requests.get(url)
        
        review_data = ReviewData()
        
        if not page.ok:
            print(f'Unable to get game page {url}. Error Code {page.status_code}: {page.reason}')
            return None
        
        review_data.external_review_url = page.url
        
        self.document = BeautifulSoup(page.content, features="html.parser")
        
        page_sections = page.url.split('/')
        game_page = page_sections[-2] if page_sections[-1] == '' else page_sections[-1]
        review_data.page_name = game_page
        
        review_data.title = self.select_element('#title h1').get_text()
        review_data.release_year = int(self.select_element('.sub-title a').get_text().split(' ')[-1])
        
        review_data.fanart_url = f'https:{self.select_element("#artwork-high-res")["src"]}'
        review_data.poster_url = self.select_element('.card-img ')['src']
        
        print(f'Found game from Backloggd: {review_data.title}, posted {str(review_data.review_date)}.')
        return review_data
    
    def scrape_from_review_list(self, url: str) -> list[ReviewData]:
        page = requests.get(url)
        
        review_datas = []
        
        if not page.ok:
            print(f'Unable to get game list {url}. Error Code {page.status_code}: {page.reason}')
            return []
        
        list_document = BeautifulSoup(page.content, features="html.parser")
        
        games = list_document.css.select('#game-lists > div')
        
        for game in games:
            star_rating = game.css.select('.stars-top')
            
            if not len(star_rating):
                continue
            
            game_url = f'https://backloggd.com{game.css.select("a")[0]["href"]}'
            
            review_data = self.scrape_from_media_page(game_url)
            
            rating_txt = star_rating[0]['style'].replace('width:', '').replace('%', '')
            review_data.rating = int(rating_txt) / 20
            
            review_datas.append(review_data)
        
        return review_datas
    
    def scrape_written_reviews(self, review_datas: list[ReviewData]):
        review_url = f'https://backloggd.com/u/{self.username}/reviews/'
        
        review_page = requests.get(review_url)
        
        if not review_page.ok:
            print(f'Unable to get review list {review_url}. Error Code {review_page.status_code}: {review_page.reason}')
            return review_datas
        
        reviews_document = BeautifulSoup(review_page.content, features="html.parser")
        
        reviews_container = list(reviews_document.css.select_one('.user-reviews>.col').children)
        
        for i in range(0, len(reviews_container) - 3, 4):
            page_url = reviews_container[i+1].css.select('a')[0]['href']
            game_name = page_url.split('/')[-2]
            
            if all([r.page_name != game_name for r in review_datas]):
                print(f'No entry found for {game_name}, scraping from game page.')
                review_data = self.scrape_from_media_page(f'https://backloggd.com{page_url}')
                review_datas.append(review_data)
            else:
                review_data = [r for r in review_datas if r.page_name == game_name][0]
            
            review_link = reviews_container[i+3].css.select_one('.small-link')['href']
            review_page = requests.get(f'https://backloggd.com{review_link}')
            review_document = BeautifulSoup(review_page.content, features="html.parser")
            
            review_data.review_text = review_document.css.select_one('.card-text').get_text()
            review_data.review_text = review_data.review_text.replace('\n', '\n\n')
            
            review_date_str = review_document.css.select_one('.col-auto p.subtitle-text').get_text()
            review_data.review_date = parser.parse(review_date_str.replace('Reviewed on ', ''))
            
            review_data.has_spoilers = len(review_document.css.select('.spoiler-warning')) > 0
        
        return review_datas
