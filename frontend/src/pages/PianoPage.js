import React, { useState, useEffect, useRef } from 'react'
import Piano from '../components/piano/Piano.js'
import Navbar from '../components/Navbar.js'
import { attribute_animation } from '../utility/CommonFunctions.js'

import './PianoPage.css'

const PianoPage = () => {

  let [pianopage_fullheight, set_pianopage_fullheight] = useState(null)
  
  let pianopage_ref = useRef(null)
  useEffect(() => {
      if (pianopage_ref.current && pianopage_fullheight !== null) {
          if (pianopage_fullheight) {
            attribute_animation(pianopage_ref.current, 'height', '100vh', 'calc(100vh - var(--navbar-height))', 500, 'ease-in')
            attribute_animation(pianopage_ref.current, 'top', '0', 'var(--navbar-height)', 500, 'ease-in')
          } else {
            attribute_animation(pianopage_ref.current, 'height', 'calc(100vh - var(--navbar-height))', '100vh', 500, 'ease-out')
            attribute_animation(pianopage_ref.current, 'top', 'var(--navbar-height)', '0', 500, 'ease-out')
          }
      }
  }, [pianopage_fullheight])

  return (
    <>
        <Navbar parent_height_setter={set_pianopage_fullheight}/>
        <div id='pianopage-page' ref={pianopage_ref}>
          <Piano pvh={pianopage_fullheight}/>
        </div>
        
    </>
  )
}

export default PianoPage