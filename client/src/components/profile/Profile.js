import { useEffect, useState } from 'react'
import { Form, FormGroup, Input } from 'reactstrap'
import './Profile.css'
import { formatDate } from '../../helper'

export const Profile = ({ loggedInUser }) => {
  const [firstName, setFirstName] = useState(loggedInUser.first_name)
  const [lastName, setLastName] = useState(loggedInUser.last_name)
  const [isModified, setIsModified] = useState(false)

  useEffect(() => {
    setFirstName(loggedInUser.first_name)
    setLastName(loggedInUser.last_name)
  }, [loggedInUser])

  useEffect(() => {
    if (!!loggedInUser) {
      if (firstName.trim() !== loggedInUser.first_name || lastName.trim() !== loggedInUser.last_name) {
        setIsModified(true)
      } else {
        setIsModified(false)
      }
    }
  }, [firstName, lastName, loggedInUser])

  const handleSaveChanges = () => {
    // TODO: implement save logic
    setIsModified(false)
    window.alert(`Save changes: ${firstName} ${lastName}`)
  }

  return (
    <Form className='profile-form'>
      <div className='profile-form__content-a'>
        <FormGroup>
          <Input
            className='profile-form__item profile-form__username'
            type='text'
            value={loggedInUser.username}
            disabled
          />
        </FormGroup>

        <FormGroup>
          <Input
            className='profile-form__item profile-form__first-name'
            type='text'
            value={firstName}
            placeholder='First name'
            onChange={(e) => setFirstName(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Input
            className='profile-form__item profile-form__last-name'
            type='text'
            value={lastName}
            placeholder='Last name'
            onChange={(e) => setLastName(e.target.value)}
          />
        </FormGroup>

        <div className='profile-form__item profile-form__date-joined'>
          Joined on {formatDate(loggedInUser.date_joined)}
        </div>

        <button className='profile-form__submit-btn' onClick={handleSaveChanges} disabled={!isModified}>
          Save Changes
        </button>
      </div>
    </Form>
  )
}
