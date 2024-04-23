import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthorizedRoute } from './auth/AuthorizedRoute'
import { Register } from './auth/Register'
import { Login } from './auth/Login'
import { NavBar } from './nav/NavBar'

export const ApplicationViews = ({ loggedInUser, setLoggedInUser }) => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <AuthorizedRoute loggedInUser={loggedInUser}>
            <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
            <Outlet />
          </AuthorizedRoute>
        }>
        <Route index element={<>{/*!Home Page*/}</>} />

        <Route path='/flavors' element={<>!Custard Flavors Page</>} />
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
