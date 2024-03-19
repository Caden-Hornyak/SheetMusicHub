import React, { useEffect, useRef, useState } from 'react'
import PianoKey from './PianoKey'
import { Howl } from 'howler'
import './Piano.css'
import { attribute_animation, default_ajax } from '../../utility/CommonFunctions'
import { FaXmark } from "react-icons/fa6";
import { MdOutlineSaveAlt } from "react-icons/md";
import { TbShare2 } from "react-icons/tb";
import { IoMdCheckmark } from "react-icons/io";


const Piano = ({ start=12, end=60, type='', set_product=null, visible=true, pvh=() => {}, user_interact=true }) => {
  
  // Recording START
  let [recording, set_recording] = useState([false, 0])
  let [recorded_song, set_recorded_song] = useState([[], []])
  let [save_prompt, set_save_prompt] = useState([false, false])

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

        if (type == 'register') {
          set_product(recorded_song)
        }
        set_recorded_song([[], []])
      } else {
        if (type == 'login') {
          set_product(recorded_song[0])
          set_recorded_song([[], []])
        } else if (type == 'register') {
          set_recording([false, 1])
        } else {
          set_recording([false, 0])
          set_save_prompt(prev_state => [true, false])
        }
        
      }
    }
  }
  let clear_song = () => {
    set_recorded_song([], [])
    set_recording([false, 0])
  }
  // Recording END

  // Create Piano START
  let notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
  let keyboard_keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 
                      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 
                      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter',
                      'l_shft', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'r_shft']

  let piano_keys_ref = useRef({})
  let dic = new Map();

  let [pressed_keys, set_pressed_keys] = useState(Array(piano_keys_ref.current.length).fill(false))

  
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

  useEffect(() => {
    create_piano()
  }, [])
  // Create Piano END

  // Keyboard Listener START
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
    if (user_interact && visible) {
      document.addEventListener('keydown', playPianoKey)
      document.addEventListener('keyup', playPianoKey)
    }

    return () => {
      document.removeEventListener('keydown', playPianoKey)
      document.addEventListener('keyup', playPianoKey)
    };
  }, [visible])
  // Keyboard Listener END


  // Switch 1/2 piano layers START
  let [piano_styling, set_piano_styling] = useState(null)


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

  let piano_ref = useRef(null)
    useEffect(() => {
        if (piano_ref.current && pvh !== null) {
            if (pvh) {
              attribute_animation(piano_ref.current, 'height', '100vh', 'calc(100vh - var(--navbar-height))', 500, 'ease-in')
              attribute_animation(piano_ref.current, 'top', '0', 'var(--navbar-height)', 500, 'ease-in')
            } else {
              attribute_animation(piano_ref.current, 'height', 'calc(100vh - var(--navbar-height))', '100vh', 500, 'ease-out')
              attribute_animation(piano_ref.current, 'top', 'var(--navbar-height)', '0', 500, 'ease-out')
            }
        }
    }, [pvh])
  // Switch 1/2 piano layers END

  let save_song = async () => {
    set_save_prompt(async prev_state => {
      let res = await default_ajax('post', 'songs/', { 'song': recorded_song[0], 'name': 'TODO' })
      if (res !== -1) {
        console.log(res)
      }
      return [true, true]
    })
  }

  return (
    <>
      {save_prompt[0] && 
        <div className='piano-saveprompt-screen' onClick={() => set_save_prompt([false, false])}>
          
          <div className='piano-saveprompt' onClick={e => e.stopPropagation()} >
            <button className='close-btn' onClick={() => set_save_prompt([false, false])}><FaXmark /></button>
              {save_prompt[0] && !save_prompt[1] && <h2>Save or Share Your Recording</h2>}
              {save_prompt[0] && !save_prompt[1] &&
              <div>
                <button className='piano-saveprompt-btn' onClick={() => save_song()} ><MdOutlineSaveAlt /> Save </button>
                <button className='piano-saveprompt-btn'><TbShare2 /> Share</button>
              </div>
              }
              {save_prompt[0] && save_prompt[1] &&
              <div>
                <div className='pianosave-checkmark' >Saved! <IoMdCheckmark /></div>
                <button>Click here to go to thingy</button>
              </div>
              }

          </div>
        </div>
      
      }
      <div id='piano-wrapper' ref={piano_ref}>
        {user_interact && 
          <div id='piano-btn-wrapper'>
            <button className='piano-btn' onClick={() => recording[0] ? recording_action('end') : recording_action('start')} ><div className='red-dot'></div></button>
            {recording[0] && <button className='piano-btn' id='clear-song-btn' onClick={() => clear_song()} ><FaXmark /></button>}
            {(type === 'register' || type === 'login') && !recording && <p>{recording[1] === 0 ? 'Press Start To Begin Recording' : 'Confirm Password'}</p>}
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
    </>
  )
}

export default Piano