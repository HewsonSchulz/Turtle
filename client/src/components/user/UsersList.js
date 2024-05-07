import { useQuery, useQueryClient } from '@tanstack/react-query'
import { listUsers, toggleAdmin } from '../../managers/userManager'
import { formatDate, updateLocalObj } from '../../helper'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowDown, faCircleArrowUp } from '@fortawesome/free-solid-svg-icons'
import './UsersList.css'

export const UsersList = ({ loggedInUser, setLoggedInUser }) => {
  const queryClient = useQueryClient()
  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: listUsers,
  })
  const navigate = useNavigate()

  const handleToggleAdmin = (e, employee) => {
    e.stopPropagation()

    if (employee.id === loggedInUser.id) {
      if (window.confirm('Are you sure you want to remove yourself as an admin? You will not be able to undo this.')) {
        toggleAdmin(employee.id).then((res) => {
          if (res.valid) {
            navigate('/')
            updateLocalObj({ is_admin: res.is_admin }, setLoggedInUser)
          } else {
            window.alert(res.message)
          }
        })
      }
    } else {
      if (
        window.confirm(
          employee.is_admin ? `Remove ${employee.full_name} as admin?` : `Promote ${employee.full_name} to admin?`
        )
      ) {
        toggleAdmin(employee.id).then((res) => {
          if (res.valid) {
            queryClient.invalidateQueries(['employees'])
          } else {
            window.alert(res.message)
          }
        })
      }
    }
  }

  const getHeader = (employee) => {
    if (employee.full_name !== employee.username) {
      return (
        <div className='users-list__employee-header'>
          <i className='users-list__employee-name'>{employee.full_name}</i>
          <i className='users-list__employee-username'>{employee.username}</i>
        </div>
      )
    }
    return (
      <div className='users-list__employee-header'>
        <i className='users-list__employee-name'>{employee.username}</i>
      </div>
    )
  }

  return (
    <div className='users-list'>
      <div className='users-list__employees'>
        {employees?.map((employee) => (
          <div
            key={employee.id}
            className={`users-list__employee ${loggedInUser.id === employee.id ? 'users-list__link' : ''}`}
            onClick={() => {
              if (loggedInUser.id === employee.id) {
                navigate('/profile')
              }
            }}>
            {getHeader(employee)}
            <div className='users-list__employee-date-joined'>Joined: {formatDate(employee.date_joined)}</div>
            <div className='users-list__footer'>
              <div className='users-list__employee-last-login'>Last login: {formatDate(employee.last_login)}</div>
              {employee.is_admin ? (
                <FontAwesomeIcon
                  icon={faCircleArrowDown}
                  className='users-list__admin-btn users-list__demote-btn'
                  onClick={(e) => handleToggleAdmin(e, employee)}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleArrowUp}
                  className='users-list__admin-btn users-list__promote-btn'
                  onClick={(e) => handleToggleAdmin(e, employee)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
