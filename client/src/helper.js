// URL of the hosted API
export const apiUrl = 'http://localhost:8088'

// generates options for fetch calls
export const fetchOptions = (method, body) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (!!body) {
    options.body = JSON.stringify(body)
  }

  return options
}
