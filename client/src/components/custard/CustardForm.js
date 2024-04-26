import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
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
        switch (res.message) {
          case 'Missing properties: flavor, base':
            window.alert('Please specify a flavor name, and base for your custard')
            break
          case 'Missing property: flavor':
            window.alert('Please specify a flavor name for your custard')
            break
          case 'Missing property: base':
            window.alert('Please specify a base for your custard')
            break
          default:
            window.alert(res.message)
        }
      }
    })
  }

  return (
    <div>
      <Form style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <div>
          <FormGroup>
            <Label for='name'>Flavor Name:</Label>{' '}
            <Input
              type='text'
              id='name'
              value={flavorName}
              onChange={(e) => setFlavorName(e.target.value)}
              placeholder='Birthday Cake'
            />
          </FormGroup>
          <FormGroup>
            <Label for='base'>Base:</Label>{' '}
            <Input type='select' id='base' value={selectedBase} onChange={(e) => setSelectedBase(e.target.value)}>
              <option value={''}>Select a base</option>
              {custardBases?.map((base) => (
                <option key={base} value={base}>
                  {base}
                </option>
              ))}
            </Input>
          </FormGroup>

          <Button color='primary' onClick={handleSubmit} style={{ marginTop: '100px' }}>
            Save
          </Button>
        </div>
        <FormGroup>
          <Label>Toppings:</Label>
          {toppings?.map((topping) => (
            <FormGroup check key={topping}>
              <Label check>
                <Input
                  type='checkbox'
                  id={topping}
                  checked={selectedToppings.includes(topping)}
                  onChange={() => handleToppingChange(topping)}
                />{' '}
                {topping}
              </Label>
            </FormGroup>
          ))}
        </FormGroup>
      </Form>
    </div>
  )
}
