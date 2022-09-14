import React, { memo } from 'react'
import Link from 'next/link'

const Header = memo(({ currentUser }) => {
  const links = [
    !currentUser && {
      label: 'Sign up',
      href: '/auth/signup',
    },
    !currentUser && {
      label: 'Sign in',
      href: '/auth/signin',
    },
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Signout', href: '/auth/signout' },
  ]
    .filter((link) => link)
    .map(({ label, href }) => (
      <li className='nav-item' key={href}>
        <Link href={href}>
          <a href='' className='navbar-brand'>
            {label}
          </a>
        </Link>
      </li>
    ))
  return (
    <nav className='navbar navbar-light bg-light'>
      <Link href='/'>
        <a href='' className='navbar-brand'>
          GitX
        </a>
      </Link>
      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>{links}</ul>
      </div>
    </nav>
  )
})

export default Header
