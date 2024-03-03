import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Navigate, useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';


const ProfilePage = ({ isAuthenticated }) => {
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            if (!isAuthenticated) {
                return navigate('/')
            }
        
          })()
        
    }, [isAuthenticated])

    

  return (
    <>
        <Navbar />
        <div>Update Profile :)</div>
    </>
  )
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(ProfilePage)