import React, { memo, useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/useRequest'

const SignIn = memo(() => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { doRequest, errors } = useRequest({
    method: 'post',
    url: `/api/users/signin`,
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/')
  })
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    await doRequest()
  }
  return (
    <form action='SignIn' onSubmit={onSubmitHandler}>
      <h1>SignIn </h1>
      <div className='form-group'>
        <label htmlFor='email'>Email Address</label>
        <input type='text' className='form-control' onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className='form-group'>
        <label htmlFor='password'>Password</label>
        <input type='password' className='form-control' onChange={(e) => setPassword(e.target.value)} />
      </div>
      {errors}

      <button className='btn btn-primary'>Sign in</button>
    </form>
  )
})

export default SignIn
