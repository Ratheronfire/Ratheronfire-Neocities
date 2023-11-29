from feedgen.feed import FeedGenerator
from hugo_page_helpers import read_hugo_page

update_path = 'hugo-neocities\\data\\updates.yml'


def generate_rss_feed():
    fg = FeedGenerator()
    fg.id('https://ratheronfire.com/')
    fg.title('Ratheronfire’s Assorted Collection of Odd Projects')
    fg.author( {'name':'Ratheronfire','email':'ratheronfire@gmail.com'} )
    fg.link( href='https://ratheronfire.com/', rel='alternate' )
    fg.logo('https://ratheronfire.com/avatar.jpg')
    fg.subtitle('Welcome to one of the less bad sites on the internet!')
    fg.link( href='https://ratheronfire.com/feed.xml', rel='self' )
    fg.language('en')

    updates = read_hugo_page(update_path)
    
    for update in updates[0]:
        fe = fg.add_entry()
        fe.id(f'https://ratheronfire.com/{update["link"]}')
        fe.title(update['title'])
        fe.link(href=f'https://ratheronfire.com/{update["link"]}')
        fe.description(update['description'])
        fe.pubDate(update['date'])
    
    fg.rss_file('hugo-neocities/static/feed.xml')


if __name__ == "__main__":
    generate_rss_feed()