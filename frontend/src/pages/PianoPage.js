import React, { useState } from 'react'
import Piano from '../components/piano/Piano.js'
import Navbar from '../components/Navbar.js'

import './PianoPage.css'

const PianoPage = () => {

  let [pianopage_fullheight, set_pianopage_fullheight] = useState(null)
    
  return (
    <div>
        <Navbar parent_height_setter={set_pianopage_fullheight}/>
        <Piano pvh={pianopage_fullheight}/>
    </div>
  )
}

export default PianoPage