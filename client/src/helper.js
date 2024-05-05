import { retrieveUser } from './managers/userManager'

// URL of the hosted API
export const apiUrl = 'http://localhost:8000'

// generates options for fetch calls
export const fetchOptions = (method, body) => {
  const token = JSON.parse(localStorage.getItem('turtle_user'))?.token

  const options = {
    method,
  }

  if (!!token) {
    options.headers = {
      Authorization: `Token ${token}`,
    }
  }

  if (body instanceof FormData) {
    options.body = body
  } else {
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    }

    if (!!body) {
      options.body = JSON.stringify(body)
    }
  }

  return options
}

// updates the value of a key within an object stored as React state
export const updateStateObj = (setter, key, value) => {
  setter((prevState) => ({
    ...prevState,
    [key]: value,
  }))
}

// fetches a given user and stores it
export const saveUser = (data, setLoggedInUser) => {
  localStorage.setItem('turtle_user', JSON.stringify(data))
  retrieveUser(data.id).then((userData) => {
    const newUser = {
      ...userData,
      token: data.token,
      new_custard: data.new_custard,
    }
    localStorage.setItem('turtle_user', JSON.stringify(newUser))
    setLoggedInUser(newUser)
  })
}

// sets given user's first/last names and stores them
export const loadUserNames = (data, setLoggedInUser) => {
  const user = JSON.parse(localStorage.getItem('turtle_user'))
  user.first_name = data.first_name
  user.last_name = data.last_name
  localStorage.setItem('turtle_user', JSON.stringify(user))
  setLoggedInUser(user)
}

// scroll to top of page
export const scrollToTop = () => {
  window.scrollTo(0, 0)
}

// get corresponding placeholder image
export const getPlaceholder = (n, max = 3) => {
  return ((n - 1) % max) + 1
}

// formats date returned from database
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
