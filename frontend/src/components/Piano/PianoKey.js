import React, { useEffect, useState, useRef } from 'react'
import { Howl } from 'howler'
import F3 from '../../audio/pianokeys/F3.mp3'
import { attribute_animation } from '../../utility/CommonFunctions.js'
import './PianoKey.css'
import { TbRuler } from 'react-icons/tb'

const Pianokey = ({
  note, color, keyboard_key, innerRef, pressed, user_interact, pb_visual_mode,
  type
  }) => {
  
  console.log(note)
  let load_note = async () => {
    const note_src = await import(`../../audio/pianokeys/${note}.mp3`);
    audio.current = new Howl({ src: [note_src.default]})
  }
  useEffect(() => {
    load_note()
  }, [])

  const audio = useRef(null)

  let visual_refs = useRef({})

  let curr_animation = useRef([null, true])

  let [visuals, set_visuals] = useState([])
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
        console.log(counter.current)
        return ({
          ...prev_state,
          [counter.current]: (
          <div key={`${counter.current}`} ref={ref => visual_refs.current[counter.current] = ref} 
          className={`visualizer-instance ${color === 'black' ? 'black-visualizer': ''}`}></div>
          )
      })}) 
      
      attribute_animation(glowline.current, 'opacity', '0', '1', 600, 'cubic-bezier(0,.99,.26,.99)')
      console.log('two state')

    } else if (!pressed && pressed !== null && counter.current in visual_refs.current && curr_animation.current[0]) {

        curr_animation.current[0].pause()
        attribute_animation(visual_refs.current[counter.current], 'bottom', '0', '300000px', 1000000)
        attribute_animation(glowline.current, 'opacity', '1', '0', 3000, 'cubic-bezier(.19,.98,.24,1.01)')
      
        // setTimeout((curr_counter) => {
        //   delete visual_refs.current[curr_counter]
        //   console.log(curr_counter)
        //   set_visuals(prev_state => {
        //     const new_state = {...prev_state}
        //     delete new_state[curr_counter]
        //     return new_state
        //   });
        // }, 3000, counter.current)
          
        counter.current += 1
    }
  }, [pressed])

  let [playback_visuals, set_playback_visuals] = useState([])
  let [pb_counter, set_pb_counter] = useState(0)
  let [curr_pb_anim, set_curr_pb_anim] = useState([[], true])
  let playback_visual_refs = useRef({})

  useEffect(() => {
    if (playback_visuals[pb_counter] && curr_pb_anim[1]) {
      set_curr_pb_anim(prev_state => {
        let l = [...prev_state]
        l[0].push(attribute_animation(playback_visual_refs.current[pb_counter], 'height', '0', '300000px', 1000000))
        l[1] = false
        return l
      })
    }
    
  }, [playback_visuals])

  useEffect(() => {
    if (pb_visual_mode === 'expand_down') {
      console.log(note)
      setTimeout(() => {
        audio.current.play()
      }, 2000)
      
      set_playback_visuals(prev_state => {
        set_curr_pb_anim(in_prev_state => {
          let l = [...in_prev_state]
          l[1] = true
          return l
        })

        return ({...prev_state,
          [pb_counter]: (
          <div key={`${pb_counter}`} ref={ref => playback_visual_refs.current[pb_counter] = ref} className='pb-visualizer-instance'></div>
          )
        })
      })
    } else if (pb_visual_mode === 'move_down' && curr_pb_anim[0]) {
      console.log("played!!")
      curr_pb_anim[0][curr_pb_anim[0].length-1].pause()
      set_curr_pb_anim(prev_state => {
        let l = [...prev_state]
        l[0][l[0].length-1] = attribute_animation(playback_visual_refs.current[pb_counter], 'top', '0', '300000px', 1000000, 'linear')
        l[1] = true
        return l
      })


      setTimeout(() => {
        delete playback_visual_refs.current[pb_counter]
        set_playback_visuals(prev_state => {
          const new_state = {...prev_state}
          delete new_state[pb_counter]
          return new_state
        });
      }, 3000, pb_counter)
      set_pb_counter(prev_state => prev_state + 1)
    } else if (pb_visual_mode === 'pause') {

      for (let i = 0; i < curr_pb_anim[0].length; i++) {
        curr_pb_anim[0][i].pause()
      }
    } else if (pb_visual_mode == 'resume') {
      for (let i = 0; i < curr_pb_anim[0].length; i++) {
        curr_pb_anim[0][i].play()
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
      onMouseDown={() => click_piano_key()} >{keyboard_key}</div>
    </div>
    
  )
}

export default Pianokey