import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom"
import './Navbar.css'
import { connect } from 'react-redux'
import { logout } from '../../actions/auth.js'
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io"
import { attribute_animation } from '../../utility/CommonFunctions.js'


function Navbar( { isAuthenticated, logout, parent_height_setter=() => {}, user_profile}) {
  let [visible, set_visible] = useState(null)
  let navbar_links = useRef(null)
  let [img_scale, set_img_scale] = useState(0)

  let scale_image = (e) => {
    const { naturalWidth, naturalHeight } = e.target
    const scale_factor = Math.min(50 / naturalWidth, 50 / naturalHeight)
    set_img_scale(scale_factor)
  }

  const auth_links = (
    <>
      <Link className='navbar-link' to='/'>Company Name :)</Link>
      <Link className='navbar-link' to='/' onClick={logout} >Sign Out</Link>
      <Link className='navbar-link' to='/create-post'>Create Post</Link>
      <Link className='navbar-link' to='/piano'>Piano</Link>
      <div className='navbar-account-btn'>
        <Link className='navbar-link' to='/profile'>
          <div className='navbar-account-btn-inner'>
            <p>{user_profile.username} </p>
            <div style={{position: 'relative', height: '50px', width: '50px'}}>
             <img className='account-profimg' style={{transform: `scale(${img_scale})`}} 
             onLoad={(e) => scale_image(e)} src={user_profile.profile_picture} alt='User profile image'/>
            </div>
            
          </div>
        </Link>
          <button className='navbar-btn' onClick={() => set_visible(false)}><IoIosArrowUp /></button>
        
      </div>
      
      
    </>
  )

  const guest_links = (
    <>
      <Link className='navbar-link' to='/'>Company Name :)</Link>
      <Link className='navbar-link' to='/login'>Sign In</Link>
      <Link className='navbar-link' to='/register'>Sign Up</Link>
      <Link className='navbar-link' to='/piano'>Piano</Link>
      <div style={{marginLeft: 'auto'}}>
      <button className='navbar-btn' onClick={() => set_visible(false)}><IoIosArrowUp /></button>
      </div>
      
    </>
  )

  useEffect(() => {
    if (visible !== null) {
      if (visible) {
        attribute_animation(navbar_links.current, 'top', 'calc(var(--navbar-height) * -1)', '0', 500, 'ease-in')
        parent_height_setter(visible)
      } else {
        attribute_animation(navbar_links.current, 'top', '0', 'calc(var(--navbar-height) * -1)', 500, 'ease-out')
        parent_height_setter(visible)
      }
    }
  }, [visible])

  return (
    <div id='navbar'>
      <div ref={navbar_links} id='navbar-links'>
        { isAuthenticated ? auth_links : guest_links }
      </div>
      {(!visible && visible != null) && <div style={{marginLeft: 'auto', display: 'flex'}}>
        <button className='navbar-btn' onClick={() => set_visible(true)}><IoIosArrowDown /></button>
        </div>}
      
    </div>
  );
  }
  
  const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user_profile: state.profile.user_profile
  })

  export default connect(mapStateToProps, { logout })(Navbar)
  