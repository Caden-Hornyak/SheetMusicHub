import React, { useEffect, useState, useRef } from 'react'
import { Howl } from 'howler'
import F3 from '../../audio/pianokeys/F3.mp3'
import { attribute_animation, Timer } from '../../utility/CommonFunctions.js'
import './PianoKey.css'
import { TbRuler } from 'react-icons/tb'

const Pianokey = ({
  note, color, keyboard_key, piano_height=75, pressed, user_interact, pb_visual_mode=null,
  type, timestamps, end_song=null, mp_pressed=false
  }) => {

  let load_note = async () => {
    const note_src = await import(`../../audio/pianokeys/${note}.mp3`);
    audio.current = new Howl({ src: [note_src.default]})
  }
  useEffect(() => {
    load_note()
  }, [])

  const audio = useRef(null)

  let visual_refs = useRef([])
  let curr_animation = useRef([null, true])
  let [visuals, set_visuals] = useState({})
  let glowline = useRef(null)
 

  let counter = useRef(0)

  useEffect(() => {
    if (visuals[counter.current] && curr_animation.current[1]) {
      curr_animation.current = [attribute_animation(visual_refs.current[counter.current], 'height', '0', '300000px', 1000000), false]
    }
  }, [visuals])


  useEffect(() => {
    if (pressed) {
      audio.current.play()

      set_visuals(prev_state => {
        curr_animation.current[1] = true
        
        return ({
          ...prev_state,
          [counter.current]: (
          <div key={`${counter.current}`} ref={ref => visual_refs.current[counter.current] = ref} 
          className={`visualizer-instance ${color === 'black' ? 'black-visualizer': ''}  ${mp_pressed ? 'mp-visual': ''}`}></div>
          )
      })}) 
      
      attribute_animation(glowline.current, 'opacity', '0', '1', 600, 'cubic-bezier(0,.99,.26,.99)')

    } else if (!pressed && pressed !== null && counter.current in visual_refs.current && curr_animation.current[0]) {
        curr_animation.current[0].pause()
        attribute_animation(visual_refs.current[counter.current], 'bottom', '0', '300000px', 1000000)
        attribute_animation(glowline.current, 'opacity', '1', '0', 3000, 'cubic-bezier(.19,.98,.24,1.01)')

        let curr_counter = counter.current
        setTimeout(() => {
          
          set_visuals(prev_state => {
            let l = {}
            for (let key in prev_state) {
              if (key !== curr_counter) {
                l[key] = prev_state[key]
              }
            }
            return l
          })
          delete visual_refs.current[curr_counter]
        }, 3000, curr_counter)
          
        counter.current += 1
    }
  }, [pressed])


  let [playback_visuals, set_playback_visuals] = useState([])
  let pb_counter = useRef(0)
  let curr_pb_anim = useRef([{}, true])
  let playback_visual_refs = useRef({})
  let timeouts = useRef({})
  let timeouts_counter = useRef(0)
  let key_wrapper = useRef(null)
  let [pb_pressed, set_pb_pressed] = useState(false)

  // timing on playback notes
  useEffect(() => {
    if (playback_visuals[pb_counter.current] && curr_pb_anim.current[1]) {

      const computed_style = window.getComputedStyle(playback_visual_refs.current[pb_counter.current])
      const height = parseFloat(computed_style.getPropertyValue('height'))
      const duration = 3000 + ((3000 / (key_wrapper.current.clientHeight * .75)) * height)

      const f_timeout_id = new Timer(() => {
        attribute_animation(glowline.current, 'opacity', '0', '1', 600, 'cubic-bezier(0,.99,.26,.99)')
        set_pb_pressed(true)
        audio.current.play()
      }, 2950)

      let curr_pb_counter = pb_counter.current
      let curr_timeout_counter = timeouts_counter.current

      const s_timeout_id = new Timer((curr_pb_counter, curr_timeout_counter) => {
        set_playback_visuals(prev_state => {
          delete timeouts.current[curr_timeout_counter]
          delete playback_visual_refs.current[curr_pb_counter]
          delete curr_pb_anim.current[0][curr_pb_counter]
          set_pb_pressed(false)
          attribute_animation(glowline.current, 'opacity', '1', '0', 3000, 'cubic-bezier(.19,.98,.24,1.01)')

          let l = {}
          for (let key in prev_state) {
            if (key !== curr_pb_counter) {
              l[key] = prev_state[key]
            }
          }
          return l
        })
        

        if (end_song !== null) {
          end_song(null)
        }
      }, duration, curr_pb_counter, curr_timeout_counter)

      timeouts.current[timeouts_counter.current] = f_timeout_id
      timeouts_counter.current += 1
      timeouts.current[timeouts_counter.current] = s_timeout_id
      timeouts_counter.current += 1

      

      
      curr_pb_anim.current[0][pb_counter.current] = (attribute_animation(playback_visual_refs.current[pb_counter.current], 'top', 
      `-${height}px`,
       `${(key_wrapper.current.clientHeight) * .75}px`, duration))
      curr_pb_anim.current[1] = false

      pb_counter.current += 1
    }
    
  }, [playback_visuals])

  useEffect(() => {

    if (typeof pb_visual_mode === 'number') {
      set_playback_visuals(prev_state => {
        curr_pb_anim.current[1] = true

        return ({...prev_state,
          [pb_counter.current]: (
          <div key={`${pb_counter.current}`} ref={ref => playback_visual_refs.current[pb_counter.current] = ref}
           className={`pb-visualizer-instance`}
          style={{height: `${(timestamps[1] - timestamps[0]) * 0.3}px`}}></div>
          )
        })
      })
    } else if (pb_visual_mode === 'pause') {

      for (let pb_key in curr_pb_anim.current[0]) {
        curr_pb_anim.current[0][pb_key].pause()
      }

      for (let timer_key in timeouts.current) {
        timeouts.current[timer_key].pause()
      }

      
      
    } else if (pb_visual_mode == 'resume') {
      for (let pb_key in curr_pb_anim.current[0]) {
        curr_pb_anim.current[0][pb_key].play()
      }

      for (let timer_key in timeouts.current) {
        timeouts.current[timer_key].resume()
      }
    }
  }, [pb_visual_mode])

  let click_piano_key = () => {
    const event = new CustomEvent('clickpianokey', {
      detail: {
        key: keyboard_key,
        keyCode: keyboard_key.charCodeAt(0),
        type: 'keydown',
        mouse_click: true
      }
     })
    document.dispatchEvent(event)
    }

  return (
    <div className={`piano-key-wrapper ${color}-wrapper`} ref={key_wrapper} 
    style={{borderLeft: note[0] === 'C' ? '1px solid rgba(255, 255, 255, 0.1)': undefined}}>
      <div className='vis-path' >
          {Object.keys(visuals).map((key, index) => {
            return visuals[key]
          })}
      </div>
      {type === 'playback' && 
      <div>
        {Object.keys(playback_visuals).map((key, index) => {
          
              return playback_visuals[key]
            })}
      </div>}
      {(pressed || pb_pressed) && <div className='glow-effect-small' ></div>}
      {(pressed || pb_pressed) && <div className='glow-effect-big' ></div>}
      <div className='glow-line' >
        <div ref={glowline} className='glowline-gradient'></div>
      </div>
      <div className={`piano-key ${color}-key ${pressed || pb_pressed ? 'pressed' : ''} ${mp_pressed ? 'mp-key': ''}`}
      onMouseDown={() => click_piano_key()} >{user_interact ? keyboard_key : ''}</div>
    </div>
    
  )
}

export default Pianokey