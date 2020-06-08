import React from 'react'
import Head from 'next/head'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PROJECT-G</title>
        <link href='https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css' rel='stylesheet'/>
        <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
      </Head>
      <div className='bg-gray-200 min-h-screen'>
        <Sidebar/>
        {children}
      </div>
    </>
  )
}

export default Layout