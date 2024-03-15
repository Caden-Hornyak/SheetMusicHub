import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Navbar.css';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";


function Navbar( { isAuthenticated, logout }) {
  let [visible, set_visible] = useState(true)

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

  return (
    <div id='navbar' style={{borderBox: visible ? 'box-shadow: 3px 3px 15px rgba(0, 0, 0, .8)': undefined}}>
      <div id='navbar-links' style={{top: visible ? '0' : '-100px'}}>
        { isAuthenticated ? authLinks : guestLinks }
      </div>
      {!visible && <button className='navbar-btn' onClick={() => set_visible(true)}><IoIosArrowDown /></button>}
      
    </div>
  );
  }
  
  const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
  });

  export default connect(mapStateToProps, { logout })(Navbar);
  