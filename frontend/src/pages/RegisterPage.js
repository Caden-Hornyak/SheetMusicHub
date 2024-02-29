import React, { useState } from 'react'
import { connect } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import { register } from '../actions/auth.js';
import CSRFToken from '../components/CSRFToken.js';

import './RegisterPage.css';
import background from '../images/auth_background.jpg';

const Register = ({ register }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        re_password: ''
    });

    const [accountCreated, setAccountCreated] = useState(false);
    const { username, password, re_password } = formData;

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {

        e.preventDefault();

        if (password === re_password) {

            register(username, password, re_password);
        }
    }

    if (accountCreated)
        return <Navigate to='/' />

    return(
        <>
            <img id="background" src={background}></img>
            <div className='register-wrapper'>
                <h1>Register</h1>
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
                    <div className='form-group'>
                        <input 
                            className='form-control'
                            type='password'
                            placeholder='Confirm Password*'
                            name='re_password'
                            onChange={e => onChange(e)}
                            value={re_password}
                            minLength='6'
                            required
                            />
                        
                    </div>
                    <button className='btn' type='submit'>Register</button>
                </form>
                <p>
                    Already have an account? <Link to='/login'>Sign In </Link>
                </p>
            </div>
        </>
    );
}

export default connect(null, {register})(Register);