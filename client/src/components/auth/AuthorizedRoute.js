import { Navigate, useLocation } from 'react-router-dom'

export const AuthorizedRoute = ({ children, loggedInUser, isPublicOnly = false, isAdminOnly = false }) => {
  const location = useLocation()

  // pass if user is still loading
  if (loggedInUser === 'loading') {
    return <></>
  }

  if (isAdminOnly) {
    // if the route requires admin authorization
    if (!!loggedInUser && loggedInUser.is_admin) {
      // and the user is an admin, allow entry
      return children
    } else {
      // if the user is not an admin, do not allow entry
      return <Navigate to='/' state={{ from: location }} replace />
    }
  } else if (!isPublicOnly) {
    // if the route requires authentication
    if (!!loggedInUser) {
      // and the user is logged in, allow entry
      return children
    } else {
      // if the user is not logged in, do not allow entry
      return <Navigate to='/login' state={{ from: location }} replace />
    }
  } else {
    // if the route does not require authentication
    if (!loggedInUser || loggedInUser === 'loading') {
      // and the user is not logged in, allow entry
      return children
    } else {
      // if the user is logged in, do not allow entry
      return <Navigate to='/' state={{ from: location }} replace />
    }
  }
}
