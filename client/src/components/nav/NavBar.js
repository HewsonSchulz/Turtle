import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import './NavBar.css'

export const NavBar = ({ loggedInUser, setLoggedInUser }) => {
  const navigate = useNavigate()
  const url = useLocation().pathname
  const [showLogout, setShowLogout] = useState(false)

  const toggleDropdown = () => {
    setShowLogout(!showLogout)
  }

  const handleLogout = () => {
    localStorage.removeItem('turtle_user')
    setLoggedInUser(null)
    navigate('/login', { replace: true })
    setShowLogout(false)
  }

  useEffect(() => {
    setShowLogout(false)
  }, [url])

  return (
    <>
      <ul className='header'>
        <li className='header-item header__title'>
          <img className='header__icon' src='/assets/turtle-icon.png' alt='turtle custard flavor' />
          <img className='header__text' src='/assets/turtle-title.png' alt='turtle logo' />
        </li>
        {localStorage.getItem('turtle_user') && (
          <Link className='navibar-link'>
            <li className='header-item header__logout' onClick={toggleDropdown}>
              Logged in as{' '}
              <i style={{ fontWeight: 'bold' }}>
                {loggedInUser.username} &emsp;
                <FontAwesomeIcon
                  icon={faCaretDown}
                  className={showLogout ? 'header__dropdown-btn flipped' : 'header__dropdown-btn'}
                />
              </i>
            </li>

            {showLogout && (
              <div className='logout__dropdown' onClick={handleLogout}>
                <div className='header-item logout-btn'>Logout</div>
              </div>
            )}
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
