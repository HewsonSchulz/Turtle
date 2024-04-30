import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthorizedRoute } from './auth/AuthorizedRoute'
import { Register } from './auth/Register'
import { Login } from './auth/Login'
import { NavBar } from './nav/NavBar'
import { CustardsList } from './custard/CustardsList'
import { CustardForm } from './custard/CustardForm'

export const ApplicationViews = ({ loggedInUser, setLoggedInUser }) => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <AuthorizedRoute loggedInUser={loggedInUser}>
            <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
            <div className='app-container'>
              <Outlet />
            </div>
          </AuthorizedRoute>
        }>
        <Route index element={<>{/*!Home Page*/}</>} />

        <Route path='/flavors'>
          <Route index element={<CustardsList loggedInUser={loggedInUser} />} />
          <Route path='new' element={<CustardForm />} />
          <Route path='edit'>
            <Route index element={<Navigate to={'/flavors'} replace />} />
            <Route path=':flavorId' element={<CustardForm />} />
          </Route>
        </Route>
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
