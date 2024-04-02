import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Navigate, useNavigate} from 'react-router-dom'
import Navbar from '../components/utility/Navbar.js'

import './AccountPage.css'
import Profile from '../components/account/Profile.js'
import Bookmarked from '../components/account/Bookmarked.js'
import Account from '../components/account/Account.js'
import { attribute_animation } from '../utility/CommonFunctions.js'

const ProfilePage = ({ isAuthenticated }) => {
    const navigate = useNavigate()
    let [active_sidebar, set_active_sidebar] = useState(0)
    
    let profpage_ref = useRef(null)
    let [pp_fullheight, set_pp_fullheight] = useState(null)

    useEffect(() => {
        if (profpage_ref.current && pp_fullheight !== null) {
            if (pp_fullheight) {
                attribute_animation(profpage_ref.current, 'height', '100vh', 'calc(100vh - var(--navbar-height))', 500, 'ease-in')
                attribute_animation(profpage_ref.current, 'top', '0', 'var(--navbar-height)', 500, 'ease-in')
            } else {
                attribute_animation(profpage_ref.current, 'height', 'calc(100vh - var(--navbar-height))', '100vh', 500, 'ease-out')
                attribute_animation(profpage_ref.current, 'top', 'var(--navbar-height)', '0', 500, 'ease-out')
            }
        }
    }, [pp_fullheight])
    
  return (
    <>
      <Navbar parent_height_setter={set_pp_fullheight}/>
      
      <div id='accountpage-page' ref={profpage_ref}>
        <div id='accountpage-content'>
          <div className='accountpage-sidebar'>
            <div className='accountpage-sidebar-btns'>
              <button className={`sidebarbtn ${active_sidebar == 0 ? 'active': ''}`} 
              onClick={() => set_active_sidebar(0)}>Profile</button>
              <button className={`sidebarbtn ${active_sidebar == 1 ? 'active': ''}`}
              onClick={() => set_active_sidebar(1)}>Bookmarked</button>
              <button className={`sidebarbtn ${active_sidebar == 2 ? 'active': ''}`}
              onClick={() => set_active_sidebar(2)}>Account</button>
            </div>
          </div>
          <div className='accountpage-components'>
            {active_sidebar === 0 && <Profile />}
            {active_sidebar === 1 && <Bookmarked />}
            {active_sidebar === 2 && <Account />}
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