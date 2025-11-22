import './style.css'
import view from './view.js'
import i18next from 'i18next'
import ru from './locales/ru.js'
import * as validators from './validators.js'

const app = (i18nextInstance) => {
  const elements = {
    urlInput: document.getElementById('url-input'),
    form: document.body.querySelector('form'),
    submitButton: document.body.querySelector('button[type="submit"]'),
    messageContainer: document.body.querySelector('.feedback'),
  }

  const state = {
    form: {
      valid: true,
      error: null,
      processState: 'filling',
    },
    feeds: [],
  }

  const watchedState = view(elements, state, i18nextInstance)

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()
    const inputValue = elements.urlInput.value
    watchedState.form.processState = 'processing'

    validators.validateUrl(inputValue, state.feeds).then((url) => {
      watchedState.form.processState = 'success'
      watchedState.form.valid = true
      watchedState.form.error = null
      watchedState.feeds.push(url)
      elements.form.reset()
    }).catch((error) => {
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
