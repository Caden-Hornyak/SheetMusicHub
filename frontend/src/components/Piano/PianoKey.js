import React, { useEffect, useState } from 'react'
import { Howl } from 'howler'
import F3 from '../../audio/pianokeys/F3.mp3'

const Pianokey = ({note, color, keyboard_key, innerRef, recorded_song, set_recorded_song, recording}) => {
  console.log("RERENDER")
  const [audio, setAudio] = useState(null);
  const timeThreshold = 50;

  let load_note = async () => {
    const note_src = await import(`../../audio/pianokeys/${note}.mp3`);
    setAudio(new Howl({ src: [note_src.default]}))
  }
  
  let playSound = () => {

    // record pressed notes in linear time array
    console.log(recording)
    if (recording) {
      
      set_recorded_song((prev_song) => {
        const timestamp = new Date().getTime();

        let l = [...prev_song];

        if (l.length > 0 && 
          timestamp - l[l.length-1][1][0] < timeThreshold) {
            l[l.length-1][0].push(note)
            l[l.length-1][1] = [timestamp]
            return l
          } else {
            console.log(l)
            l.push([[note], [timestamp]])
            return l
          }
      })
    }
    audio.play()
  }

  useEffect(() => {
    load_note()
  }, [])

  return (
    <div ref={innerRef} className={color} onClick={() => playSound()} >{keyboard_key}</div>
  )
}

export default Pianokey