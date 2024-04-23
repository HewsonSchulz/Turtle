import { apiUrl, fetchOptions } from '../helper'

export const retrieveFlavor = async (pk) => {
  return await fetch(`${apiUrl}/custards/${pk}`, fetchOptions('GET')).then((res) => res.json())
}

export const listFlavors = async () => {
  return await fetch(`${apiUrl}/custards`, fetchOptions('GET')).then((res) => res.json())
}
