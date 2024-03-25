import React, {useState, useEffect} from 'react'
import Piano from './Piano'
import { default_ajax } from '../../utility/CommonFunctions'
import { useParams } from 'react-router-dom'

const PianoPlayback = () => {
    const { songid } = useParams()
    let [user_song, set_user_song] = useState(null)
    
    useEffect(() => {
        let get_songs = async () => {
            let res = await default_ajax('get', `songs/${songid}`)
            console.log(res)
            set_user_song(res)
        }
        get_songs()
    }, [])

  return (
    <div style={{height: '100vh', width: '100vw', 
    position: 'absolute', top: '0', left: '0'}}>
        {user_song && <Piano type='playback' user_interact={false} song={user_song.song_notes}/>}
    </div>
  )
}

export default PianoPlayback