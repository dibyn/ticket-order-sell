import React, { memo, useEffect } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/useRequest'

const signout = memo(() => {
  const { doRequest } = useRequest({
    method: 'get',
    url: `/api/users/signout`,
    body: {},
    onSuccess: () => Router.push('/')
  })
  useEffect(() => {
    doRequest()
  }, [])
  return <div>signout you out...</div>
})

export default signout
