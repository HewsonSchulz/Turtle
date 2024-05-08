import { retrieveUser } from './managers/userManager'

// URL of the hosted API
export const apiUrl = 'https://turtle-api-s9lxu.ondigitalocean.app'

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

// updates the value of a key within an object stored in local storage
export const updateLocalObj = (dataObj, setState, storageItem = 'turtle_user') => {
  const localUser = JSON.parse(localStorage.getItem(storageItem)) || {}

  for (const key in dataObj) {
    if (dataObj.hasOwnProperty(key)) {
      localUser[key] = dataObj[key]
    }
  }
  localStorage.setItem(storageItem, JSON.stringify(localUser))
  setState(localUser)
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
