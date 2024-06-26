import React, { useState, useEffect, useRef } from 'react'
import Piano from '../components/piano/Piano.js'
import Navbar from '../components/utility/Navbar.js'
import { attribute_animation } from '../utility/CommonFunctions.js'
import { TbLocationFilled } from "react-icons/tb";


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
  let [entered_code, set_entered_code] = useState('')

  useEffect(() => {
    if (multiplayer) {
      
      const url = `ws://localhost:8000/ws/socket-server/${entered_code}/`

      web_socket.current = new WebSocket(url)

      web_socket.current.onopen = (e) => {
        console.log('Connection Established')
      }

      web_socket.current.onmessage = (e) => {
        
        let data = JSON.parse(e.data)
        
        web_socket_open.current = true
        if ('room_code' in data) {
          console.log('Room code, ', data['room_code'])
          set_piano_room(data['room_code'])
        }
      }

      web_socket.current.onclose = () => {
        console.log('WebSocket connection closed')
      }
    }

    return () => {
      if (multiplayer && web_socket.current) {
        web_socket.current.close()
      }
      
    }
  }, [multiplayer])

  return (
    <>
        <Navbar parent_height_setter={set_pianopage_fullheight} />
        <div id='pianopage-page' ref={pianopage_ref}>
          {piano_room === null &&
          <>
            <div className='pianopage-roomwrapper'>
              <h2>Private</h2>
              <button className='def-btn' onClick={() => set_piano_room('solo')}>Solo Play</button>
              <h2>Host</h2>
              <button className='def-btn' onClick={() => {set_multiplayer(true)}}>Create Room</button>
              
              <h2>Join</h2>
              <div>
                <input type='text' className='def-input' id='pianopage-roomcode-in' placeholder='Room Code'
                onChange={(e) => {set_entered_code(e.target.value)}}></input>
                <button  onClick={() => set_multiplayer(true)}
                className={`pianopage-roomcode-btn ${entered_code.length === 6 ? 'active': 'disabled'}`}>
                  <TbLocationFilled /></button>
              </div>
              
            </div>

            
          </>}
                
          {(piano_room === 'solo' || web_socket_open.current) &&
            <Piano pvh={pianopage_fullheight} piano_room={piano_room} web_socket={web_socket.current}/>
          }
        </div>
        
    </>
  )
}

export default PianoPage