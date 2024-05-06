import { apiUrl, fetchOptions } from '../helper'

export const registerUser = async (user) => {
  return await fetch(`${apiUrl}/register`, fetchOptions('POST', user)).then((res) => res.json())
}

export const registerGuest = async (user) => {
  return await fetch(`${apiUrl}/register?guest=true`, fetchOptions('POST', user)).then((res) => res.json())
}

export const logInUser = async (user) => {
  return await fetch(`${apiUrl}/login`, fetchOptions('POST', user)).then((res) => res.json())
}

export const retrieveUser = async (pk) => {
  return await fetch(`${apiUrl}/users/${pk}`, fetchOptions('GET')).then((res) => res.json())
}

export const listUsers = async () => {
  return await fetch(`${apiUrl}/users`, fetchOptions('GET')).then((res) => res.json())
}

export const updateUser = async (user, pk) => {
  return await fetch(`${apiUrl}/users/${pk}`, fetchOptions('PUT', user)).then((res) => res.json())
}

export const toggleAdmin = async (pk) => {
  return await fetch(`${apiUrl}/users/${pk}?admin`, fetchOptions('PUT')).then((res) => res.json())
}
