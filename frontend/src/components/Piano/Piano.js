import React, { useEffect, useRef, useState } from 'react'
import PianoKey from './PianoKey'
import { Howl } from 'howler'
import './Piano.css'
import { attribute_animation, default_ajax } from '../../utility/CommonFunctions'
import { FaXmark } from "react-icons/fa6"
import { MdOutlineSaveAlt } from "react-icons/md"
import { TbShare2 } from "react-icons/tb"
import { IoMdCheckmark } from "react-icons/io"
import { FaPlay, FaPause } from "react-icons/fa"
import Tooltip from '../utility/Tooltip'
import { connect } from 'react-redux'

const Piano = ({ start=12, end=60, type='', set_product=null, visible=true, user_interact=true, song=null, isAuthenticated, multiplayer=false }) => {
  
  useEffect(() => {
    const sendMessage = () => {
      const message = 'hello';
      // Check if the WebSocket connection is open before sending the message
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
        console.log('Message sent:', message);
      } else {
        console.error('WebSocket connection is not open');
      }
    };

    console.log(process.env)
    const url = `ws://localhost:8000/ws/socket-server/`;

    // Create a new WebSocket instance
    const socket = new WebSocket(url);

    // Add event listeners to handle WebSocket events
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (e) => {
      let data = JSON.parse(e.data)
      console.log('Received message:', data);
      // Handle received messages from the WebSocket server
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Clean up function to close the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, [])


  // Recording START
  let [recording, set_recording] = useState([false, 0])
  let [recorded_song, set_recorded_song] = useState([[], []])
  let [save_prompt, set_save_prompt] = useState([false, false])
  let [curr_pressed_keys, set_curr_pressed_keys] = useState({})

  // useEffect(() => {
  //   console.log(recorded_song[0])
  // }, [recorded_song])

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
        if (type === 'login') {
          console.log('login')
          set_product(recorded_song[0])
          set_recorded_song([[], []])
          set_recording([false, 0])
        } else if (type === 'register') {
          set_recording([false, 1])
        } else {
          set_recording([false, 0])
          set_save_prompt(prev_state => [true, false])
        }
        
      }
    }
  }
  let clear_song = () => {
    set_recorded_song([[], []])
    set_recording([false, 0])
  }
  // Recording END

  // Create Piano START
  let [key_to_pkeyind, set_key_to_pkeyind] = useState({})
  let [pkey_to_pkeyind, set_pkey_to_pkeyind] = useState({})
  let [piano, set_piano] = useState([])
  let [curr_mouse_click, set_curr_mouse_click] = useState('')

  useEffect(() => {
      let notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
      let keyboard_keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 
                        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 
                        'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter',
                        'l_shft', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'r_shft']
      
      for (let i = start; i < end; i++) {

        if (i-start >= keyboard_keys.length)
          break

        let note = notes[(i % 12)] + (1+Math.floor(i / 12)).toString()

        set_piano(prev_state => {
          const new_piano = [
            ...prev_state,
            <PianoKey 
              note={note} 
              color={notes[(i % 12)].length === 1 ? 'white' : 'black'} 
              keyboard_key={keyboard_keys[i-start]}
              key={note}
              pressed={null}
              piano_height={window.innerWidth >= 1000 ? 75 : 150}
              user_interact={user_interact}
              pb_visual_mode={'none'}
              type={type}
            />
          ]

          set_key_to_pkeyind(prev_state => ({
            ...prev_state,
            [keyboard_keys[i-start]]: i-start
          }))
          set_pkey_to_pkeyind(prev_state => ({
            ...prev_state,
            [note]: i-start
          }))
          return new_piano;
        });

      }
    
    return () => {
      set_piano([])
    }
  }, [])
  // Create Piano END

  // Play Piano Key START

  let last_play_ts = useRef(50)
 // for play/pause playback
  let change_playing = (e) => {
    
    if (e.timeStamp - last_play_ts.current <= 50) return
    last_play_ts.current = e.timeStamp
    
    if (e.type === 'click' || e.code === 'Space') {
      set_playing(prev_state => prev_state === 'playing' ? 'paused': 'playing')
    }
    
  }


  useEffect(() => {
    const play_piano_key = (e) => {
      e.preventDefault()
      if (e.repeat) return
      let event = e
      // mouse click handling

      if (event.type === 'mouseup' && curr_mouse_click === '') {
        return
      } else if (event.type === 'mouseup') {
        event = {
          key: curr_mouse_click,
          type: 'keyup'
        }
      } else if (event.type === 'clickpianokey') {
        event = event.detail
        set_curr_mouse_click(prev_state => event.key)
      }

      
      let pressed_key = event.key.toLowerCase()
  
      if (pressed_key === 'shift') {
        pressed_key = event.location === 1 ? 'l_shft': 'r_shft'
      }
      
      
      let key_state = event.type === 'keydown'
      let key_ind = key_to_pkeyind[pressed_key]

      if (key_ind == null || key_ind == undefined) return
      
      // if recording and not repeat
      if (recording[0] && ((!(key_ind in curr_pressed_keys) && key_state) || ((key_ind in curr_pressed_keys) && !key_state))) {
        if (key_ind in curr_pressed_keys) {

          set_recorded_song((prev_song) => {  
            
            let l = [...prev_song]

            l[recording[1]][curr_pressed_keys[key_ind]].push(performance.now())
            set_curr_pressed_keys(prev_state => {
              
              const new_state = { ...prev_state }
              delete new_state[key_ind]
              return new_state
            })
            
            return l
          })
        } else {
          set_recorded_song((prev_song) => {
            let l = [...prev_song]

            set_curr_pressed_keys(prev_state => {
              let len = l[recording[1]].push([piano[key_ind].props.note, performance.now()]) - 1
              return ({
              ...prev_state,
              [key_ind]: len
            })})
            
            return l
          })
        }
        
      }

      set_piano(prev_state => {
        const keys = [...prev_state]
        keys[key_ind] = React.cloneElement(keys[key_ind], { pressed: key_state }) // Clone the specific PianoKey and update the pressed prop
        return keys
      })
    }


    

    if (user_interact && visible) {
      document.addEventListener('keydown', play_piano_key)
      document.addEventListener('keyup', play_piano_key)
      document.addEventListener('clickpianokey', play_piano_key)
      document.addEventListener('mouseup', play_piano_key)
    } else if (!user_interact && visible) {
      document.addEventListener('keypress', change_playing)
    }

    return () => {
      document.removeEventListener('keydown', play_piano_key)
      document.removeEventListener('keyup', play_piano_key)
      document.removeEventListener('clickpianokey', play_piano_key)
      document.removeEventListener('mouseup', play_piano_key)
    }
  }, [visible, piano, user_interact, recording])
  // Play Piano Key END


  // Handle Piano Layer Stacking START
  let [piano_styling, set_piano_styling] = useState(null)


  const [window_size, setwindow_size] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setwindow_size({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [])

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
  // Handle Piano Layer Stacking END


  let save_song = async () => {
    console.log(recorded_song)
     set_recorded_song(prev_song => {
      let l = [...prev_song[0]]
      console.log(l)
      for (let i = 0; i < l.length; i++) {
        if (l[i].length === 2) {
          l[i].push(l[i][1] + 50)
        } else if (l[i].length <= 1) {
          l.splice(i, 1)
        } else if (l[i].length > 3) {
          l[i] = l[i].splice(3, l[i].length - 3)
        }
      }
    })
    let res = await default_ajax('post', 'songs/create-song', { 'song': recorded_song[0], 'name': 'TODO' })
      if (res !== -1) {
        console.log(res)
      }

    set_save_prompt([true, true])
  }

  // Playback START
  let [playing, set_playing] = useState(null)
  let start_note_index = useRef(0)
  let song_player = useRef(null)
  let sp_start_time = useRef(null)
  let sp_anim_frameid = useRef(null)

  useEffect(() => {
    function song_playback() {
  
      function animate(timestamp) {
        if (!sp_start_time.current) {
          sp_start_time.current = timestamp
        }
        if (start_note_index.current < song.length && 
          song[start_note_index.current]['note']['start_timestamp'] <= timestamp - sp_start_time.current) {

          let timestamps = [
            song[start_note_index.current]['note']['start_timestamp'], 
            song[start_note_index.current]['note']['end_timestamp']
          ]

          let pkey_index = pkey_to_pkeyind[song[start_note_index.current]['note']['note']]
          let ind = start_note_index.current
          set_piano(prev_state => {
            const keys = [...prev_state]

            keys[pkey_index] = React.cloneElement(keys[pkey_index], { pb_visual_mode: 'move_down',
             timestamps: timestamps, end_song: ind === song.length-1 ? set_playing : null
            })
            return keys
          })
          start_note_index.current += 1
        }
          if (start_note_index.current >= song.length) {
            cancelAnimationFrame(sp_anim_frameid.current)
            sp_start_time.current = null
            start_note_index.current = 0
          } else {
            if (playing === 'playing') {
              sp_anim_frameid.current = requestAnimationFrame(animate)
            }
          }
        
      }
    
      function pause() {
        cancelAnimationFrame(sp_anim_frameid.current)
        set_piano(prev_state => {
          const keys = [...prev_state]
          for (let i = 0; i < keys.length; i++) {
            keys[i] = React.cloneElement(keys[i], { pb_visual_mode: 'pause' })
          }
          return keys
        })
      }
    
      function resume() {
        requestAnimationFrame(animate)
        set_piano(prev_state => {
          const keys = [...prev_state]
          for (let i = 0; i < keys.length; i++) {
            keys[i] = React.cloneElement(keys[i], { pb_visual_mode: 'resume' })
          }
          return keys
        })
      }
    
      function reset() {
        sp_start_time.current = null
        start_note_index.current = 0
      }

      return { pause, resume, reset }
    }
    song_player.current = song_playback()
  }, [song, playing])

  
  useEffect(() => {
      if (playing === 'playing') {
        console.log('resume')
        song_player.current.resume()
      } else if (playing === 'paused') {
        console.log('pause')
        song_player.current.pause()
      } else if (playing === null) {
        song_player.current.reset()
        set_piano(prev_state => {
          const keys = [...prev_state]

          for (let key_key in keys) {
            keys[key_key] = React.cloneElement(keys[key_key], { pb_visual_mode: 'none' })
          }
          return keys
        })
      }
  }, [playing])
  // Playback END

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
      
      <div id='piano-wrapper' onClick={type === 'playback' ? (e) => change_playing(e): undefined}>
        {user_interact && isAuthenticated &&
          <div id='piano-btn-wrapper'>
            <Tooltip content='Record' direction='bottom' delay={300} >
              <button className='piano-btn' onClick={() => recording[0] ? recording_action('end') : recording_action('start')} >
              <div className='red-dot'></div></button>
            </Tooltip>
            {recording[0] && <button className='piano-btn' id='clear-song-btn' onClick={() => clear_song()} ><FaXmark /></button>}
            {(type === 'register' || type === 'login') && !recording && <p>{recording[1] === 0 ? 'Press Start To Begin Recording' : 'Confirm Password'}</p>}
          </div>
        }

        { type === 'playback' && song && playing !== 'playing' &&

          <div id='pianoplayback-btn-wrapper'>
            <button className='piano-btn' id='piano-playbtn'
            onClick={(e) => change_playing(e)}>
            <FaPlay /></button>
            {/* <button className='piano-btn' onClick={() => set_playing(prev_state => null)}>Go to start</button> */}
          </div>
        }

        

        <div id='piano'>
          <div id="first-level" style={piano_styling ? piano_styling['first_level']: undefined}>
            {piano.length === end-start && piano.slice(0, Math.floor(piano.length/2))}
          </div>
          <div id="second-level" style={piano_styling ? piano_styling['second_level']: undefined}>
            {piano.length === end-start && piano.slice(Math.floor(piano.length/2), piano.length)}
          </div>  
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, null)(Piano)