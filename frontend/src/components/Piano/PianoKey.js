import React, { useEffect, useState, useRef } from 'react'
import { Howl } from 'howler'
import F3 from '../../audio/pianokeys/F3.mp3'

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
  let [visuals, set_visuals] = useState({})
  let [visual_height, set_visual_height] = useState({})
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
    console.log("asjdf")
  }, [])

  
  useEffect(() => {
    if (this_pressed) {
      set_key_down(true)
      play_sound()

      set_visuals(prev_state => ({
          ...prev_state,
          [counter]: (
          <div style={{height: counter in visual_height ? `${visual_height[counter]}px`: 'auto'}} 
          ref={ref => visual_refs.current[counter] = ref} className='visualizer-instance expand_up'></div>
          )
      })) 

    } else {
      if (key_down) {

        const { top, height } = visual_refs.current[counter].getBoundingClientRect()
        let curr_visual = visual_refs.current[counter]
        set_visual_height(prev_state => ({
          ...prev_state,
          [counter]: [height]
        }))
        curr_visual.className = 'visualizer-instance move_up'

        setTimeout(() => {
          delete visual_refs.current[counter];

          set_visual_height(prev_state => {
            const new_state = { ...prev_state };
            delete new_state[counter];

            return new_state;
          }, counter)
          set_visuals(prev_state => {
            console.log("removed1")
            const new_state = { ...prev_state };
            delete new_state[counter];

            return new_state;
          }, counter);
        }, 10, counter)
        set_counter(prev_state => prev_state + 1)
      }
      set_key_down(false)
      
    }
  }, [this_pressed])

  // keep parent pressed state sync with child
  useEffect(() => {
    set_this_pressed(pressed)
  }, [pressed])

  useEffect(() => {
    console.log(visual_height)
  }, [visual_height])

  
  return (
    <div className={`piano-key-wrapper ${color}-wrapper`}>
      <div className={`vis-path`} >
          {Object.keys(visuals).map((key, index) => {
            return visuals[key]
          })}
      </div>
      <div ref={innerRef} className={`piano-key ${color}-key ${key_down ? 'pressed' : ''}`} 
      onMouseUp={() => set_this_pressed(false)} onMouseDown={() => set_this_pressed(true)} onMouseLeave={() => set_this_pressed(false)} >{keyboard_key}</div>
    </div>
    
  )
}

export default Pianokey