import React, { useState, useEffect, useRef } from 'react'
import Piano from '../components/piano/Piano.js'
import Navbar from '../components/utility/Navbar.js'
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

  let [piano_room, set_piano_room] = useState(null)
  let [multiplayer, set_multiplayer] = useState(false)

  let web_socket = useRef(null)
  let web_socket_open = useRef(false)

  useEffect(() => {
    console.log(process.env)
    const url = `ws://localhost:8000/ws/socket-server/`

    web_socket.current = new WebSocket(url)

    web_socket.current.onopen = (e) => {
      let data = JSON.parse(e.data)
      web_socket_open.current = true
      if ('room_code' in data) {
        set_piano_room(data['room_code'])
      }
    }

    web_socket.current.onclose = () => {
      console.log('WebSocket connection closed')
    }
    
    
    return () => {
      web_socket.current.close()
    }
  }, [multiplayer])

  return (
    <>
        <Navbar parent_height_setter={set_pianopage_fullheight} />
        {piano_room === null &&
        <div>
          <div>
            <button onClick={() => {}}>Create Room</button>
            <button>Join Room</button>
          </div>
          <div>
            <button onClick={() => set_piano_room('solo')}>Solo Play</button>
          </div>
        </div>}

        {piano_room === 'solo' || web_socket_open &&
        <div id='pianopage-page' ref={pianopage_ref}>
          <Piano pvh={pianopage_fullheight} piano_room={piano_room} web_socket={web_socket.current}/>
        </div>}
        
    </>
  )
}

export default PianoPage