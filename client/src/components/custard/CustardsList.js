import { useQuery, useQueryClient } from '@tanstack/react-query'
import { destroyFlavor, listFlavors } from '../../managers/custardManager'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { getPlaceholder, scrollToTop } from '../../helper'
import './CustardsList.css'

export const CustardsList = ({ loggedInUser }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: flavors } = useQuery({
    queryKey: ['flavors'],
    queryFn: listFlavors,
  })

  const handleDelete = async (e, flavor) => {
    e.stopPropagation()

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
        let toppingText
        if (topping.includes('OREO')) {
          toppingText = 'OREO ' + topping.split('OREO')[1].toLowerCase()
        } else {
          toppingText = topping.toLowerCase()
        }

        if (index === array.length - 1) {
          if (array.length > 1) {
            desc += `and ${toppingText}.`
          } else {
            desc += ` ${toppingText}.`
          }
        } else {
          desc += `${toppingText}, `
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
          <ul
            key={flavor.id}
            className={`custards-list__flavor ${
              loggedInUser.is_admin || loggedInUser.id === flavor.creator_id ? 'custards-list__owned-flavor' : ''
            }`}
            onClick={() => {
              if (loggedInUser.is_admin || loggedInUser.id === flavor.creator_id) {
                navigate(`/flavors/edit/${flavor.id}`)
              }
            }}>
            <li className='custards-list__flavor-name'>
              <div className='whitespace' />
              <div>{flavor.flavor}</div>
              {loggedInUser.is_admin || loggedInUser.id === flavor.creator_id ? (
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className='custard-form__cancel-btn custards-list__cancel-btn'
                  onClick={(e) => handleDelete(e, flavor)}
                />
              ) : (
                <div className='whitespace' />
              )}
            </li>
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
