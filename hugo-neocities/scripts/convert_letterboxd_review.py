from argparse import ArgumentParser
import csv
import os
import re
import time
from bs4 import BeautifulSoup
from sys import argv
from dateutil import parser
from yaml import dump, load
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper

import requests

letterboxd_username = 'ratheronfire'


def reformat_html_text(text: str):
    text = re.sub(r'<br ?/>', '\n', text)
    text = re.sub(r'</p>', '\n\n', text)
    text = re.sub(r'(<div>|</div>|<p>)', '', text)
    
    return text


def get_rating_from_str(text):
    return len([star for star in text if star == '★']) + (0.5 if '½' in text else 0)


def convert_letterboxd_review(url: str):
    using_activity_page = False
    
    review_data = {
        'type': 'review',
        'title': '',
        'year': '',
        'date': None,
        'categories': ['reviews'],
        'draft': False,
        'rating': 0,
        'review_text': '',
        'has_spoilers': False,
        'fanart_url': '',
        'poster_url': '',
        'external_review_url': url,
        'page_name': ''
    }
    
    page = requests.get(url)
    if letterboxd_username not in page.url:
        # We hit the global page for this movie, so we'll need to re-add the username and try again.
        user_url = page.url.replace('/film', f'/{letterboxd_username}/film')
        page = requests.get(user_url)
    
    if not page.ok:
        # Last-ditch effort, we can get the rating and date from /activity and the rest from the main page.
        using_activity_page = True
        
        activity_url = page.url + '/activity'
        activity_page = requests.get(activity_url)
        
        activity_document = BeautifulSoup(activity_page.content, features="html.parser")
        
        rating_elem = activity_document.css.select(".rating")
        rating_text = rating_elem[0].get_text()
        review_data['rating'] = get_rating_from_str(rating_text)
        
        date_str = rating_elem[0].parent.parent.parent.find('time')['datetime']
        review_data['date'] = parser.parse(date_str)
        
        review_data['title'] = activity_document.css.select('.contextual-title a')[0].get_text()
        review_data['year'] = activity_document.css.select(".headline-2 .metadata")[0].get_text()
        
        
        url = url.replace(letterboxd_username + '/', '')
        page = requests.get(url)
    
    if not page.ok:
        print(f'Unable to get {url}. Error Code {page.status_code}: {page.reason}')
        return None
    
    document = BeautifulSoup(page.content, features="html.parser")
    
    page_sections = page.url.split('/')
    film_page = page_sections[-2] if page_sections[-1] == '' else page_sections[-1]
    review_data['page_name'] = film_page
    
    poster_url = f'https://letterboxd.com/ajax/poster/film/{film_page}/hero/300x450/'    
    poster_page = requests.get(poster_url)
    poster_document = BeautifulSoup(poster_page.content, features="html.parser")
    review_data['poster_url'] = poster_document.find('img')['src']
    
    if not using_activity_page:
        rating_text = document.css.select(".rating")[0].get_text()
        review_data['rating'] = get_rating_from_str(rating_text)
        
        date_str = ' '.join([a.get_text() for a in document.css.select(".date-links a")])
        date_str = document.css.select('.date-links')[0].get_text().replace('\n', '').replace('\t', '')
        review_data['date'] = parser.parse(date_str)
        
        review_data['title'] = document.css.select(".film-title-wrapper a")[0].get_text()
        review_data['year'] = document.css.select(".film-title-wrapper .metadata")[0].get_text()
        review_data['review_text'] = reformat_html_text(review_data['review_text'])
        review_data['has_spoilers'] = len(document.css.select(".contains-spoilers")) > 0
    
    try:
        review_data['review_text'] = str(document.css.select(".review div:last-child div:last-child")[0])    
    except IndexError:
        pass
    
    try:
        review_data['fanart_url'] = document.find(id="backdrop")['data-backdrop']
    except:
        pass
    
    print(f'Found review from Letterboxd: {review_data["title"]}, posted {str(review_data["date"])}.')
    
    return review_data


def load_hugo_page(review_path):
    try:
        with open(review_path, 'r') as review_file:
            file_str = review_file.read()
            yaml_str = file_str.split('---')[1]
            contents = file_str.split('---')[2]
            
            contents = contents.split('\n')
            contents = '\n'.join([line for line in contents if line != ''])
            
            yaml_obj = load(yaml_str, Loader=Loader)
        
        return yaml_obj, contents
    except FileNotFoundError:
        return None


def download_file(url, path):
    print(f'Downloading {url} to {path}.')
    file = requests.get(url)
    with open(path, 'wb') as out_file:
        out_file.write(file.content)

def get_review_pages(root_folder):
    return [entry for entry in os.listdir(os.path.join(os.getcwd(), root_folder)) \
        if os.path.isfile(os.path.join(os.getcwd(), root_folder, entry)) \
            and entry != '_index.md']


