import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import { register_normal_pass, register_piano_pass } from '../../actions/auth.js';
import CSRFToken from '../../components/CSRFToken.js';

import './Auth.css';
import background from '../../images/auth_background.jpg';
import Piano from '../../components/Piano/Piano.js'
import { IoMdCheckmark } from "react-icons/io";

const Register = ({ register }) => {
    const [form_data, set_form_data] = useState({
        username: '',
        password: '',
        re_password: ''
    });

    let [account_created, set_account_created] = useState(false);
    let [piano_pass_active, set_piano_pass_active] = useState(true)
    let [piano_password, set_piano_password] = useState(null)
    let [piano_vis, set_piano_vis] = useState(false)
    let { username, password, re_password } = form_data;

    const onChange = e => set_form_data({...form_data, [e.target.name]: e.target.value });

    const onSubmit = e => {

        e.preventDefault();
        if (piano_pass_active) {
            if (piano_password && piano_password.length === 2 && piano_password[0].length === piano_password[1].length) {
                for (let i = 0; i < piano_password[0].length; i++) {
                    if (!compare_arrays(piano_password[0][i][0].sort(), piano_password[1][i][0])) {
                        console.log(piano_password[0][i][0].sort(), piano_password[1][i][0].sort())
                        alert('Piano Passwords Do Not Match')
                        set_piano_password(null)
                        return
                    }
                }   
                // TODO fix this not calling thing
                register_piano_pass(username, piano_password)
                set_account_created(true)

            } else {
                alert('Piano Password Invalid :(')
                set_piano_password(null)
            }
        } else {
            if (password === re_password) {
                register_normal_pass(username, password, re_password)
                set_account_created(true)
            } else {
                alert("Normal Passwords do Not Match")
            }
            
        }
    }

    function compare_arrays(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        const array1 = arr1.slice().sort();
        const array2 = arr2.slice().sort();
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }
        return true;
    }

    useEffect(() => {
        if (piano_password) {
            set_piano_vis(false)
        }
    }, [piano_password])

    if (account_created) {
        return <Navigate to='/login' />
    }

    const render_piano = (vis) => {
        if (vis) {
            set_piano_vis(true)
        }
    }

    

    return(
        <div>
            {piano_vis &&
            <div id='register-piano-wrapper' >
                <div id='background-darkener' onClick={() => set_piano_vis(false)} ></div>
                <button></button>
                <div id='register-piano'>
                    <Piano type='register' set_product={set_piano_password}/>
                </div>
            </div>
            }
            <div id='register-form-wrapper'>
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
                        {!piano_pass_active && <div className='form-group'>
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
                            
                        </div>}

                        {/* Cond. btns for norm pass and piano pass */}
                        {piano_pass_active && <button className='btn' onClick={() => render_piano(true)} type='button' disabled={piano_password} >{piano_password ? <IoMdCheckmark /> : 'Create Piano Password'}</button>}
                        {(piano_pass_active && piano_password) && <button onClick={() => set_piano_password(null)} >Clear Password</button>}
                        {/* {(piano_pass_active && piano_password) && <div>IoMdCheckmark</div>} */}
                        <button className='btn' type='submit' disabled={
                        piano_pass_active ? (!piano_password || !form_data.username) : (!form_data.password || !form_data.re_password || !form_data.username)}>Register</button>
                        {piano_pass_active && <button onClick={() => set_piano_pass_active(false)} type='button' >Use Normal Password</button>}
                        {!piano_pass_active && <button onClick={() => set_piano_pass_active(true)} type='button' >Use Piano Password</button>}
                    </form>
                    
                    <p>
                        Already have an account? <Link to='/login'>Sign In </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default connect(null, {register_normal_pass, register_piano_pass})(Register);