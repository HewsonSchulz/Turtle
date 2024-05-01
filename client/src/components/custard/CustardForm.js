import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
import {
  createFlavor,
  listCustardBases,
  listToppings,
  retrieveFlavor,
  updateFlavor,
} from '../../managers/custardManager'
import { useNavigate, useParams } from 'react-router-dom'
import { scrollToTop } from '../../helper'

export const CustardForm = ({ loggedInUser }) => {
  const [flavorName, setFlavorName] = useState('')
  const [selectedBase, setSelectedBase] = useState('')
  const [selectedToppings, setSelectedToppings] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { flavorId } = useParams()

  const { data: toppings } = useQuery({
    queryKey: ['toppings'],
    queryFn: listToppings,
  })
  const { data: custardBases } = useQuery({
    queryKey: ['custardBases'],
    queryFn: listCustardBases,
  })
  const { data: custardFlavor } = useQuery({
    queryKey: ['flavor', flavorId],
    queryFn: () => retrieveFlavor(flavorId),
    enabled: !!flavorId,
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

  const createOrUpdateFlavor = async (flavorData) => {
    if (!flavorId) {
      // create new custard flavor
      return await createFlavor(flavorData)
    } else {
      // edit existing custard flavor
      return await updateFlavor(flavorData, flavorId)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('flavor', flavorName)
    formData.append('base', selectedBase)
    selectedToppings.forEach((topping) => formData.append('toppings[]', topping))
    if (selectedImage) formData.append('image', selectedImage)

    createOrUpdateFlavor(formData).then((res) => {
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

  useEffect(() => {
    scrollToTop()
  }, [])

  useEffect(() => {
    if (!!loggedInUser && loggedInUser !== 'loading' && !!custardFlavor) {
      if (!(loggedInUser.is_admin || loggedInUser.id === custardFlavor.creator_id)) {
        navigate('/flavors/new')
      }
    }
  }, [custardFlavor, loggedInUser, navigate])

  useEffect(() => {
    if (!!custardFlavor) {
      if (!!custardFlavor.id) {
        setFlavorName(custardFlavor.flavor)
        setSelectedBase(custardFlavor.base)
        setSelectedToppings(custardFlavor.toppings)
      } else {
        navigate('/flavors/new')
      }
    }
  }, [custardFlavor, navigate])

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
              className='custard-form__input'
              onChange={(e) => setFlavorName(e.target.value)}
              placeholder='Birthday Cake'
            />
          </FormGroup>
          <FormGroup>
            <Label for='base'>Base:</Label>{' '}
            <Input
              type='select'
              id='base'
              value={selectedBase}
              className='custard-form__input'
              onChange={(e) => setSelectedBase(e.target.value)}>
              {!flavorId && <option value={''}>Select a base</option>}
              {custardBases?.map((base) => (
                <option key={base} value={base}>
                  {base}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for='image'>Image:</Label>{' '}
            <Input type='file' id='image' accept='image/*' onChange={(e) => setSelectedImage(e.target.files[0])} />
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
