import { useQuery } from '@tanstack/react-query'
import { listUsers } from '../../managers/userManager'

export const UsersList = () => {
  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: listUsers,
  })

  return <>!UsersList</>
}
