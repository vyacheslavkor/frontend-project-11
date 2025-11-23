import _ from 'lodash'

const parse = (document, url) => {
  const rss = document.firstElementChild
  if (!rss || rss.length === 0 || rss.nodeName !== 'rss') {
    throw new Error('error_invalid_feed')
  }

  const channel = rss.firstElementChild
  if (!channel || channel.length === 0 || channel.nodeName !== 'channel') {
    throw new Error('error_invalid_feed')
  }

  const feedElement = channel.childNodes

  const feed = {
    id: _.uniqueId('feed_'),
    url,
  }

  feedElement.forEach((element) => {
    const map = {
      title: () => {
        feed.title = element.textContent
      },
      description: () => {
        feed.description = element.textContent
      },
    }

    const nodeName = element.nodeName
    if (!_.has(map, nodeName)) {
      return
    }

    map[nodeName]()
  })

  const posts = Array.from(feedElement).filter(item => item.nodeName === 'item').map((item) => {
    const post = {
      id: _.uniqueId('post_'),
      feedId: feed.id,
    }

    item.childNodes.forEach((node) => {
      const nodeName = node.nodeName
      const map = {
        title: 'title',
        description: 'description',
        link: 'link',
      }

      if (!_.has(map, nodeName)) {
        return
      }

      const key = map[nodeName]

      post[key] = node.textContent
    })

    return post
  })

  return { feed, posts }
}

export default parse
