import React, { useEffect, useRef, useState } from 'react'
import PianoKey from './PianoKey'
import { Howl } from 'howler'
import './Piano.css'
import { attribute_animation, default_ajax } from '../../utility/CommonFunctions'
import { FaXmark } from "react-icons/fa6";
import { MdOutlineSaveAlt } from "react-icons/md";
import { TbShare2 } from "react-icons/tb";
import { IoMdCheckmark } from "react-icons/io";
import { FaPlay, FaPause } from "react-icons/fa";



const Piano = ({ start=12, end=60, type='', set_product=null, visible=true, user_interact=true, song_prop=null }) => {
  
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
  

  let piano_keys_ref = useRef({})

  let [pressed_keys, set_pressed_keys] = useState(Array(piano_keys_ref.current.length).fill(false))
  let [playback_visual, set_playback_visual] = useState(Array(piano_keys_ref.current.length).fill(''))
  let [key_to_key, set_key_to_key] = useState({})
  let [piano, set_piano] = useState([])
  let [test, set_test] = useState ()


  useEffect(() => {
    // create piano
    // let notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
    // let keyboard_keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 
    //                   'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 
    //                   'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter',
    //                   'l_shft', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'r_shft']
    
    // for (let i = start; i < end; i++) {

    //   if (i-start >= keyboard_keys.length)
    //     break

    //   let note = notes[(i % 12)] + (1+Math.floor(i / 12)).toString()

    //   set_piano(prev_state => {
    //     const new_piano = [
    //       ...prev_state,
    //       <PianoKey 
    //         note={note} 
    //         color={notes[(i % 12)].length === 1 ? 'white' : 'black'} 
    //         keyboard_key={keyboard_keys[i-start]}
    //         key={note}
    //         innerRef={ref => piano_keys_ref.current[i] = ref}
    //         recorded_song={recorded_song}
    //         set_recorded_song={set_recorded_song}
    //         recording={recording}
    //         pressed={pressed_keys[i]}
    //         user_interact={user_interact}
    //         playback_visual={playback_visual[i-start]}
    //       />
    //     ]

    //     // set_key_to_key(prev_state => ({
    //     //   ...prev_state,
    //     //   [keyboard_keys[i-start]]: i-start
    //     // }))
    //     return new_piano;
    //   });
    // 
    set_test('hello')

    return () => {
      set_key_to_key({})
      set_pressed_keys(Array(piano_keys_ref.current.length).fill(false))
      set_piano([])
    }
  }, [])

  // Create Piano END

  // Keyboard Listener START
  const play_piano_key = (event) => {

    let pressed_key = event.key.toLowerCase();

    if (pressed_key === 'shift') {
      pressed_key = event.location === 1 ? 'l_shft': 'r_shft'
    }


    let key_state = event.type === 'keydown'
    let key_ind = key_to_key[pressed_key]
    console.log(test)
    set_pressed_keys(prev_state => ({
      ...prev_state,
      [key_ind]: key_state
    }))
    // set_piano(prev_state => {
    //   const keys = [...prev_state]; 
    //   console.log(keys, key_ind)
    //   keys[key_ind] = React.cloneElement(keys[key_ind], { pressed: key_state }); // Clone the specific PianoKey element and update the pressed prop
    //   return keys; 
    // });
  }


  useEffect(() => {
    if (user_interact && visible) {
      document.addEventListener('keydown', play_piano_key)
      document.addEventListener('keyup', play_piano_key)
    }

    return () => {
      document.removeEventListener('keydown', play_piano_key)
      document.addEventListener('keyup', play_piano_key)
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

  // Switch 1/2 piano layers END

  let save_song = async () => {
    set_save_prompt(async prev_state => {
      let res = await default_ajax('post', 'songs/create-song', { 'song': recorded_song[0], 'name': 'TODO' })
      if (res !== -1) {
        console.log(res)
      }
      return [true, true]
    })
  }

  // Playback START
  let [playing, set_playing] = useState(null)
  let [song, set_song] = useState(song_prop)
  let [playback_index, set_playback_index] = useState(0)
  let song_player = useRef(null)

  function song_playback() {
    let start_time = null;
    let animation_frame_id = null;

    function animate(timestamp) {
      if (!start_time) {
        start_time = timestamp;
      }

      for (let i = playback_index; i < song.length; i++) {
        if (song[i]['start_timestamp'] <= timestamp) {
          let pkey_index = key_to_key[song[i]['note']]
          set_playback_visual(prev_state => {
            let l =[...prev_state]
            l[pkey_index] = 'expand_up'
          })
        } else if (song[i]['end_timestamp'] <= timestamp) {
          let pkey_index = key_to_key[song[i]['note']]
          set_playback_visual(prev_state => {
            let l =[...prev_state]
            l[pkey_index] = 'move_up'
          })
          set_playback_index(prev_state => prev_state + 1)
          }
        }
  
      if (playing) {
        animation_frame_id = requestAnimationFrame(animate);
      }
    }
  
    function pause() {
      set_playing(false)
      cancelAnimationFrame(animation_frame_id);
    }
  
    function resume() {
        set_playing(true)
        requestAnimationFrame(animate);
    }
  
    function reset() {
      start_time = null;
      set_playback_index(0)
      set_playing(false)
    }
    return { pause, resume, reset };
  }
  
  useEffect(() => {
    set_song(song_prop)
    // console.log(song_prop.song_notes)
  }, [song_prop])

  
  useEffect(() => {
    if (playing === null) {
      song_player.current = song_playback()
    } else if (playing) {
      console.log('Play')
      song_player.current.resume()
    } else {
      console.log('stop')
      song_player.current.pause()
    }
  }, [playing])

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
      
      <div id='piano-wrapper'>
        {user_interact && 
          <div id='piano-btn-wrapper'>
            <button className='piano-btn' onClick={() => recording[0] ? recording_action('end') : recording_action('start')} ><div className='red-dot'></div></button>
            {recording[0] && <button className='piano-btn' id='clear-song-btn' onClick={() => clear_song()} ><FaXmark /></button>}
            {(type === 'register' || type === 'login') && !recording && <p>{recording[1] === 0 ? 'Press Start To Begin Recording' : 'Confirm Password'}</p>}
          </div>
        }
        { type == 'playback' && song &&
          <div id='pianoplayback-btn-wrapper'>
            <button className='piano-btn' onClick={() => set_playing(prev_state => {return prev_state === null ? true : !prev_state})}>{playing ? <FaPause />: <FaPlay /> }</button>
            <button className='piano-btn'>Go to start</button>
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

export default Piano