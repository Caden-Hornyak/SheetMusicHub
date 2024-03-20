import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Navigate, useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar.js';

import './AccountPage.css'
import Profile from '../components/account/Profile.js';

const ProfilePage = ({ isAuthenticated }) => {
    const navigate = useNavigate();
    let [active_sidebar, set_active_sidebar] = useState(0)
    

    useEffect(() => {
      (async () => {
        // if (!isAuthenticated) {
        //   return navigate('/')
        // }
      
        })()
      
    }, [isAuthenticated])

    

    
  return (
    <>
      <Navbar />
      
      <div id='accountpage-page'>
        <div id='accountpage-content'>
          <div className='accountpage-sidebar'>
            <div className='accountpage-sidebar-btns'>
              <button className={`sidebarbtn ${active_sidebar == 0 ? 'active': ''}`} 
              onClick={() => set_active_sidebar(0)}>Profile</button>
              <button className={`sidebarbtn ${active_sidebar == 1 ? 'active': ''}`}
              onClick={() => set_active_sidebar(1)}>Bookmarked</button>
            </div>
          </div>
          <div id='accountpage-profile'>
            <Profile />
          </div>
        </div>
        
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(ProfilePage)