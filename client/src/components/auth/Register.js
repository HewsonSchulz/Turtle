import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, FormFeedback, FormGroup, Input } from 'reactstrap'
import { registerGuest } from '../../managers/userManager'
import { saveUser, updateStateObj } from '../../helper'
import './auth.css'

export const Register = ({ setLoggedInUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isInvalid, setIsInvalid] = useState({ username: false, password: false })
  const [message, setMessage] = useState({ username: '', password: '' })

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    registerGuest({ username, password }).then((tokenData) => {
      if (tokenData.valid) {
        saveUser(tokenData, setLoggedInUser)
        navigate('/')
      } else {
        updateStateObj(setMessage, 'username', '')
        updateStateObj(setMessage, 'password', '')

        switch (tokenData.message) {
          case 'That username is already in use':
            updateStateObj(setMessage, 'username', tokenData.message)
            updateStateObj(setIsInvalid, 'username', true)
            break
          case 'Missing properties: username, password':
            updateStateObj(setMessage, 'username', 'Please enter a username')
            updateStateObj(setMessage, 'password', 'Please enter a password')
            updateStateObj(setIsInvalid, 'username', true)
            updateStateObj(setIsInvalid, 'password', true)
            break
          case 'Missing property: username':
            updateStateObj(setMessage, 'username', 'Please enter a username')
            updateStateObj(setIsInvalid, 'username', true)
            break
          case 'Missing property: password':
            updateStateObj(setMessage, 'password', 'Please enter a password')
            updateStateObj(setIsInvalid, 'password', true)
            break
          default:
            updateStateObj(setMessage, 'password', tokenData.message)
            updateStateObj(setIsInvalid, 'username', true)
            updateStateObj(setIsInvalid, 'password', true)
        }
      }
    })
  }

  return (
    <div className='login__container'>
      <Form
        className='login__card'
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(e)
          }
        }}>
        <div className='login__header'>
          <img className='login__header__icon' src='/Turtle/turtle-icon.png' alt='turtle custard flavor' />
          <img className='login__header__text' src='/Turtle/turtle-title.png' alt='turtle logo' />
        </div>
        <h1 className='login__title'>Register</h1>
        <FormGroup id='login__username'>
          <Input
            id='login__username-input'
            type='text'
            value={username}
            placeholder='Username'
            invalid={isInvalid.username}
            autoFocus
            onChange={(e) => {
              updateStateObj(setIsInvalid, 'username', false)
              setUsername(e.target.value.replace(/\s+/g, '').toLowerCase())
            }}
          />
          <FormFeedback>{message.username}</FormFeedback>
        </FormGroup>

        <FormGroup id='login__password'>
          <Input
            id='login__password-input'
            type='password'
            value={password}
            placeholder='Password'
            invalid={isInvalid.password}
            onChange={(e) => {
              updateStateObj(setIsInvalid, 'password', false)
              setPassword(e.target.value)
            }}
          />
          <FormFeedback>{message.password}</FormFeedback>
        </FormGroup>

        <Button color='primary' onClick={handleSubmit}>
          Register
        </Button>
      </Form>
      <p className='login__register-link'>
        Already signed up? Log in{' '}
        <Link to='/login' id='auth-link'>
          here
        </Link>
        .
      </p>
    </div>
  )
}
