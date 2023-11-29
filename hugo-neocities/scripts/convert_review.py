from argparse import ArgumentParser
import csv
import os
import re
import time
from bs4 import BeautifulSoup
from sys import argv
from dateutil import parser
from hugo_page_helpers import read_hugo_page, write_hugo_page
from scrapers.scraper import Scraper
from scrapers.letterboxd_scraper import LetterboxdScraper
from scrapers.backloggd_scraper import BackloggdScraper

import requests

def download_file(url, path, force_redownload=False):
    if not force_redownload and os.path.exists(path):
        print(f'File already exists at {path}.')
    
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
    scraper: Scraper
    
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
        
        if 'letterboxd' in review_url or 'boxd.it' in review_url:
            self.scraper = LetterboxdScraper()
        elif 'backloggd' in review_url:
            self.scraper = BackloggdScraper()
        else:
            print(f'No scraper found for URL: {review_url}.')
            exit(1)
        
        review_datas = self.scraper.handle_url(review_url)
        
        for review_data in review_datas:
            if not force_overwrite and review_data.page_name + '.md' in existing_reviews:
                print(f'{review_data.page_name}.md already exists.')
                return
            
            page_name = review_data.page_name
            
            # Downloading poster and fanart
            if not simulate and review_data.poster_url:
                download_file(review_data.poster_url, f'{root_folder}/img/{page_name}_poster.png', force_overwrite)
                review_data.poster_url = f'/thoughts/reviews/{self.scraper.review_section}/img/{page_name}_poster.png'
            else:
                review_data.poster_url = ''
            
            if not simulate and review_data.fanart_url:
                download_file(review_data.fanart_url, f'{root_folder}/img/{page_name}_fanart.png', force_overwrite)
                review_data.fanart_url = f'/thoughts/reviews/{self.scraper.review_section}/img/{page_name}_fanart.png'
            else:
                review_data.fanart_url = ''
            
            # Creating subpage
            subpage = f'{root_folder}/{page_name}.md'
            print(f'Writing updated subpage file at {subpage}.')
            
            if simulate:
                continue
            
            if keep_content:
                hugo_page = read_hugo_page(subpage)
                if hugo_page:
                    review_data.review_text = hugo_page[1]

            write_hugo_page(subpage, review_data.to_dict(), review_data.review_text)


if __name__ == "__main__":
    converter = ReviewConverter()
    converter.run(argv[1:])
