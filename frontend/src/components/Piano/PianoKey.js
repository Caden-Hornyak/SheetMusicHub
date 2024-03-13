import React, { useEffect, useState } from 'react'
import { Howl } from 'howler'
import F3 from '../../audio/pianokeys/F3.mp3'

const Pianokey = ({
  note, color, keyboard_key, innerRef, recorded_song, 
    set_recorded_song, recording, pressed
  }) => {
  
  let [this_pressed, set_this_pressed] = useState(pressed)
  const [audio, setAudio] = useState(null);
  const [key_down, set_key_down] = useState(false)
  const timeThreshold = 50;

  let load_note = async () => {
    const note_src = await import(`../../audio/pianokeys/${note}.mp3`);
    setAudio(new Howl({ src: [note_src.default]}))
  }
  
  let playSound = () => {

    // record pressed notes in linear time array
    if (recording[0]) {
      set_recorded_song((prev_song) => {
        const timestamp = new Date().getTime();

        let l = [...prev_song];

        let len = l[recording[1]].length
        // [] 1st = first or confirm pass, 2nd = append to end, 3rd = note or timestamp
    
        if (len > 0 && 
          timestamp - l[recording[1]][len-1][1][0] < timeThreshold) {
            l[recording[1]][len-1][0].push(note)
            l[recording[1]][len-1][1] = [timestamp]
            console.log('1', prev_song)
            return l
          } else {
            console.log('2', prev_song)
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
    if (this_pressed) {
      set_key_down(true)
      playSound()
    } else {
      set_key_down(false)
    }
  }, [this_pressed])

  // keep parent pressed state sync with child
  useEffect(() => {
    set_this_pressed(pressed)
  }, [pressed])

  

  return (
    <div ref={innerRef} className={`${color} ${key_down ? 'pressed' : ''}`} 
    onMouseUp={() => set_this_pressed(false)} onMouseDown={() => set_this_pressed(true)} onMouseLeave={() => set_this_pressed(false)} >{keyboard_key}</div>
  )
}

export default Pianokey