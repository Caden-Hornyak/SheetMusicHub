import React from 'react'
import PianoKey from './PianoKey'
import { Howl } from 'howler'
import './Piano.css'

const Piano = () => {
    
    let notes = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab']

    let create_piano = (start, end) => {
        let piano_keys = []

        let add = 0;
        for (let i = start; i < end; i++) {
            if (i % 12 >= 3) {
                add = 1
            } else {
                add = 0
            }
            console.log(notes[(i % 12)], add+Math.floor(i / 12), i)
            piano_keys.push(<PianoKey note={notes[(i % 12)] + (add+Math.floor(i / 12)).toString()}
            color={notes[(i % 12)].length == 1 ? 'white': 'black'} />)
        }
        return piano_keys
    }

  return (
    <div id='piano'>
        <div id="first-level" >
            {create_piano(0, 28)}
        </div>
        <div id="second-level" >
            {create_piano(28, 56)}
        </div>
        <div id="third-level" >
            {create_piano(56, 84)}
        </div>
        
    </div>
  )
}

export default Piano