import { useState } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { Button } from 'reactstrap'
import { createFlavor, listCustardBases, listToppings } from '../../managers/custardManager'
import { useNavigate } from 'react-router-dom'

export const CustardForm = () => {
  const [flavorName, setFlavorName] = useState('')
  const [selectedBase, setSelectedBase] = useState('')
  const [selectedToppings, setSelectedToppings] = useState([])
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: toppings } = useQuery({
    queryKey: ['toppings'],
    queryFn: listToppings,
  })
  const { data: custardBases } = useQuery({
    queryKey: ['custardBases'],
    queryFn: listCustardBases,
  })

  const handleToppingChange = (topping) => {
    if (selectedToppings.includes(topping)) {
      // remove topping
      setSelectedToppings(selectedToppings.filter((t) => t !== topping))
    } else {
      // add topping
      setSelectedToppings([...selectedToppings, topping])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    createFlavor({
      flavor: flavorName,
      base: selectedBase,
      toppings: selectedToppings,
    }).then((res) => {
      if (res.valid) {
        queryClient.invalidateQueries(['flavors'])
        navigate('/flavors')
      } else {
        //TODO: handle invalid request
      }
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <div>
          <div>
            <label htmlFor='name'>Name:</label>
            <input type='text' id='name' value={flavorName} onChange={(e) => setFlavorName(e.target.value)} />
          </div>
          <div>
            <label htmlFor='base'>Base:</label>
            <select id='base' value={selectedBase} onChange={(e) => setSelectedBase(e.target.value)}>
              <option value={''}>Select a base</option>
              {custardBases?.map((base) => (
                <option key={base} value={base}>
                  {base}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label>Toppings:</label>
          {toppings?.map((topping) => (
            <div key={topping}>
              <input
                type='checkbox'
                id={topping}
                checked={selectedToppings.includes(topping)}
                onChange={() => handleToppingChange(topping)}
              />
              <label htmlFor={topping}>{topping}</label>
            </div>
          ))}
        </div>
      </div>
      <Button color='primary' onClick={handleSubmit}>
        Save
      </Button>
    </div>
  )
}
