import { Link } from "react-router-dom";
import './Navbar.css';

function Navbar() {
    return (
      <div id='navbar'>
        <Link className='navbar-link' to='/'>Company Name :)</Link>
        <Link className='navbar-link' to='/'>Sign Out</Link>
        <Link className='navbar-link' to='/'>Create Post</Link>

      </div>
    );
  }
  
  export default Navbar;
  