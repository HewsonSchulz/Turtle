import { useQuery } from '@tanstack/react-query'
import { listFlavors } from '../../managers/custardManager'
import './CustardsList.css'

export const CustardsList = () => {
  const { data: flavors } = useQuery({
    queryKey: ['flavors'],
    queryFn: listFlavors,
  })

  return (
    <div className='custards-list'>
      <h2 className='custards-list__title'>Custard Flavors</h2>
      <div className='custards-list__flavors'>
        {flavors?.map((flavor) => (
          <ul key={flavor.id} className='custards-list__flavor'>
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
          </ul>
        ))}
      </div>
    </div>
  )
}
