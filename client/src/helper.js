import { retrieveUser } from './managers/userManager'

// URL of the hosted API
export const apiUrl = 'http://localhost:8000'

// generates options for fetch calls
export const fetchOptions = (method, body) => {
  const token = JSON.parse(localStorage.getItem('turtle_user'))?.token

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (!!token) {
    options.headers.Authorization = `Token ${token}`
  }

  if (!!body) {
    options.body = JSON.stringify(body)
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
    }
    localStorage.setItem('turtle_user', JSON.stringify(newUser))
    setLoggedInUser(newUser)
  })
}
