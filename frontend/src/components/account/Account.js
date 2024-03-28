import React, {useEffect, useState} from 'react'
import './Account.css'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'

const Account = ({ isAuthenticated, user_profile}) => {

    let navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/')
        }
    }, [])

    useEffect(() => {
    }, [user_profile])

    let [img_scale, set_img_scale] = useState(0)

  let scale_image = (e) => {
    const { naturalWidth, naturalHeight } = e.target
    const scale_factor = Math.min(100 / naturalWidth, 100 / naturalHeight)
    set_img_scale(scale_factor)
  }

  return (
    <>
        {user_profile &&
        <div>
             <img className='account-profimg' style={{transform: `scale(${img_scale})`}} 
             onLoad={(e) => scale_image(e)} src={user_profile.profile_picture} alt='User profile image'/>
            <h2>{user_profile.username}</h2>

            <p>{user_profile.first_name} {user_profile.last_name}</p>
            
        </div>}
    </>
  )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user_profile: state.profile.user_profile
  })

  export default connect(mapStateToProps)(Account)