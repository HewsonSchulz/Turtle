import { useEffect, useState } from 'react'
import { Form, FormGroup, Input } from 'reactstrap'
import './Profile.css'
import { formatDate, loadUserNames } from '../../helper'
import { updateUser } from '../../managers/userManager'

export const Profile = ({ loggedInUser, setLoggedInUser }) => {
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

  const handleSaveChanges = (e) => {
    e.preventDefault()

    updateUser({ first_name: firstName, last_name: lastName }, loggedInUser.id).then((updatedUser) => {
      if (updatedUser.valid) {
        loadUserNames(updatedUser, setLoggedInUser)
        setIsModified(false)
      } else {
        window.alert(updatedUser.message)
      }
    })
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

        <button className='profile-form__submit-btn' onClick={(e) => handleSaveChanges(e)} disabled={!isModified}>
          Save Changes
        </button>
      </div>
    </Form>
  )
}
