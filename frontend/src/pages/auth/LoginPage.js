import React, { useState, useEffect } from 'react'
import { login } from '../../actions/auth.js';
import { Navigate, Link } from 'react-router-dom';
import CSRFToken from '../../components/CSRFToken.js';
import { connect } from 'react-redux';

import './Auth.css';
import background from '../../images/auth_background.jpg';

const LoginPage = ({ login }) => {
    const [formData, setFormData] = useState({
      username: '',
      password: '',
  });

  const [loggedin, setLoggedin] = useState(false);
  const { username, password} = formData;

  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {

      e.preventDefault();

      login(username, password)
      setLoggedin(true);
  }

  if (loggedin) {
      return <Navigate to='/' />
  }

  return(
    <>
      <img id="background" src={background}></img>
      <div className='register-wrapper'>
          <h1>Login</h1>
          <form onSubmit={e => onSubmit(e)}>
            <CSRFToken />
              <div className='form-group'>
                  <input 
                      className='form-control'
                      type='text'
                      placeholder='Username*'
                      name='username'
                      onChange={e => onChange(e)}
                      value={username}
                      required
                      />
                  
              </div>
              <div className='form-group'>
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
                  
              </div>

              <button className='btn' type='submit'>Login</button>
          </form>
          <p>
              Don't have an account? <Link to='/register'>Register</Link>
          </p>
      </div>
    </>
  );
}

export default connect(null, { login })(LoginPage)