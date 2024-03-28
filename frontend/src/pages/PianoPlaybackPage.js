import React, {useState, useEffect, useRef} from 'react'
import Piano from '../components/piano/Piano'
import { default_ajax } from '../utility/CommonFunctions'
import { useParams } from 'react-router-dom'
import Navbar from '../components/utility/Navbar.js'
import './PianoPlaybackPage.css'
import { attribute_animation } from '../utility/CommonFunctions'


const PianoPlaybackPage = () => {
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

  let [playbackpage_fullheight, set_playbackpage_fullheight] = useState(null)
  
  let playbackpage_ref = useRef(null)
  useEffect(() => {
    if (playbackpage_ref.current && playbackpage_fullheight !== null) {
      if (playbackpage_fullheight) {
        attribute_animation(playbackpage_ref.current, 'height', '100vh', 'calc(100vh - var(--navbar-height))', 500, 'ease-in')
        attribute_animation(playbackpage_ref.current, 'top', '0', 'var(--navbar-height)', 500, 'ease-in')
      } else {
        attribute_animation(playbackpage_ref.current, 'height', 'calc(100vh - var(--navbar-height))', '100vh', 500, 'ease-out')
        attribute_animation(playbackpage_ref.current, 'top', 'var(--navbar-height)', '0', 500, 'ease-out')
      }
    }
  }, [playbackpage_fullheight])

  return (
    <>
    <Navbar parent_height_setter={set_playbackpage_fullheight}/>
    <div id='pianoplayback-page' ref={playbackpage_ref}>
        {user_song && <Piano type='playback' user_interact={false} song={user_song.song_notes} pvh={playbackpage_fullheight}/>}
    </div>
    </>
  )
}

export default PianoPlaybackPage