class ReviewConverter:
    parser: ArgumentParser
    
    def __init__(self) -> None:
        # create the top-level parser
        self.parser = ArgumentParser(prog='ReviewConverter')
        subparsers = self.parser.add_subparsers(title='subcommands', description='valid subcommands', help='additional help')
        self.parser.add_argument('-s', '--simulate', action='store_true', help='Scrape review data without writing to file')
        self.parser.add_argument('-f', '--force-overwrite', action='store_true', help='Forcibly overwrite existing files')
        self.parser.add_argument('-c', '--keep-content', action='store_true', help='Don\'t overwrite existing review content')

        # create the parser for the "a" command
        parser_url = subparsers.add_parser('from_url', help='Scrape a review from its url (Letterboxd, more later).')
        parser_url.add_argument('review_url', type=str, help='The review URL')
        parser_url.add_argument('list_path', type=str, help='The path to the list file this review will be placed under.')
        parser_url.add_argument('-s', '--simulate', action='store_true', help='Scrape review data without writing to file')
        parser_url.add_argument('-f', '--force-overwrite', action='store_true', help='Forcibly overwrite existing files')
        parser_url.add_argument('-c', '--keep-content', action='store_true', help='Don\'t overwrite existing review content')
        parser_url.set_defaults(func=self.convert_from_url)

        # create the parser for the "b" command
        parser_csv = subparsers.add_parser('from_csv', help='Scrape multiple reviews from a CSV file.')
        parser_csv.add_argument('csv_path', type=str, help='The path to the CSV file.')
        parser_csv.add_argument('column', type=str, help='The column name/number to grab URLs from.')
        parser_csv.add_argument('list_path', type=str, help='The path to the list file this review will be placed under.')
        parser_csv.add_argument('-s', '--simulate', action='store_true', help='Scrape review data without writing to file')
        parser_csv.add_argument('-f', '--force-overwrite', action='store_true', help='Forcibly overwrite existing files')
        parser_csv.add_argument('-c', '--keep-content', action='store_true', help='Don\'t overwrite existing review content')
        parser_csv.set_defaults(func=self.convert_from_csv)
    
    def run(self, args):
        parsed_args = self.parser.parse_args(args)
        parsed_args.func(parsed_args)
    
    def convert_from_url(self, args):
        self.convert_review(args.review_url, args.list_path, args.simulate, args.force_overwrite, args.keep_content)
    
    def convert_from_csv(self, args):
        root_folder = os.path.split(args.list_path)[0]
        existing_reviews = get_review_pages(root_folder)
        
        found_header = args.column.isnumeric()
        
        with open(args.csv_path, 'r', newline='') as csv_file:
            reader = csv.reader(csv_file, delimiter=',', quotechar='|')
            
            for row in reader:
                if not found_header:
                    args.column = row.index(args.column)
                    found_header = True
                    continue
                
                # TODO: This only makes sense for Letterboxd
                review_title = re.sub(r'[^ \w\d]', '', row[1]).replace(' ', '-').lower()
                
                if not args.force_overwrite and review_title + '.md' in existing_reviews:
                    print(f'{review_title}.md already exists.')
                    continue
                
                self.convert_review(row[args.column], args.list_path, args.simulate, args.force_overwrite, args.keep_content)
                time.sleep(3)
    
    def convert_review(self, review_url: str, list_path: str, simulate: bool, force_overwrite: bool, keep_content: bool):
        root_folder = os.path.split(list_path)[0]
        
        existing_reviews = get_review_pages(root_folder)
        
        # Scraping the review data from Letterboxd
        if not os.path.isdir(f'{root_folder}/img'):
            os.mkdir(f'{root_folder}/img')
        
        review_data = convert_letterboxd_review(review_url)
        
        if review_data is None:
            return
        
        if not force_overwrite and review_data['page_name'] + '.md' in existing_reviews:
            print(f'{review_data["page_name"]}.md already exists.')
            return
        
        page_name = review_data['page_name']
        
        # Downloading poster and fanart
        if not simulate and review_data['poster_url']:
            download_file(review_data['poster_url'], f'{root_folder}/img/{page_name}_poster.png')
            review_data['poster_url'] = f'/thoughts/reviews/movies/img/{page_name}_poster.png'
        else:
            review_data['poster_url'] = ''
        
        if not simulate and review_data['fanart_url']:
            download_file(review_data['fanart_url'], f'{root_folder}/img/{page_name}_fanart.png')
            review_data['fanart_url'] = f'/thoughts/reviews/movies/img/{page_name}_fanart.png'
        else:
            review_data['fanart_url'] = ''
        
        # Creating subpage
        subpage = f'{root_folder}/{page_name}.md'
        print(f'Writing updated subpage file at {subpage}.')
        
        if simulate:
            return
        
        if keep_content:
            hugo_page = load_hugo_page(subpage)
            if hugo_page:
                review_data['review_text'] = hugo_page[1]

        with open(subpage, 'w') as yaml_file:
            review_text = review_data['review_text']
            del review_data['review_text']
            
            yaml_file.write('---\n')
            yaml_file.write(dump(review_data, sort_keys=False))
            yaml_file.write('---\n\n')
            yaml_file.write(review_text)


if __name__ == "__main__":
    converter = ReviewConverter()
    converter.run(argv[1:])
