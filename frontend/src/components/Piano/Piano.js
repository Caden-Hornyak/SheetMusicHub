import React, { useEffect, useRef, useState } from 'react'
import PianoKey from './PianoKey'
import { Howl } from 'howler'
import './Piano.css'


const Piano = ({ start=12, end=60, type='', set_product=null, visible=true }) => {
  
  let notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

  let keyboard_keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 
                      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 
                      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter',
                      'l_shft', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'r_shft']

  let piano_keys_ref = useRef({})
  let dic = new Map();

  let [recording, set_recording] = useState([false, 0])
  let [recorded_song, set_recorded_song] = useState([[], []])
  let [pressed_keys, set_pressed_keys] = useState(Array(piano_keys_ref.current.length).fill(false))

  let [piano_styling, set_piano_styling] = useState(null)

  let create_piano = (curr_start, curr_end) => {
    let keyboard_it = curr_start - 12
    let piano_keys = []
    
    for (let i = curr_start; i < curr_end; i++) {

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
      pressed={pressed_keys[i]}
      />)

      
      dic.set(keyboard_keys[keyboard_it], i)
      keyboard_it += 1

    }

    return piano_keys
  }

  let recording_action = (action) => {
    if (action === 'start') {
      set_recording(prev_state => {
        let rec_arr = [...prev_state]
        rec_arr[0] = true
        return rec_arr
      })

      console.log("recording")
    } else if (action === 'end') {
      console.log("stopped recording")

      // if second recording
      if (recording[1] === 1) {

        if (set_product) {
          set_product(recorded_song)
        }
        set_recorded_song([[], []])
      } else {
        if (type == 'login') {
          set_product(recorded_song[0])
          set_recorded_song([[], []])
        } else {
          set_recording([false, 1])
        }
        
      }
    }
  }


  const playPianoKey = (event) => {

    let pressed_key = event.key.toLowerCase();

    if (pressed_key === 'shift') {
      pressed_key = event.location === 1 ? 'l_shft': 'r_shft'
    }

    let key_index = dic.get(pressed_key)
    let key_state = event.type === 'keydown'

    set_pressed_keys(prev_state => {
      let keys = [...prev_state]
      keys[key_index] = key_state
      return keys
    })
  }

  useEffect(() => {
    create_piano()
    console.log('piano created')
  }, [])

  useEffect(() => {
    if (visible) {
      document.addEventListener('keydown', playPianoKey)
      document.addEventListener('keyup', playPianoKey)
    }

    return () => {
      document.removeEventListener('keydown', playPianoKey)
      document.addEventListener('keyup', playPianoKey)
    };
  }, [visible])

  let clear_song = () => {
    set_recorded_song([])
    set_recording([false, 0])
    console.log("Song cleared")
  }

  const [window_size, setwindow_size] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setwindow_size({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Clean up the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (window_size['width'] >= 1000) {
      set_piano_styling(prev_state => ({
        first_level: {
          width: '50%',
          bottom: '0',
          left: '0'
        },
        second_level: {
          width: '50%',
          bottom: '0',
          right: '0'
        }
      }))
    } else {
      set_piano_styling(null)
    }
  }, [window_size])


  return (
    <div id='piano-wrapper'>
      {(type === 'register' || type === 'login') &&
        <div id='piano-buttons'>
          <button id='recording-button' onClick={() => recording[0] ? recording_action('end') : recording_action('start')} ></button>
          <button id='clear-button' onClick={() => clear_song()} >Restart</button>
          {!recording && <p>{recording[1] === 0 ? 'Press Start To Begin Recording' : 'Confirm Password'}</p>}
        </div>
      }

      <div id='piano'>
          <div id="first-level" style={piano_styling ? piano_styling['first_level']: undefined}>
            {create_piano(start, Math.floor((start+end)/2))}
          </div>
          <div id="second-level" style={piano_styling ? piano_styling['second_level']: undefined}>
            {create_piano(Math.floor((start+end)/2), end)}
          </div>
          
      </div>
    </div>
  )
}

export default Piano