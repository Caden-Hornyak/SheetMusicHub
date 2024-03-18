import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom"
import './Navbar.css'
import { connect } from 'react-redux'
import { logout } from '../actions/auth'
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io"
import { top_animation, attribute_animation } from '../utility/Animations.js'


function Navbar( { isAuthenticated, logout, parent_height_setter=() => {} }) {
  let [visible, set_visible] = useState(null)
  let navbar_links = useRef(null)

  const authLinks = (
    <>
      <Link className='navbar-link' to='/'>Company Name :)</Link>
      <Link className='navbar-link' to='/' onClick={logout} >Sign Out</Link>
      <Link className='navbar-link' to='/create-post'>Create Post</Link>
      <Link className='navbar-link' to='/profile'>Account</Link>
      <Link className='navbar-link' to='/piano'>Piano</Link>
      <button className='navbar-btn' onClick={() => set_visible(false)}><IoIosArrowUp /></button>
    </>
  )

  const guestLinks = (
    <>
      <Link className='navbar-link' to='/'>Company Name :)</Link>
      <Link className='navbar-link' to='/login'>Sign In</Link>
      <Link className='navbar-link' to='/register'>Sign Up</Link>
      <Link className='navbar-link' to='/piano'>Piano</Link>
      <button className='navbar-btn' onClick={() => set_visible(false)}><IoIosArrowUp /></button>
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
        { isAuthenticated ? authLinks : guestLinks }
      </div>
      {(!visible && visible != null) && <button className='navbar-btn' onClick={() => set_visible(true)}><IoIosArrowDown /></button>}
      
    </div>
  );
  }
  
  const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
  });

  export default connect(mapStateToProps, { logout })(Navbar);
  