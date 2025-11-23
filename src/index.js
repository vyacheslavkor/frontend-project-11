import './style.css'
import view from './view.js'
import i18next from 'i18next'
import ru from './locales/ru.js'
import * as validators from './validators.js'
import axios from 'axios'
import parse from './parsers.js'

const app = (i18nextInstance) => {
  const elements = {
    urlInput: document.getElementById('url-input'),
    form: document.body.querySelector('form'),
    submitButton: document.body.querySelector('button[type="submit"]'),
    messageContainer: document.body.querySelector('.feedback'),
    postsContainer: document.body.querySelector('.posts'),
    feedsContainer: document.body.querySelector('.feeds'),
  }

  const state = {
    form: {
      valid: true,
      error: null,
      processState: 'filling',
    },
    feeds: [],
    posts: [],
  }

  const watchedState = view(elements, state, i18nextInstance)

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()
    const url = elements.urlInput.value
    watchedState.form.processState = 'processing'

    validators.validateUrl(url, state.feeds).then((url) => {
      return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    }).then((response) => {
      const domParser = new DOMParser()
      const { feed, posts } = parse(domParser.parseFromString(response.data.contents, 'text/xml'), url)
      watchedState.feeds.push(feed)
      watchedState.posts = [...watchedState.posts, ...posts]

      watchedState.form.processState = 'success'
      watchedState.form.valid = true
      watchedState.form.error = null
      elements.form.reset()
    })
      .catch((error) => {
        watchedState.form.valid = false
        watchedState.form.error = error.message
        watchedState.form.processState = 'filling'
      })
  })
}

const i18nextInstance = i18next.createInstance()
i18nextInstance.init({
  lng: 'ru',
  resources: {
    ru,
  },
}).then(() => {
  app(i18nextInstance)
})
