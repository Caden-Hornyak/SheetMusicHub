import React, {useState, useEffect} from 'react'
import Piano from '../components/piano/Piano'
import { default_ajax } from '../utility/CommonFunctions'

const PianoPlayback = () => {
    let [user_songs, set_user_songs] = useState(null)
    
    useEffect(() => {
        let get_songs = async () => {
            let res = await default_ajax('get', 'songs/multiple')
            set_user_songs(res)
        }
        get_songs()
    }, [])

  return (
    <div style={{height: '100vh', width: '100vw', 
    position: 'absolute', top: '0', left: '0'}}>
        {user_songs && <Piano type='playback' user_interact={false} song_prop={user_songs['1']}/>}
    </div>
  )
}

export default PianoPlayback