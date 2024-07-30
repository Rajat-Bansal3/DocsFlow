import { SignIn } from '@clerk/nextjs'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <main className='auth-page'>
        <SignIn/>
    </main>
  )
}

export default page