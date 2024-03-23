import React, { useEffect, useState, useRef } from 'react'
import { Howl } from 'howler'
import F3 from '../../audio/pianokeys/F3.mp3'
import { attribute_animation } from '../../utility/CommonFunctions.js'
import './PianoKey.css'

const Pianokey = ({
  note, color, keyboard_key, innerRef, pressed, user_interact, pb_visual_mode,
  type
  }) => {
  
  let load_note = async () => {
    const note_src = await import(`../../audio/pianokeys/${note}.mp3`);
    setAudio(new Howl({ src: [note_src.default]}))
  }
  useEffect(() => {
    load_note()
  }, [])

  const [audio, setAudio] = useState(null)

  let visual_refs = useRef({})

  let [curr_animation, set_curr_animation] = useState([null, true])
  let [visuals, set_visuals] = useState([])
  let [glow, set_glow] = useState(false)
  let glowline = useRef(null)

  let [counter, set_counter] = useState(0)

  useEffect(() => {
    if (visuals[counter] && curr_animation[1]) {
      set_curr_animation(prev_state => {
        let l = [...prev_state]
        l[0] = attribute_animation(visual_refs.current[counter], 'height', '0', '300000px', 1000000)
        l[1] = false
        return l
      })
    }
    
  }, [visuals])


  useEffect(() => {
    if (pressed) {
      console.log(note)
      audio.play()

      set_visuals(prev_state => {
        set_curr_animation(in_prev_state => {
          let l = [...in_prev_state]
          l[1] = true
          return l
        })
        return ({
          ...prev_state,
          [counter]: (
          <div key={`${counter}`} ref={ref => visual_refs.current[counter] = ref} className='visualizer-instance'></div>
          )
      })}) 
      set_glow(true)
      
      attribute_animation(glowline.current, 'opacity', '0', '1', 600, 'cubic-bezier(0,.99,.26,.99)')

    } else if (!pressed && pressed !== null && counter in visual_refs.current && curr_animation[0]) {
        curr_animation[0].pause()
        attribute_animation(visual_refs.current[counter], 'bottom', '0', '300000px', 1000000)
        set_glow(false)
        attribute_animation(glowline.current, 'opacity', '1', '0', 3000, 'cubic-bezier(.19,.98,.24,1.01)')
      

        setTimeout(() => {
          delete visual_refs.current[counter]
          set_visuals(prev_state => {
            const new_state = {...prev_state}
            delete new_state[counter]
            return new_state
          });
        }, 2000, counter)
          
        set_counter(prev_state => prev_state + 1)
      

    }
  }, [pressed])

  let curr_playback_anim = useRef([null, true])
  let [playback_visuals, set_playback_visuals] = useState({})
  let playback_counter = useRef(0)
  let playback_visual_refs = useRef({})

  useEffect(() => {
    console.log(playback_visuals)
    if (playback_visuals[playback_counter.current] && curr_playback_anim.current[1]) {
      curr_playback_anim = [attribute_animation(playback_visual_refs.current[counter], 'height', '100vh', '-300000px', 1000000, 'linear'), false]
    }
    
  }, [playback_visuals])

  useEffect(() => {

    if (pb_visual_mode === 'expand_down') {
      set_playback_visuals(prev_state => ({
        ...prev_state,
        [playback_counter.current]: (
        <div key={`${playback_counter.current}`} ref={ref => playback_visual_refs.current[counter] = ref} className='visualizer-instance'></div>
        )
      }))
    } else if (pb_visual_mode === 'move_down' && curr_playback_anim) {

      curr_playback_anim.current[0].pause()
      attribute_animation(playback_visual_refs.current[counter], 'top', '0', '-300000px', 1000000, 'linear')
      curr_playback_anim = [null, true]

      setTimeout(() => {
        delete playback_visual_refs.current[playback_counter.current]
        set_playback_visuals(prev_state => {
          const new_state = {...prev_state}
          delete new_state[playback_counter.current]
          return new_state
        });
      }, 2000, playback_counter.current)
      playback_counter.current += 1
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
              return visuals[key]
            })}
      </div>}
      {glow && <div className='glow-effect-small' ></div>}
      {glow && <div className='glow-effect-big' ></div>}
      <div className='glow-line' >
        <div ref={glowline} className='glowline-gradient'></div>
      </div>
      <div ref={innerRef} className={`piano-key ${color}-key ${pressed ? 'pressed' : ''}`}
      onMouseDown={() => click_piano_key()} >{keyboard_key}</div>
    </div>
    
  )
}

export default Pianokey