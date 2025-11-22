import './style.css'
import view from './view.js'
import * as yup from 'yup'

const app = () => {
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

  const watchedState = view(elements, state)

  const validate = (url, addedUrls) => {
    const schema = yup.string().url('Ссылка должна быть валидным URL').notOneOf(addedUrls, 'RSS уже существует')
    return schema.validate(url)
  }

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()
    const inputValue = elements.urlInput.value
    watchedState.form.processState = 'processing'

    validate(inputValue, state.feeds).then((url) => {
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

app()
