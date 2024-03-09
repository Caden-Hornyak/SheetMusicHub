import React, { useEffect, useState } from 'react'
import { Howl } from 'howler'
import F3 from '../../audio/pianokeys/F3.mp3'

const Pianokey = ({note, color}) => {

    const [audio, setAudio] = useState(null);

    let load_note = async () => {
        const note_src = await import(`../../audio/pianokeys/${note}.mp3`);
        setAudio(new Howl({ src: [note_src.default]}))
    }
    
    let playSound = () => {
        audio.play()
    }

    useEffect(() => {
        load_note()
    }, [])

  return (
    <div className={color} onClick={() => playSound()} >{note}</div>
  )
}

export default Pianokey