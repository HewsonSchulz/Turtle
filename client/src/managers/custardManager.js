import { apiUrl, fetchOptions } from '../helper'

export const retrieveFlavor = async (pk) => {
  return await fetch(`${apiUrl}/custards/${pk}`, fetchOptions('GET')).then((res) => res.json())
}

export const listFlavors = async () => {
  return await fetch(`${apiUrl}/custards`, fetchOptions('GET')).then((res) => res.json())
}

export const createFlavor = async (flavor) => {
  return await fetch(`${apiUrl}/custards`, fetchOptions('POST', flavor)).then((res) => res.json())
}

export const updateFlavor = async (flavor, pk) => {
  return await fetch(`${apiUrl}/custards/${pk}`, fetchOptions('PUT', flavor)).then((res) => res.json())
}

export const listToppings = async () => {
  return await fetch(`${apiUrl}/toppings`, fetchOptions('GET')).then((res) => res.json())
}

export const listCustardBases = async () => {
  return await fetch(`${apiUrl}/bases`, fetchOptions('GET')).then((res) => res.json())
}
