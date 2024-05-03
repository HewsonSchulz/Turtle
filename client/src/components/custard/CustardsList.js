import { useQuery, useQueryClient } from '@tanstack/react-query'
import { destroyFlavor, listFlavors } from '../../managers/custardManager'
import { Button } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getPlaceholder, scrollToTop } from '../../helper'
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

  function getCustardDescription(flavor) {
    let desc = `${flavor.base} base${flavor.toppings.length ? ', with ' : '.'}`

    if (flavor.toppings.length > 0) {
      desc += ' '
      flavor.toppings.forEach((topping, index, array) => {
        if (index === array.length - 1) {
          if (array.length > 1) {
            desc += `and ${topping.toLowerCase()}.`
          } else {
            desc += ` ${topping.toLowerCase()}.`
          }
        } else {
          desc += `${topping.toLowerCase()}, `
        }
      })
    }

    return desc
  }

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <div className='custards-list'>
      <div className='custards-list__flavors'>
        {flavors?.map((flavor) => (
          <ul key={flavor.id} className='custards-list__flavor'>
            <li className='custards-list__flavor-name'>{flavor.flavor}</li>
            <div className='custards-list__img-container'>
              {flavor.image ? (
                <img src={flavor.image} alt={flavor.flavor} className='custards-list__img' />
              ) : (
                <img
                  src={`/assets/turtle-icon-placeholder${getPlaceholder(flavor.id)}.svg`}
                  alt={flavor.flavor}
                  className='custards-list__img'
                />
              )}
            </div>
            <li className='custards-list__flavor-description'>{getCustardDescription(flavor)}</li>
          </ul>
        ))}
      </div>
    </div>
  )
}

//* {(loggedInUser.is_admin || loggedInUser.id === flavor.creator_id) && (
//*   <div className='custards-list__buttons'>
//*     <Button color='warning' className='edit-btn' onClick={() => navigate(`/flavors/edit/${flavor.id}`)}>
//*       Edit
//*     </Button>
//*     <Button color='danger' className='delete-btn' onClick={() => handleDelete(flavor)}>
//*       Delete
//*     </Button>
//*   </div>
//* )}
