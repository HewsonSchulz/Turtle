import { Navigate, useLocation } from 'react-router-dom'

export const AuthorizedRoute = ({ children, loggedInUser, isPublicOnly }) => {
  const location = useLocation()

  if (!isPublicOnly) {
    // if the route requires authorization
    if (!!loggedInUser) {
      // and the user is logged in, allow entry
      return children
    } else {
      // if the user is not logged in, do not allow entry
      return <Navigate to='/login' state={{ from: location }} replace />
    }
  } else {
    // if the route does not require authorization
    if (!loggedInUser || loggedInUser === 'loading') {
      // and the user is not logged in, allow entry
      return children
    } else {
      // if the user is logged in, do not allow entry
      return <Navigate to='/' state={{ from: location }} replace />
    }
  }
}
