import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthorizedRoute } from './auth/AuthorizedRoute'
import { Register } from './auth/Register'
import { Login } from './auth/Login'

export const ApplicationViews = ({ loggedInUser, setLoggedInUser }) => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <AuthorizedRoute loggedInUser={loggedInUser}>
            <Outlet />
          </AuthorizedRoute>
        }>
        <Route index element={<>!!!BRUH</>} />
      </Route>

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

      <Route path='*' element={<Navigate to={'/'} replace />} />
    </Routes>
  )
}
