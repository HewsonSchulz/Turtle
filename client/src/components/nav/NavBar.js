import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './NavBar.css'

export const NavBar = ({ loggedInUser, setLoggedInUser }) => {
  const navigate = useNavigate()
  const url = useLocation().pathname

  return (
    <>
      <ul className='header'>
        <li className='header-item header__title'>
          <img className='header__icon' src='/assets/turtle-icon.png' alt='turtle custard flavor' />
          <img className='header__text' src='/assets/turtle-title.png' alt='turtle logo' />
        </li>
        {localStorage.getItem('turtle_user') && (
          <Link className='navibar-link'>
            <li
              onClick={() => {
                if (window.confirm('Would you like to logout?')) {
                  localStorage.removeItem('turtle_user')
                  setLoggedInUser(null)
                  navigate('/login', { replace: true })
                }
              }}
              className='header-item header__logout'>
              Logged in as <i style={{ fontWeight: 'bold' }}>{loggedInUser.username}</i>
            </li>
          </Link>
        )}
      </ul>
      <ul className='navibar'>
        {loggedInUser && (
          <Link to='/' className='navibar-link'>
            <li className='navibar-item' id={url === '/' ? 'selected' : ''}>
              Home
            </li>
          </Link>
        )}

        <Link to='/flavors' className='navibar-link'>
          <li className='navibar-item' id={url === '/flavors' ? 'selected' : ''}>
            Custard
          </li>
        </Link>

        <Link to='/flavors/new' className='navibar-link'>
          <li className='navibar-item' id={url === '/flavors/new' ? 'selected' : ''}>
            Add Flavor
          </li>
        </Link>
      </ul>
    </>
  )
}
