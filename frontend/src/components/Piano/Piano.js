import React, { useEffect, useRef, useState } from 'react'
import PianoKey from './PianoKey'
import { Howl } from 'howler'
import './Piano.css'

const Piano = ({ start=12, end=60 }) => {
  
  let notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

  let keyboard_keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 
                      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 
                      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter',
                      'l_shft', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'r_shft']

  let piano_keys_ref = useRef({})
  let dic

  let [recording, set_recording] = useState(false)
  let [recorded_song, set_recorded_song] = useState([])
  let piano_keys

  let create_piano = () => {
    let keyboard_it = 0
    piano_keys = []
    piano_keys_ref.current = {} 
    dic = new Map()

    
    for (let i = start; i < end; i++) {

      if (keyboard_it >= keyboard_keys.length)
        break

      let note = notes[(i % 12)] + (1+Math.floor(i / 12)).toString()

      piano_keys.push(<PianoKey note={note} color={notes[(i % 12)].length == 1 ? 'white': 'black'} 
      keyboard_key={keyboard_keys[keyboard_it]}
      key={note}
      innerRef={ref => piano_keys_ref.current[i] = ref}
      recorded_song={recorded_song}
      set_recorded_song={set_recorded_song}
      recording={recording}
      />)

      
      dic.set(keyboard_keys[keyboard_it], i)
      keyboard_it += 1

    }

    return piano_keys
  }
  
  let [test, set_test] = useState([])

  let recording_action = (action) => {
    if (action === 'start') {
      set_recording(prev => !prev)
      // some other stuff
      console.log("recording")
    } else if (action === 'end') {
      console.log("stopped recording")
      set_recording(false)

      set_recorded_song([])
    }
  }

  useEffect(() => {

    const playPianoKey = (event) => {

      let pressed_key = event.key.toLowerCase();

      if (pressed_key === 'shift') {
        pressed_key = event.location === 1 ? 'l_shft': 'r_shft'
      }
      const piano_key = dic.get(pressed_key);

      if (piano_key) {
        piano_keys_ref.current[piano_key].click()
      }


    };

    document.addEventListener('keydown', playPianoKey);
    create_piano()

    set_test(create_piano())


    return () => {
      document.removeEventListener('keydown', playPianoKey);
    };
  }, [])

  let clear_song = () => {
    set_recorded_song([])
    console.log("Song cleared")
  }


  return (
    <div id='piano-wrapper'>
      <div id='piano-buttons'>
        <button id='recording-button' onClick={() => recording ? recording_action('end') : recording_action('start')} ></button>
        <button id='clear-button' onClick={() => clear_song()} ></button>
      </div>
      <div id='piano'>
          <div id="first-level" >
            {test}
          </div>
          <div id="second-level" >
              {/* {piano_keys && console.log(piano_keys.slice(Math.floor((piano_keys.length) / 2), piano_keys.length))} */}
          </div>
          
      </div>
    </div>
  )
}

export default Piano