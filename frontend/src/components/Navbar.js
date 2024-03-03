import { Link } from "react-router-dom";
import './Navbar.css';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';

function Navbar( { isAuthenticated, logout }) {
  const authLinks = (
    <>
      <Link className='navbar-link' to='/'>Company Name :)</Link>
      <Link className='navbar-link' to='/' onClick={logout} >Sign Out</Link>
      <Link className='navbar-link' to='/create-post'>Create Post</Link>
      <Link className='navbar-link' to='/profile'>Account</Link>
    </>
  )

  const guestLinks = (
    <>
      <Link className='navbar-link' to='/'>Company Name :)</Link>
      <Link className='navbar-link' to='/login'>Sign In</Link>
      <Link className='navbar-link' to='/register'>Sign Up</Link>
    </>
  )

  return (
    <div id='navbar'>
      { isAuthenticated ? authLinks : guestLinks }
    </div>
  );
  }
  
  const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
  });

  export default connect(mapStateToProps, { logout })(Navbar);
  