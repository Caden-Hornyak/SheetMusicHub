import React, {useEffect, useState} from 'react'
import './Account.css'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { default_ajax } from '../../utility/CommonFunctions'
import { load_user } from '../../actions/profile.js'
import Piano from '../piano/Piano.js'

const Account = ({ isAuthenticated, user_profile, load_user}) => {

    let navigate = useNavigate()

    let [piano_password, set_piano_password] = useState(null)
    let [piano_vis, set_piano_vis] = useState(false)
    let [pass_mode, set_pass_mode] = useState(user_profile.piano_password)

    let [form_data, set_form_data] = useState({
      username: user_profile.username,
      first_name: user_profile.first_name,
      last_name: user_profile.last_name,
      password: '',
      conf_password: '',
      profile_picture: user_profile.profile_picture

    })

    let [mode, set_mode] = useState('view')
    const change_formdata = e => set_form_data(prev_state => {
      if (e.target.files) {
        
        console.log(e.target.files['0'])
        return {...prev_state, [e.target.name]: e.target.files['0']}
      } else {
        return {...prev_state, [e.target.name]: e.target.value }
      }
      
    })

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated])

    let change_profile = async () => {
      console.log(form_data)
      let post_form_data = new FormData()
      post_form_data.append('username', form_data.username)
      post_form_data.append('password', form_data.password)
      post_form_data.append('conf_password', form_data.conf_password)
      post_form_data.append('first_name', form_data.first_name)
      post_form_data.append('last_name', form_data.last_name)
      post_form_data.append('profile_picture', form_data.profile_picture)
      post_form_data.append('password_type', pass_mode ? 'piano': 'normal')

      let res = await default_ajax('put', 'profile/update-profile/', post_form_data, false)

      if (res !== -1) {
        load_user()
        set_mode('view')
      }
    }

    useEffect(() => {
      if (piano_password) {
        set_piano_vis(false)
      }
      
    }, [piano_password])


  return (
    <>
        {(user_profile && mode === 'view') &&
        <div className='accountpage-top'>
          <div className='image-container'>
            <img className='accountpage-profimg' style={{borderRadius: '1000px'}}
              src={user_profile.profile_picture} alt='User profile image'/>
          </div>
             
            <h1 className='accountpage-name'>{user_profile.username}</h1>
            
            <p>{user_profile.first_name} {user_profile.last_name}</p>
            
        </div>}
        {(user_profile && mode === 'edit') &&
        <div className='editprofile-wrapper'>
          {piano_vis &&
                <Piano type='register' set_product={set_piano_password} visible={piano_vis} />}

          <form className='editprofile-form' onSubmit={() => change_profile()}>
            <div className='image-container'>
              <img className='accountpage-profimg' style={{borderRadius: '1000px'}}
                src={user_profile.profile_picture} alt='User profile image'/>
                <input type='file' name='profile_picture' style={{marginLeft: '20px'}} onChange={(e) => change_formdata(e)} accept='image/*'/>
            </div>

            <label style={{marginTop: '40px'}} htmlFor='username'>Username: </label>
            <input className='def-input' name='username'  onChange={(e) => change_formdata(e)} value={form_data.username} />

            <button type='button' className='accountpage-changepassbtn' onClick={() => set_pass_mode(prev_state => !prev_state)}>Change Type of Password</button>

            {pass_mode ?
              <>
                <button type='button' className='def-btn' onClick={() => set_piano_vis(true)} disabled={piano_password !== null}>Set Piano Password</button>
                {piano_password !== null && <button id='clearpass-btn' type='button' style={{borderRadius: '25px'}} 
                onClick={() => set_piano_password(null)}>Clear Password</button>}
              </>
            :
              <>
                <label htmlFor='password'>Password: </label>
                <input className='def-input' name='password' onChange={(e) => change_formdata(e)} />
                
                <label htmlFor='conf_password'>Confirm Password: </label>
                <input className='def-input' name='conf_password' onChange={(e) => change_formdata(e)}/>
              </>
            }

            

          </form>
          
          <button className='def-btn' type='submit' onClick={() => change_profile()}>Confirm Changes</button>
        </div>
        }
        <button className='accountpage-editprofilebtn' 
        onClick={() => set_mode(mode === 'view' ? 'edit': 'view')}>Edit Profile</button>
    </>
  )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user_profile: state.profile.user_profile
  })

  export default connect(mapStateToProps, {load_user})(Account)