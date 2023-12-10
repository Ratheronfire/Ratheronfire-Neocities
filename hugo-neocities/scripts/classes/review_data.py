from datetime import datetime


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


class EpisodeReviewData(ReviewData):
    season: int
    episode: int
    season_url: str

    def __init__(self):
        super.__init__()

        self.season = 1
        self.episode = 1
        self.season_url = ''

    def to_dict(self):
        base_dict = super.to_dict()

        base_dict['season'] = self.season
        base_dict['episode'] = self.episode
        base_dict['season_url'] = self.season_url

        return base_dict
