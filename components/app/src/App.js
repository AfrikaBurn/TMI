import React from 'react'
import logo from './logo.svg'
import './App.css'

import 'fontsource-julius-sans-one'
import 'fontsource-comfortaa'

import config from '../tmi.conf.json'


function App() {
  return (

    <header>
      <ProfileMenu></ProfileMenu>
      <AppTitle title={config.title}></AppTitle>
      <AppMenu config={config.apps}></AppMenu>
    </header>

  )
}

export default App
