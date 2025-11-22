import * as yup from 'yup'

export const validateUrl = (url, addedFeeds) => {
  const schema = yup.string().url('error_invalid_url').notOneOf(addedFeeds, 'error_url_already_exists')
  return schema.validate(url)
}
