import React, { useEffect, useState, useRef } from 'react'
import { Howl } from 'howler'
import F3 from '../../audio/pianokeys/F3.mp3'
import { attribute_animation, Timer } from '../../utility/CommonFunctions.js'
import './PianoKey.css'
import { TbRuler } from 'react-icons/tb'

const Pianokey = ({
  note, color, keyboard_key, innerRef, pressed, user_interact, pb_visual_mode,
  type
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
          className={`visualizer-instance ${color === 'black' ? 'black-visualizer': ''}`}></div>
          )
      })}) 
      
      attribute_animation(glowline.current, 'opacity', '0', '1', 600, 'cubic-bezier(0,.99,.26,.99)')

    } else if (!pressed && pressed !== null && counter.current in visual_refs.current && curr_animation.current[0]) {

        curr_animation.current[0].pause()
        attribute_animation(visual_refs.current[counter.current], 'bottom', '0', '300000px', 1000000)
        attribute_animation(glowline.current, 'opacity', '1', '0', 3000, 'cubic-bezier(.19,.98,.24,1.01)')

        let curr_counter = counter.current
        setTimeout(() => {
          delete visual_refs.current[curr_counter]
          set_visuals(prev_state => {
            const new_state = Object.keys(prev_state).filter(key => key !== curr_counter).reduce((acc, key) => {
              acc[key] = prev_state[key]
              return acc
            }, {})
            return new_state
          })
        }, 3000, curr_counter)
          
        counter.current += 1
    }
  }, [pressed])

  let [playback_visuals, set_playback_visuals] = useState([])
  let pb_counter = useRef(0)
  let curr_pb_anim = useRef([[], true])
  let playback_visual_refs = useRef({})
  let timeouts = useRef({})
  let timeouts_counter = useRef(0)

  useEffect(() => {
    if (playback_visuals[pb_counter.current] && curr_pb_anim.current[1]) {
      curr_pb_anim.current[0].push(attribute_animation(playback_visual_refs.current[pb_counter.current], 'height', '0', '300000px', 1000000))
      curr_pb_anim.current[1] = false
    }
    
  }, [playback_visuals])

  useEffect(() => {
    if (pb_visual_mode === 'expand_down') {

      let curr_counter = timeouts_counter.current
      const timeout_id = new Timer((curr_counter) => {
        audio.current.play()
        delete timeouts.current[curr_counter]
      }, 2000, curr_counter)

      timeouts.current[timeouts_counter.current] = timeout_id
      timeouts_counter.current += 1

      set_playback_visuals(prev_state => {
        curr_pb_anim.current[1] = true

        return ({...prev_state,
          [pb_counter.current]: (
          <div key={`${pb_counter.current}`} ref={ref => playback_visual_refs.current[pb_counter.current] = ref} className='pb-visualizer-instance'></div>
          )
        })
      })
    } else if (pb_visual_mode === 'move_down' && curr_pb_anim.current[0]) {

      console.log(curr_pb_anim.current, note)
      curr_pb_anim.current[0][curr_pb_anim.current[0].length-1].pause()
      
      curr_pb_anim.current[0][curr_pb_anim.current[0].length-1] = attribute_animation(playback_visual_refs.current[pb_counter.current], 'top', '0', '300000px', 1000000, 'linear')
      curr_pb_anim.current[1] = true


      let curr_t_counter = timeouts_counter.current
      let curr_pb_counter = pb_counter.current
      const timeout_id = new Timer((curr_t_counter, curr_pb_counter) => {
        delete timeouts.current[curr_t_counter]
        delete playback_visual_refs.current[curr_pb_counter]
        delete curr_pb_anim.current[curr_pb_counter]
        set_playback_visuals(prev_state => {
          const new_state = Object.keys(prev_state).filter(key => key !== curr_pb_counter).reduce((acc, key) => {
            acc[key] = prev_state[key]
            return acc
          }, {})
          return new_state
        })
      }, 3000, curr_t_counter, curr_pb_counter)

      timeouts.current[timeouts_counter.current] = timeout_id
      timeouts_counter.current += 1

      pb_counter.current += 1

    } else if (pb_visual_mode === 'pause') {
      
      for (let i = 0; i < curr_pb_anim.current[0].length; i++) {
        console.log("pause", curr_pb_anim.current, note)
        curr_pb_anim.current[0][i].pause()
      }
    
      for (let timer_key in timeouts.current) {
        timeouts.current[timer_key].pause()
      }

      
      
    } else if (pb_visual_mode == 'resume') {
      for (let i = 0; i < curr_pb_anim.current[0].length; i++) {
        console.log("resume", curr_pb_anim.current, note)
        curr_pb_anim.current[0][i].play()
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
    <div className={`piano-key-wrapper ${color}-wrapper`}>
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
      {pressed && <div className='glow-effect-small' ></div>}
      {pressed && <div className='glow-effect-big' ></div>}
      <div className='glow-line' >
        <div ref={glowline} className='glowline-gradient'></div>
      </div>
      <div ref={innerRef} className={`piano-key ${color}-key ${pressed ? 'pressed' : ''}`}
      onMouseDown={() => click_piano_key()} >{user_interact ? keyboard_key : ''}</div>
    </div>
    
  )
}

export default Pianokey