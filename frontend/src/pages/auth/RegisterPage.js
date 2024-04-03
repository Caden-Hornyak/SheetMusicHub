import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Navigate, Link } from 'react-router-dom'
import { register_normal_pass, register_piano_pass } from '../../actions/auth.js'
import CSRFToken from '../../components/utility/CSRFToken.js'

import './Auth.css';
import background from '../../images/merry_background.png'
import Piano from '../../components/piano/Piano.js'
import { IoMdCheckmark } from "react-icons/io"
import Navbar from '../../components/utility/Navbar.js'
import { FaXmark } from "react-icons/fa6"


const Register = ({ register_normal_pass, register_piano_pass }) => {
    const [form_data, set_form_data] = useState({
        username: '',
        password: '',
        re_password: ''
    })

    let [account_created, set_account_created] = useState(false)
    let [piano_pass_active, set_piano_pass_active] = useState(true)
    let [piano_password, set_piano_password] = useState(null)
    let [piano_vis, set_piano_vis] = useState(false)
    let { username, password, re_password } = form_data

    useEffect(() => {
        set_piano_vis(false)
    }, [piano_password])

    const onChange = e => set_form_data({...form_data, [e.target.name]: e.target.value })

    const onSubmit = e => {

        e.preventDefault()
        if (piano_pass_active) {
            if (piano_password && piano_password.length === 2 && piano_password[0].length === piano_password[1].length) {
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
            return false
        }
        const array1 = arr1.slice().sort()
        const array2 = arr2.slice().sort()
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                return false
            }
        }
        return true
    }


    if (account_created) {
        return <Navigate to='/login' />
    }


    return(
        <>
            <Navbar />
            <div id='register-page'>
                <div id='register-piano-wrapper' style={{display: piano_vis ? 'flex' : 'none' }}>
                    <button className='x-btn' onClick={() => set_piano_vis(false)}><FaXmark /></button>
                    <div id='background-darkener' onClick={() => set_piano_vis(false)} ></div>
                    <div id='register-piano'>
                        <Piano type='register' set_product={set_piano_password} visible={piano_vis} />
                    </div>
                </div>
                <img id="background" src={background}></img>
                <div id='register-form-wrapper'>
                    
                    <div className='register-wrapper'>
                        <h1>Register</h1>
                        <form className='auth-form' onSubmit={e => onSubmit(e)}>
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
                            {piano_pass_active && <button className='def-btn' onClick={() => set_piano_vis(true)} disabled={piano_password !== null}
                            type='button' >{piano_password ? <IoMdCheckmark /> : 'Create Piano Password'}</button>}
                            {(piano_pass_active && piano_password) && <button onClick={() => set_piano_password(null)} id='clearpass-btn'>Clear Password</button>}
                            {piano_pass_active && <button className='pass-switch-btn' onClick={() => set_piano_pass_active(false)} type='button' >Use Boring Password</button>}
                            {!piano_pass_active && <button className='pass-switch-btn' onClick={() => set_piano_pass_active(true)} type='button' >Use Piano Password</button>}
                            <button className='def-btn' type='submit' disabled={
                            piano_pass_active ? (!piano_password || !form_data.username) : (!form_data.password || !form_data.re_password || !form_data.username)}>Register</button>
                            
                        </form>
                        
                        <p>
                            Already have an account? <Link to='/login'>Sign In </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default connect(null, {register_normal_pass, register_piano_pass})(Register);