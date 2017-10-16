# https://www.rjionline.org/rss
import feedparser
import json

def main():
    feed = feedparser.parse('https://www.rjionline.org/rss')
    feed_list = parse(feed)

    with open('news.json', 'w') as output:
        json.dump(feed_list, output)

def parse(feed):
    feed_list = []
    for item in feed.entries:
        title = item.title.strip()
        updated = item.updated.strip()
        if(item.link):
            link = item.link.strip()
        if(item.summary):
            summary = item.summary.strip()
        if(item.tags):
            for tag in item.tags:
                tags = tag.term.strip()

        feed_item = {
            "title": title,
            "updated": updated,
            "link": link,
            "summary": summary,
            "tags": tags
        }
        feed_list.append(feed_item)
    return feed_list

if __name__ == '__main__':
    main()
