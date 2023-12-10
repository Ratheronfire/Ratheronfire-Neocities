import os
import re
import sys
import time
from argparse import ArgumentParser
from datetime import datetime

from dateutil import parser
from tmdbv3api import TMDb, Search, TV, Season

from hugo_page_helpers import read_hugo_page, write_hugo_page, download_file

tv_folder = '../content/thoughts/reviews/tv/'
base_img_url = 'http://image.tmdb.org/t/p/'
poster_img_size = 'w154'


def series_to_dict(series):
    return {
        'title': series.name,
        'date': datetime.now(),
        'draft': False
    }


def season_to_dict(season):
    return {
        'title': season.name,
        'date': datetime.now(),
        'draft': False,
        'type': 'review',
        'review_type': 'tv'
    }


def episode_to_dict(episode):
    return {
        'title': episode.name,
        'type': 'review',
        'airdate': parser.parse(episode.air_date),
        'season': episode.season_number,
        'episode': episode.episode_number,
        'season_url': '',
        'date': datetime.now(),
        'categories': ['reviews'],
        'draft': False,
        'rating': 0,
        'has_spoilers': False,
        'fanart_url': '',
        'poster_url': '',
        'tags': []
    }


class SeriesGenerator:
    parser: ArgumentParser
    tmdb: TMDb

    def __init__(self) -> None:
        self.tmdb = TMDb()
        self.tmdb.api_key = os.environ['TMDB_API_KEY']

        self.parser = ArgumentParser(prog='ReviewConverter')
        self.parser.add_argument('search_term', type=str, help='The TV series name to search for.')
        self.parser.add_argument('-s', '--simulate', action='store_true', help='Scrape review data without writing to file')
        self.parser.add_argument('-f', '--force-overwrite', action='store_true', help='Forcibly overwrite existing files')
        self.parser.add_argument('-c', '--keep-content', action='store_true', help='Don\'t overwrite existing review content')
        self.parser.add_argument('--specials', action='store_true', help='Include Specials season')

    def run(self, args):
        parsed_args = self.parser.parse_args(args)
        self.generate_series(parsed_args)

    def generate_series(self, args):
        results = Search().tv_shows(term=args.search_term)

        if len(results) == 1:
            chosen_series = results[0]
        else:
            # TODO: Handle selecting from multiple results
            chosen_series = results[0]

        series, seasons = self.extract_series_data(chosen_series.id, args.specials)

        series_url = re.sub('[^a-zA-Z0-9-]', '', series.name.lower().replace(' ', '-'))
        series_folder = os.path.join(tv_folder, series_url)

        if not args.simulate and not os.path.isdir(series_folder):
            os.makedirs(series_folder)

        print(f'Creating show folder at {series_folder}.')
        if not args.simulate:
            write_hugo_page(os.path.join(series_folder, '_index.md'), series_to_dict(series))

        poster_url = base_img_url + poster_img_size + series.poster_path
        if not args.simulate:
            download_file(poster_url, os.path.join(series_folder, 'series_poster.jpg'))

        for season in seasons:
            season_folder = os.path.join(series_folder, f'season_{season.season_number}')

            if not args.simulate and not os.path.isdir(season_folder):
                os.makedirs(season_folder)

            print(f'Creating season {season.season_number} folder at {season_folder}.')
            if not args.simulate:
                write_hugo_page(os.path.join(season_folder, '_index.md'), season_to_dict(season))

            for episode in season.episodes:
                episode_path = os.path.join(season_folder, f'episode_{episode.episode_number}.md')
                print(f'Creating season {season.season_number} episode {episode.episode_number} folder at {episode_path}.')

                if not args.simulate:
                    episode_dict = episode_to_dict(episode)
                    episode_dict['poster_url'] = f'/thoughts/reviews/tv/{series_url}/series_poster.jpg'
                    write_hugo_page(episode_path, episode_dict)

    def extract_series_data(self, series_id: int, include_specials=False):
        tv_obj = TV()
        season_obj = Season()

        seasons_details = []

        series = tv_obj.details(series_id)
        for season in series.seasons:
            if season.name != 'Specials' or include_specials:
                season_details = season_obj.details(series_id, season.season_number)
                seasons_details.append(season_details)

        return series, seasons_details


if __name__ == "__main__":
    generator = SeriesGenerator()
    generator.run(sys.argv[1:])
