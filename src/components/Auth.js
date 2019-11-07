import React, { useContext } from 'react';
import AuthContext from '../auth-contex';

const Auth = (props) => {
    const auth = useContext(AuthContext);

    return <button onClick = {auth.login} >Login paps! </button>
};

export default Auth;