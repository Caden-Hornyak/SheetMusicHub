import React, { useState, useEffect } from 'react'
import { login_normal, login_piano } from '../../actions/auth.js';
import { Navigate, Link } from 'react-router-dom';
import CSRFToken from '../../components/CSRFToken.js';
import { connect, useSelector } from 'react-redux';

import './Auth.css';
import background from '../../images/auth_background.jpg';
import Piano from '../../components/Piano/Piano.js';
import { IoMdCheckmark } from "react-icons/io";

const LoginPage = ({ login_normal, login_piano }) => {
    const [form_data, set_form_data] = useState({
      username: '',
      password: '',
  });

  let [piano_pass_active, set_piano_pass_active] = useState(true)
  let [piano_password, set_piano_password] = useState(null)
  let [piano_vis, set_piano_vis] = useState(false)
  let [attempted, set_attempted] = useState(false)
  // const [logged_in, set_logged_in] = useState(false);
  let logged_in = useSelector(state => state.auth.isAuthenticated)
  
  const { username, password} = form_data;

  const onChange = e => set_form_data({...form_data, [e.target.name]: e.target.value });

  const onSubmit = async e => {

    e.preventDefault();

    if (piano_pass_active) {
      await login_piano(username, piano_password)
      set_attempted(true)
    } else {
      await login_normal(username, password)
      set_attempted(true)
    }
  }

  if (logged_in) {
    return <Navigate to='/' />
  }

  return(
    <>
    <img id="background" src={background}></img>
      <div id='register-piano-wrapper' style={{display: piano_vis ? 'block' : 'none' }}>
        <div id='background-darkener' onClick={() => set_piano_vis(false)} ></div>
        <button></button>
        <div id='register-piano'>
          <Piano type='login' set_product={set_piano_password} visible={piano_vis} />
        </div>
      </div>

      <div className='register-wrapper'>
        <h1>Login</h1>
        <form className='auth-form' onSubmit={e => onSubmit(e)} >
          <CSRFToken />
          {attempted && <p>Username or password is incorrect</p>}
          <div className='form-group'>
            <input 
              className='form-control'
              type='text'
              placeholder='Username'
              name='username'
              onChange={e => onChange(e)}
              value={username}
              required
              />
              
          </div>
          {!piano_pass_active && <div className='form-group'>
            <input 
              className='form-control'
              type='password'
              placeholder='Password*'
              name='password'
              onChange={e => onChange(e)}
              value={password}
              minLength='6'
              required
              />
          </div>}

          {piano_pass_active && <button className='def-btn' onClick={() => set_piano_vis(true)} type='button' disabled={piano_password} >{piano_password ? <IoMdCheckmark /> : 'Enter Piano Password'}</button>}
          {(piano_pass_active && piano_password) && <button onClick={() => set_piano_password(null)} >Clear Password</button>}

          {piano_pass_active && <button className='pass-switch-btn' onClick={() => set_piano_pass_active(false)} type='button' >Use Boring Password</button>}
          {!piano_pass_active && <button className='pass-switch-btn' onClick={() => set_piano_pass_active(true)} type='button' >Use Piano Password</button>}
          <button className='def-btn' type='submit' disabled={
          piano_pass_active ? (!piano_password || !form_data.username) : (!form_data.password || !form_data.username)}>Login</button>
        </form>
          <p>
              Don't have an account? <Link to='/register'>Register</Link>
          </p>
      </div>
    </>
  );
}

export default connect(null, { login_normal, login_piano })(LoginPage)