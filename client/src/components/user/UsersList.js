import { useQuery } from '@tanstack/react-query'
import { listUsers } from '../../managers/userManager'
import { formatDate } from '../../helper'
import './UsersList.css'
import { useNavigate } from 'react-router-dom'

export const UsersList = ({ loggedInUser }) => {
  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: listUsers,
  })
  const navigate = useNavigate()

  const getHeader = (employee) => {
    if (!!employee.full_name) {
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
        {employee.is_admin && <div className='users-list__employee-admin'>ADMIN</div>}
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
              {employee.is_admin && !!employee.full_name && <div className='users-list__employee-admin'>ADMIN</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
