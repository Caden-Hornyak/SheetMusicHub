import React, { useEffect, useState, useRef } from 'react'
import { Howl } from 'howler'
import F3 from '../../audio/pianokeys/F3.mp3'
import { opacity_animation } from '../../utility/Animations.js'
import './PianoKey.css'

const Pianokey = ({
  note, color, keyboard_key, innerRef, recorded_song, 
    set_recorded_song, recording, pressed
  }) => {
  
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

  let load_note = async () => {
    const note_src = await import(`../../audio/pianokeys/${note}.mp3`);
    setAudio(new Howl({ src: [note_src.default]}))
  }
  
  let play_sound = () => {

    // record pressed notes in linear time array
    if (recording[0]) {
      set_recorded_song((prev_song) => {

        const timestamp = new Date().getTime();

        let l = [...prev_song];

        let len = l[recording[1]].length

        // [] 1st = first or confirm pass, 2nd = append to end, 3rd = note or timestamp
        if (len > 0 && 
          timestamp - l[recording[1]][len-1][1][0] < time_threshold) {
            l[recording[1]][len-1][0].push(note)
            l[recording[1]][len-1][1] = [timestamp]

            return l
          } else {

            l[recording[1]].push([[note], [timestamp]])
            return l
          }
      })
    }
    
    audio.play()
  }

  useEffect(() => {
    load_note()
  }, [])

  
  useEffect(() => {
    if (counter in visual_refs.current) {
      set_curr_animation(visual_refs.current[counter].animate(
        [{height: '0', bottom: '0'}, {height: '300000px'}],
        {duration: 1000000, fill: 'forwards'}
      ))
    }
    
  }, [visuals])

  useEffect(() => {
    if (this_pressed) {
      set_key_down(true)
      play_sound()

      set_visuals(prev_state => ({
          ...prev_state,
          [counter]: (
          <div key={`${counter}`} ref={ref => visual_refs.current[counter] = ref} className='visualizer-instance'></div>
          )
      })) 
      set_glow(true)
      glow_animation('start')
      opacity_animation(glowline.current, 'start', 600, 'cubic-bezier(0,.99,.26,.99)')

    } else {
      if (key_down) {
        
        curr_animation.pause()
        set_curr_animation(visual_refs.current[counter].animate(
          [{bottom: '0'}, {bottom: '300000px'}],
          {duration: 1000000, fill: 'forwards'}
        ))
        set_glow(false)
        opacity_animation(glowline.current, 'end', 3000, 'cubic-bezier(.19,.98,.24,1.01)')

        setTimeout(() => {
          // delete visual_refs.current[counter]
          set_visuals(prev_state => {
            console.log(counter)
            const newState = {...prev_state};
            delete newState[counter];
            return newState;
          });
        }, 8000, counter)
          
        set_counter(prev_state => prev_state + 1)
        set_key_down(false)
      
      }
    }
  }, [this_pressed])

  // keep parent pressed state sync with child
  useEffect(() => {
    set_this_pressed(pressed)
  }, [pressed])
  
  const glow_animation = (action) => {
    
    
  }

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
      onMouseUp={() => {console.log("up"); set_this_pressed(false)}} onMouseDown={() =>{console.log("down"); set_this_pressed(true)}} onMouseLeave={() => {console.log("leave"); set_this_pressed(false)}} >{keyboard_key}</div>
    </div>
    
  )
}

export default Pianokey