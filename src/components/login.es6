// https://auth0.com/docs/quickstart/spa/react/01-login
import React, { PropTypes as T } from 'react'
import {ButtonToolbar, Button} from 'react-bootstrap'
import AuthService from '../shared/authService.es6'
import { Jumbotron } from 'react-bootstrap'

export class Login extends React.Component {
    render() {
        console.log("==== props = ", this.props);
        // const { auth } = this.props.route.auth;
        const authSvc = this.props.route.authSvc;
        console.log("==== authSvc=", authSvc);
        return (
            <Jumbotron>
                <h2 className={{"text-align": "center"}}>
                    <img src="https://cdn.auth0.com/styleguide/1.0.0/img/badge.svg" />
                </h2>
                <div className="jumbotron">
                    <h2>Login</h2>
                    <ButtonToolbar style={{display: "inline-block"}}>
                        <Button bsStyle="primary" onClick={authSvc.logIn.bind(this)}>Login</Button>
                    </ButtonToolbar>
                </div>
            </Jumbotron>
        )
    }
}

Login.propTypes = {
        location: T.object,
        authSvc: T.instanceOf(AuthService)
    };

export default Login;