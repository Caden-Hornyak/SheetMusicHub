import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Navigate, useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import { default_ajax } from '../utility/CommonFunctions.js'

const ProfilePage = ({ isAuthenticated }) => {
    const navigate = useNavigate();

    let [user_songs, set_user_songs] = useState(null)

    useEffect(() => {
      (async () => {
        // if (!isAuthenticated) {
        //   return navigate('/')
        // }
      
        })()
      
    }, [isAuthenticated])

    useEffect(() => {
      let get_songs = async () => {
        let res = await default_ajax('get', 'songs/')
        set_user_songs(res)
      }
      get_songs()
    }, [])

    
  return (
    <>
      <Navbar />
      
      <div className='user-songs'>
      {!user_songs ? 
      <p>Loader</p>
      :
      user_songs.length === 0 ?
      <p>No songs saved</p>
      :
      
      user_songs.map(song => (
        <div> 
        {
          song.song_notes.map(note => (
            <p>{note.note.note} {note.note.timestamp}</p>
          ))
        }
          
        </div>
      ))
      }
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(ProfilePage)