import { useEffect, useState } from 'react'
import { ApplicationViews } from './components/ApplicationViews'
//! import { getUserById } from './managers/userManager'

export const App = () => {
  const [loggedInUser, setLoggedInUser] = useState()

  useEffect(() => {
    const user = localStorage.getItem('turtle_user')
    //! if (!!user) {
    //!   getUserById(JSON.parse(user).id).then(setLoggedInUser)
    //! } else {
    //!   setLoggedInUser(null)
    //! }
  }, [])

  return (
    <>
      <ApplicationViews loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
    </>
  )
}
