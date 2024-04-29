import { useQuery, useQueryClient } from '@tanstack/react-query'
import { destroyFlavor, listFlavors } from '../../managers/custardManager'
import { Button } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { scrollToTop } from '../../helper'
import './CustardsList.css'

export const CustardsList = ({ loggedInUser }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: flavors } = useQuery({
    queryKey: ['flavors'],
    queryFn: listFlavors,
  })

  const handleDelete = async (flavor) => {
    if (window.confirm(`Are you sure you want to delete ${flavor.flavor}?`)) {
      await destroyFlavor(flavor.id)
      queryClient.invalidateQueries(['flavors'])
    }
  }

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <div className='custards-list'>
      <h2 className='custards-list__title'>Custard Flavors</h2>
      <div className='custards-list__flavors'>
        {flavors?.map((flavor) => (
          <ul key={flavor.id} className='custards-list__flavor'>
            <div>
              <li className='custards-list__flavor-name'>{flavor.flavor}</li>
              <li className='custards-list__flavor-description'>
                <i>
                  {flavor.base} base{flavor.toppings.length ? ', with ' : '.'}
                </i>
                <ul className='custards-list__toppings'>
                  {flavor.toppings.map((topping, index, array) => (
                    <li key={index} className='custards-list__topping'>
                      {index === array.length - 1
                        ? array.length > 1
                          ? `and ${topping}.`
                          : ` ${topping}.`
                        : `${topping},`}
                      &nbsp;
                    </li>
                  ))}
                </ul>
              </li>
            </div>
            {(loggedInUser.is_admin || loggedInUser.id === flavor.creator_id) && (
              <div className='custards-list__buttons'>
                <Button color='warning' className='edit-btn' onClick={() => navigate(`/flavors/edit/${flavor.id}`)}>
                  Edit
                </Button>
                <Button color='danger' className='delete-btn' onClick={() => handleDelete(flavor)}>
                  Delete
                </Button>
              </div>
            )}
          </ul>
        ))}
      </div>
    </div>
  )
}
