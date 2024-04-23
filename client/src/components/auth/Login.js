import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, FormFeedback, FormGroup, Input } from 'reactstrap'
import { logInUser } from '../../managers/userManager'
import './auth.css'
import { saveUser, updateStateObj } from '../../helper'

export const Login = ({ setLoggedInUser }) => {
  const [username, setUsername] = useState('hewson') // default username
  const [password, setPassword] = useState('bruh') // default password
  const [invalid, setInvalid] = useState('')
  const [message, setMessage] = useState({ username: '', password: '' })

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    logInUser({ username, password }).then((tokenData) => {
      if (tokenData.valid) {
        saveUser(tokenData, setLoggedInUser)
        navigate('/')
      } else {
        updateStateObj(setMessage, 'username', '')
        updateStateObj(setMessage, 'password', '')

        switch (tokenData.message) {
          case 'Missing properties: username, password':
            updateStateObj(setMessage, 'password', 'Please enter a username and password')
            setInvalid('all')
            break
          case 'Missing property: username':
            updateStateObj(setMessage, 'username', 'Please enter a username')
            setInvalid('username')
            break
          case 'Missing property: password':
            updateStateObj(setMessage, 'password', 'Please enter a password')
            setInvalid('password')
            break
          default:
            updateStateObj(setMessage, 'password', tokenData.message)
            setInvalid('all')
        }
      }
    })
  }

  return (
    <div className='login__container'>
      <div className='login__card'>
        <h1 className='login__header'>Log In To Turtle</h1>
        <FormGroup id='login__username'>
          <Input
            id='login__username-input'
            type='text'
            value={username}
            placeholder='Username'
            invalid={invalid === 'username' || invalid === 'all'}
            onChange={(e) => {
              setInvalid('')
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
            invalid={invalid === 'password' || invalid === 'all'}
            onChange={(e) => {
              setInvalid('')
              setPassword(e.target.value)
            }}
          />
          <FormFeedback>{message.password}</FormFeedback>
        </FormGroup>

        <Button color='primary' onClick={handleSubmit}>
          Login
        </Button>
      </div>
      <p className='login__register-link'>
        Not signed up? Register{' '}
        <Link to='/register' id='auth-link'>
          here
        </Link>
        .
      </p>
    </div>
  )
}
