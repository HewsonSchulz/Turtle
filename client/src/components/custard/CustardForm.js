import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Form, FormGroup, Label, Input } from 'reactstrap'
import {
  createFlavor,
  listCustardBases,
  listToppings,
  retrieveFlavor,
  updateFlavor,
} from '../../managers/custardManager'
import { useNavigate, useParams } from 'react-router-dom'
import { scrollToTop } from '../../helper'
import './CustardForm.css'

export const CustardForm = ({ loggedInUser }) => {
  const [flavorName, setFlavorName] = useState('')
  const [selectedBase, setSelectedBase] = useState('Vanilla')
  const [selectedToppings, setSelectedToppings] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState(null)
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
            window.alert('Please enter a flavor name, and specify a base for your custard')
            break
          case 'Missing property: flavor':
            window.alert('Please enter a flavor name for your custard')
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

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage)
      setSelectedImageUrl(url)

      // clean up object url during component unmount
      return () => URL.revokeObjectURL(url)
    }
  }, [selectedImage])

  return (
    <Form className='custard-form'>
      <div className='custard-form__content-a'>
        {!!custardFlavor && !selectedImage ? (
          <img
            src={custardFlavor.image || `/assets/turtle-icon-placeholder1.svg`}
            alt={custardFlavor.flavor || 'custard placeholder'}
            className='custard-form__img'
          />
        ) : (
          <img
            src={selectedImageUrl || `/assets/turtle-icon-placeholder1.svg`}
            alt={flavorName || 'custard placeholder'}
            className='custard-form__img'
          />
        )}
        <FormGroup>
          <Label className='custard-form__input-label' for='name'>
            Flavor Name:
          </Label>{' '}
          <Input
            type='text'
            id='name'
            value={flavorName}
            className='custard-form__input'
            autoFocus
            onChange={(e) => setFlavorName(e.target.value)}
            //TODO: randomize flavor name placeholder
            placeholder='Birthday Cake'
          />
        </FormGroup>
        <FormGroup>
          <Label className='custard-form__input-label' for='base'>
            Custard Base:
          </Label>{' '}
          <Input
            type='select'
            id='base'
            value={selectedBase}
            className='custard-form__input'
            onChange={(e) => setSelectedBase(e.target.value)}>
            {custardBases?.map((base) => (
              <option key={base} value={base}>
                {base}
              </option>
            ))}
          </Input>
        </FormGroup>

        <FormGroup>
          <Label className='custard-form__input-label' for='image'>
            Image:
          </Label>{' '}
          <Input
            className='custard-form__input'
            type='file'
            id='image'
            accept='image/*'
            onChange={(e) => setSelectedImage(e.target.files[0])}
          />
        </FormGroup>

        <button className='custard-form__submit-btn' onClick={handleSubmit}>
          Create Flavor
        </button>
      </div>
      <div>
        <Label className='custard-form__content-b__header'>Toppings:</Label>
        <FormGroup className='custard-form__content-b'>
          {toppings?.map((topping) => (
            <FormGroup check key={topping}>
              <Input
                type='checkbox'
                id={topping}
                checked={selectedToppings.includes(topping)}
                onChange={() => handleToppingChange(topping)}
              />{' '}
              <div className='custard-form__topping'>{topping}</div>
            </FormGroup>
          ))}
        </FormGroup>
      </div>
    </Form>
  )
}
