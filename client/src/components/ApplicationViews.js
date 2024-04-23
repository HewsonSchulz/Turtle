import { Route, Routes } from 'react-router-dom'
import { AuthorizedRoute } from './auth/AuthorizedRoute'
import { Register } from './auth/Register'
import { Login } from './auth/Login'

export const ApplicationViews = ({ loggedInUser, setLoggedInUser }) => {
  return (
    <Routes>
      <Route path='/' element={<>!Bruh</>} />

      <Route
        path='/register'
        element={
          <AuthorizedRoute loggedInUser={loggedInUser} isPublicOnly={true}>
            <Register setLoggedInUser={setLoggedInUser} />
          </AuthorizedRoute>
        }
      />

      <Route
        path='/login'
        element={
          <AuthorizedRoute loggedInUser={loggedInUser} isPublicOnly={true}>
            <Login setLoggedInUser={setLoggedInUser} />
          </AuthorizedRoute>
        }
      />
    </Routes>
  )
}
