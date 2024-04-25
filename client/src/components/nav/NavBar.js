import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './NavBar.css'

export const NavBar = ({ loggedInUser, setLoggedInUser }) => {
  const navigate = useNavigate()
  const url = useLocation().pathname

  return (
    <ul className='navibar'>
      <li className='navibar-item'>
        {loggedInUser && (
          <Link to='/' className='navibar-link' id={url === '/' ? 'selected' : ''}>
            Home
          </Link>
        )}
      </li>

      <li className='navibar-item'>
        <Link to='/flavors' className='navibar-link' id={url === '/flavors' ? 'selected' : ''}>
          Custard
        </Link>
      </li>

      <li className='navibar-item'>
        <Link to='/flavors/new' className='navibar-link' id={url === '/flavors/new' ? 'selected' : ''}>
          Add Flavor
        </Link>
      </li>

      {localStorage.getItem('turtle_user') ? (
        <li className='navibar-item navibar-logout'>
          <Link
            onClick={() => {
              localStorage.removeItem('turtle_user')
              setLoggedInUser(null)
              navigate('/login', { replace: true })
            }}
            className='navibar-link'>
            Logout
          </Link>
        </li>
      ) : (
        <li className='navibar-item navibar-logout'>
          <Link to='/login' className='navibar-link'>
            Login
          </Link>
        </li>
      )}
    </ul>
  )
}
