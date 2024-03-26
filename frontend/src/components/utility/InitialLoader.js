import React, { useEffect } from 'react'
import { checkAuthenticated } from '../../actions/auth';
import { load_user } from '../../actions/profile';
import { connect } from 'react-redux';

const InitialLoader = ({ checkAuthenticated, load_user }) => {
    useEffect(() => {
        checkAuthenticated();
        load_user();
    }, []);

  return (
    <></>
  )
}

export default connect(null, { checkAuthenticated, load_user })(InitialLoader)