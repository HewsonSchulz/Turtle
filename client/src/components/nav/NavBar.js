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
          <img className='header__icon' src='/Turtle/turtle-icon.png' alt='turtle custard flavor' />
          <img className='header__text' src='/Turtle/turtle-title.png' alt='turtle logo' />
        </li>

        {localStorage.getItem('turtle_user') && (
          <Link className='navibar-link'>
            <li className='header-item header__logout' onClick={toggleDropdown}>
              Logged in as{' '}
              <i style={{ fontWeight: 'bold' }}>
                {loggedInUser.full_name} &emsp;
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
        <Link to='/flavors' className='navibar-link'>
          <li className='navibar-item' id={url === '/flavors' ? 'selected' : ''}>
            Home{' '}
            {loggedInUser.new_custard > 0 && (
              <i className='navibar__new-custard' id={url === '/flavors' ? 'new-custard__selected' : ''}>
                {loggedInUser.new_custard < 10 ? <>&ensp;{loggedInUser.new_custard}&ensp;</> : loggedInUser.new_custard}
                <span className='tooltip'>
                  {`${loggedInUser.new_custard} new flavor${loggedInUser.new_custard !== 1 ? 's' : ''}`}
                  <br />
                  since your last login!
                </span>
              </i>
            )}
          </li>
        </Link>

        <Link to='/flavors/new' className='navibar-link'>
          <li className='navibar-item' id={url === '/flavors/new' ? 'selected' : ''}>
            Add Flavor
          </li>
        </Link>

        <Link to='/profile' className='navibar-link'>
          <li className='navibar-item' id={url === '/profile' ? 'selected' : ''}>
            Profile
          </li>
        </Link>

        {loggedInUser && loggedInUser.is_admin && (
          <Link to='/employees' className='navibar-link'>
            <li className='navibar-item' id={url === '/employees' ? 'selected' : ''}>
              Employees
            </li>
          </Link>
        )}

        <div className='navibar__whitespace' style={{ flexGrow: 1 }}></div>

        <Link to='/about' className='navibar-link'>
          <li className='navibar-item navibar__about' id={url === '/about' ? 'selected' : ''}>
            About
          </li>
        </Link>
      </ul>
    </>
  )
}
