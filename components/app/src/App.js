import React from 'react'
import logo from './logo.svg'
import './App.css'

import 'fontsource-julius-sans-one'
import 'fontsource-comfortaa'

import config from '../tmi.conf.json'


function App() {
  return (

    <main>

    <header>
      <ProfileMenu></ProfileMenu>
      <AppTitle title={config.title}></AppTitle>
      <AppMenu config={config.apps}></AppMenu>
    </header>

    <Content></Content>

    </main>

  )
}

export default App
