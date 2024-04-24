import { useEffect, useState } from 'react'
import { ApplicationViews } from './components/ApplicationViews'
import { saveUser } from './helper'

export const App = () => {
  const [loggedInUser, setLoggedInUser] = useState('loading')

  useEffect(() => {
    const user = localStorage.getItem('turtle_user')
    if (!!user) {
      saveUser(JSON.parse(user), setLoggedInUser)
    } else {
      setLoggedInUser(null)
    }
  }, [])

  return (
    <>
      <ApplicationViews loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
    </>
  )
}
