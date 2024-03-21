import React, { useEffect, useState, useRef } from 'react'
import { Howl } from 'howler'
import F3 from '../../audio/pianokeys/F3.mp3'
import { attribute_animation } from '../../utility/CommonFunctions.js'
import './PianoKey.css'

const Pianokey = ({
  note, color, keyboard_key, innerRef, recorded_song, 
    set_recorded_song, recording, pressed, user_interact
  }) => {
  
  let load_note = async () => {
    const note_src = await import(`../../audio/pianokeys/${note}.mp3`);
    setAudio(new Howl({ src: [note_src.default]}))
  }
  useEffect(() => {
    load_note()
  }, [])

  let [this_pressed, set_this_pressed] = useState(pressed)
  const [audio, setAudio] = useState(null)
  const [key_down, set_key_down] = useState(false)
  const time_threshold = 50;

  let visual_refs = useRef({})

  let [curr_animation, set_curr_animation] = useState(null)
  let [visuals, set_visuals] = useState([])
  let [glow, set_glow] = useState(false)
  let glowline = useRef(null)

  let [counter, set_counter] = useState(0)

  useEffect(() => {
    if (counter in visual_refs.current) {
      set_curr_animation(attribute_animation(visual_refs.current[counter], 'height', '0', '300000px', 1000000))
    }
    
  }, [visuals])

  useEffect(() => {
    if (this_pressed) {
      set_key_down(true)
      audio.play()

      if (recording[0]) {
        set_recorded_song((prev_song) => {
          console.log('create note')
          let l = [...prev_song]
          l[recording[1]].push([note, new Date().getTime()])
          return l
        })
      }

      set_visuals(prev_state => ({
          ...prev_state,
          [counter]: (
          <div key={`${counter}`} ref={ref => visual_refs.current[counter] = ref} className='visualizer-instance'></div>
          )
      })) 
      set_glow(true)
      attribute_animation(glowline.current, 'opacity', '0', '1', 600, 'cubic-bezier(0,.99,.26,.99)')

    } else {
      if (key_down) {
        
        curr_animation.pause()
        
        set_curr_animation(attribute_animation(visual_refs.current[counter], 'bottom', '0', '300000px', 1000000))
        set_glow(false)
        attribute_animation(glowline.current, 'opacity', '1', '0', 3000, 'cubic-bezier(.19,.98,.24,1.01)')
        if (recording[0]) {
          set_recorded_song((prev_song) => {
            console.log('end note')
            let l = [...prev_song]
            l[recording[1]][l[recording[1]].length - 1].push(new Date().getTime())
            return l
          })
        }
      

        // setTimeout(() => {
        //   // delete visual_refs.current[counter]
        //   set_visuals(prev_state => {
        //     console.log(counter)
        //     const newState = {...prev_state};
        //     delete newState[counter];
        //     return newState;
        //   });
        // }, 8000, counter)
          
        set_counter(prev_state => prev_state + 1)
        set_key_down(false)
      
      }
    }
  }, [this_pressed])

  // keep parent pressed state sync with child
  useEffect(() => {
    set_this_pressed(pressed)
  }, [pressed])
  
  return (
    <div className={`piano-key-wrapper ${color}-wrapper`}>
      <div className={`vis-path`} >
          {Object.keys(visuals).map((key, index) => {
            return visuals[key]
          })}
      </div>
      {glow && <div className='glow-effect-small' ></div>}
      {glow && <div className='glow-effect-big' ></div>}
      <div className='glow-line' >
        <div ref={glowline} className='glowline-gradient'></div>
      </div>
      <div ref={innerRef} className={`piano-key ${color}-key ${key_down ? 'pressed' : ''}`} 
      onMouseUp={() => {
        if (user_interact && this_pressed) {
          set_this_pressed(false)
        }
        }} 
        onMouseDown={() =>{
          if (user_interact) {
            set_this_pressed(true)
          }
        }} onMouseLeave={() => {
          if (user_interact && this_pressed) {
            set_this_pressed(false)
          }
          }} >{keyboard_key}</div>
    </div>
    
  )
}

export default Pianokey