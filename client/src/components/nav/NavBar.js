import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './NavBar.css'

export const NavBar = ({ loggedInUser, setLoggedInUser }) => {
  const navigate = useNavigate()
  const url = useLocation().pathname

  return (
    <ul className='navbar'>
      <li className='navbar-item'>
        {loggedInUser && (
          <Link to='/' className='navbar-link' id={url === '/' ? 'selected' : ''}>
            Home
          </Link>
        )}
      </li>

      <li className='navbar-item'>
        <Link to='/flavors' className='navbar-link' id={url === '/flavors' ? 'selected' : ''}>
          Custard
        </Link>
      </li>

      {localStorage.getItem('turtle_user') ? (
        <li className='navbar-item navbar-logout'>
          <Link
            onClick={() => {
              localStorage.removeItem('turtle_user')
              setLoggedInUser(null)
              navigate('/login', { replace: true })
            }}
            className='navbar-link'>
            Logout
          </Link>
        </li>
      ) : (
        <li className='navbar-item navbar-logout'>
          <Link to='/login' className='navbar-link'>
            Login
          </Link>
        </li>
      )}
    </ul>
  )
}
