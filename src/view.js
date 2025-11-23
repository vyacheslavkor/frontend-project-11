import onChange from 'on-change'
import _ from 'lodash'

const initCard = (container, i18nextInstance) => {
  const cardElement = document.createElement('div')
  cardElement.classList.add('card', 'border-0')

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')

  const cardBodyHeader = document.createElement('h2')
  cardBodyHeader.classList.add('card-title', 'h4')
  cardBodyHeader.textContent = i18nextInstance.t('posts')

  const list = document.createElement('ul')
  list.classList.add('list-group', 'border-0', 'rounded-0')

  cardBody.append(cardBodyHeader)
  cardElement.append(cardBody, list)
  container.append(cardElement)
}

const viewPostHandler = (e, state) => {
  const postElement = e.target
  const postId = postElement.dataset.id

  if (!_.includes(state.viewedPosts, postId)) {
    state.viewedPosts.push(postId)
  }
}

const modalHandler = (e, state) => {
  e.preventDefault()
  const postElement = e.target
  state.ui.modal.postId = postElement.dataset.id
}

const view = (elements, state, i18nextInstance) => {
  const render = () => {
    renderForm()
    renderFeeds()
    renderPosts()
    renderModal()
  }

  const watchedState = onChange(state, () => {
    render()
  })

  const renderModal = () => {
    const modalTitleElement = elements.modal.querySelector('.modal-title')
    modalTitleElement.textContent = ''

    const modalBody = elements.modal.querySelector('.modal-body')
    modalBody.textContent = ''

    const fullArticleLink = elements.modal.querySelector('.full-article')
    fullArticleLink.href = '#'

    if (state.ui.modal.postId === null) {
      return
    }

    const post = _.first(state.posts.filter(post => post.id === state.ui.modal.postId))

    fullArticleLink.href = post.link
    modalBody.textContent = post.description
    modalTitleElement.textContent = post.title
  }

  const renderFeeds = () => {
    elements.feedsContainer.innerHTML = ''
    if (state.feeds.length === 0) {
      return
    }

    initCard(elements.feedsContainer, i18nextInstance)

    const list = elements.feedsContainer.querySelector('ul')
    state.feeds.forEach((feed) => {
      const listItem = document.createElement('li')
      listItem.classList.add('list-group-item', 'border-0', 'border-end-0')

      const listItemHeader = document.createElement('h3')
      listItemHeader.classList.add('h6', 'm-0')
      listItemHeader.textContent = feed.title

      const descriptionElement = document.createElement('p')
      descriptionElement.classList.add('m-0', 'small', 'text-black-50')
      descriptionElement.textContent = feed.description

      listItem.append(listItemHeader, descriptionElement)
      list.append(listItem)
    })
  }

  const renderPosts = () => {
    elements.postsContainer.innerHTML = ''
    if (state.posts.length === 0) {
      return
    }

    initCard(elements.postsContainer, i18nextInstance)
    const list = elements.postsContainer.querySelector('ul')

    state.posts.forEach((post) => {
      const listItem = document.createElement('li')
      listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')

      const linkElement = document.createElement('a')
      linkElement.href = post.link
      console.log(state.viewedPosts)
      if (_.includes(state.viewedPosts, post.id)) {
        linkElement.classList.add('fw-normal')
      }
      else {
        linkElement.classList.add('fw-bold')
      }

      linkElement.dataset.id = post.id
      linkElement.target = '_blank'
      linkElement.rel = 'noopener noreferrer'
      linkElement.textContent = post.title

      const button = document.createElement('button')
      button.type = 'button'
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
      button.dataset.id = post.id
      button.dataset.bsToggle = 'modal'
      button.dataset.bsTarget = '#modal'
      button.textContent = i18nextInstance.t('view')

      listItem.append(linkElement, button)

      list.append(listItem)

      linkElement.addEventListener('click', e => viewPostHandler(e, watchedState))
      button.addEventListener('click', e => viewPostHandler(e, watchedState))
      button.addEventListener('click', e => modalHandler(e, watchedState))
    })
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
      elements.messageContainer.textContent = i18nextInstance.t('feed_added')
      elements.messageContainer.classList.remove('text-danger')
      elements.messageContainer.classList.add('text-success')
    }

    if (!state.form.valid) {
      elements.urlInput.classList.add('is-invalid')
    }

    if (state.form.error) {
      elements.messageContainer.textContent = i18nextInstance.t(state.form.error)
      elements.messageContainer.classList.remove('text-success')
      elements.messageContainer.classList.add('text-danger')
    }
  }

  return watchedState
}

export default view
