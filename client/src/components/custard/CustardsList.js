import { useEffect, useState } from 'react'
import { listFlavors } from '../../managers/custardManager'

export const CustardsList = () => {
  const [flavors, setFlavors] = useState([])

  useEffect(() => {
    listFlavors().then(setFlavors)
  }, [])

  //TODO: permanent styling
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}>Custard Flavors</h2>
      <div style={{ marginLeft: '50px', marginTop: '20px' }}>
        {flavors.map((flavor) => (
          <ul key={flavor.id} style={{ marginBottom: '30px' }}>
            <li style={{ fontWeight: 'bold', marginBottom: '10px' }}>{flavor.flavor}</li>
            <li style={{ display: 'flex' }}>
              {flavor.base} base, with&nbsp;
              <ul style={{ display: 'flex' }}>
                {flavor.toppings.map((topping, index, array) => (
                  <li key={index}>{index === array.length - 1 ? `and ${topping}.` : `${topping},`}&nbsp;</li>
                ))}
              </ul>
            </li>
          </ul>
        ))}
      </div>
    </div>
  )
}
