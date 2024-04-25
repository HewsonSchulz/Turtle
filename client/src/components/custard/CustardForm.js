import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'reactstrap'
import { listToppings } from '../../managers/custardManager'

export const CustardForm = () => {
  const [name, setName] = useState('')
  const [base, setBase] = useState('')
  const [selectedToppings, setSelectedToppings] = useState([])

  const { data: toppings } = useQuery({
    queryKey: ['toppings'],
    queryFn: listToppings,
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
    //TODO: handle form submission
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <div>
          <div>
            <label htmlFor='name'>Name:</label>
            <input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor='base'>Base:</label>
            <input type='text' id='base' value={base} onChange={(e) => setBase(e.target.value)} />
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
