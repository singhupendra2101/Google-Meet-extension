import React from 'react'
import classes from './login.module.css';

const Login = () => {
    return (
        <div>
            <h1>
                Login page
            </h1>

            <button className='my-btn text-xl'> Global btn </button>
            <button className={classes.loginBtn}>Login button</button>

        </div>
    )
}

export default Login;