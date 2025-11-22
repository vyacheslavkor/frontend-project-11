import onChange from 'on-change'

const view = (elements, state) => {
  const render = () => {
    renderForm()
  }

  const renderForm = () => {
    elements.urlInput.classList.remove('is-invalid')
    elements.submitButton.disabled = false

    if (state.form.processState === 'filling') {
      elements.urlInput.focus()
    }
    else if (state.form.processState === 'processing') {
      elements.submitButton.disabled = true
    }
    else if (state.form.processState === 'success') {
      elements.form.reset()
      elements.urlInput.focus()
      elements.messageContainer.textContent = 'RSS успешно загружен'
      elements.messageContainer.classList.remove('text-danger')
      elements.messageContainer.classList.add('text-success')
    }

    if (!state.form.valid) {
      elements.urlInput.classList.add('is-invalid')
    }

    if (state.form.error) {
      elements.messageContainer.textContent = state.form.error
      elements.messageContainer.classList.remove('text-success')
      elements.messageContainer.classList.add('text-danger')
    }
  }

  return onChange(state, () => {
    render()
  })
}

export default view
