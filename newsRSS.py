import feedparser
from flask import Flask, jsonify
import random

app = Flask(__name__)

def get_News():
    rss_url = 'https://feeds.bbci.co.uk/news/technology/rss.xml'
    feed = feedparser.parse(rss_url)

    if not feed.entries:
        return jsonify({'error': 'No news found'}),

    news_item = random.choice(feed.entries)
    
    response = {
        'title': news_item.title,
        'link': news_item.link,
        'description': news_item.description
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
