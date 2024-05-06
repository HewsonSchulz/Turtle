import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthorizedRoute } from './auth/AuthorizedRoute'
import { Register } from './auth/Register'
import { Login } from './auth/Login'
import { NavBar } from './nav/NavBar'
import { CustardsList } from './custard/CustardsList'
import { CustardForm } from './custard/CustardForm'
import { UsersList } from './user/UsersList'
import { Profile } from './profile/Profile'

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
        <Route index element={<Navigate to={'/flavors'} replace />} />

        <Route path='/flavors'>
          <Route index element={<CustardsList loggedInUser={loggedInUser} />} />
          <Route path='new' element={<CustardForm />} />
          <Route path='edit'>
            <Route index element={<Navigate to={'/flavors'} replace />} />
            <Route path=':flavorId' element={<CustardForm loggedInUser={loggedInUser} />} />
          </Route>
        </Route>

        <Route
          path='/employees'
          element={
            <AuthorizedRoute loggedInUser={loggedInUser} isAdminOnly={true}>
              <UsersList loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
            </AuthorizedRoute>
          }
        />

        <Route path='/profile' element={<Profile loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />

        <Route path='/about' element={<>!About</>} />
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
