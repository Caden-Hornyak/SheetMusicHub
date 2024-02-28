import React, { useState } from 'react'
import { connect } from 'react-redux';
import { Redirect} from 'react-router-dom';
import { register } from '../actions/auth';

const Register = () => {
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
        return <Redirect to='/' />

    return(
        <div className='register-wrapper'>
            <h1> Please register for an account.</h1>
            <form onSubmit={e => onSubmit(e)}>
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
        
    );
}

export default connect(null,)(Register);