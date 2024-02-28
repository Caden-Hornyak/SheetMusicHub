import { Link } from "react-router-dom";

function Navbar() {
    return (
      <div className='navbar'>
        <Link to='/'>Sign Out</Link>
        <Link to='/'>Create Post</Link>

      </div>
    );
  }
  
  export default Navbar;
  