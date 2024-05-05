import { useQuery } from '@tanstack/react-query'
import { listUsers } from '../../managers/userManager'
import { formatDate } from '../../helper'
import './UsersList.css'

export const UsersList = () => {
  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: listUsers,
  })

  return (
    <div className='users-list'>
      <div className='users-list__employees'>
        {employees?.map((employee) => (
          <div key={employee.id} className='users-list__employee'>
            <div className='users-list__employee-username'>
              {employee.username} {employee.is_admin && <i className='users-list__employee-admin'>ADMIN</i>}
            </div>
            <div className='users-list__employee-date-joined'>Joined: {formatDate(employee.date_joined)}</div>
            <div className='users-list__employee-last-login'>Last login: {formatDate(employee.last_login)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
