import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';

import Overlay from 'react-bootstrap/Overlay';
import Button from 'react-bootstrap/Button';

import { submitLogin } from '../reducer';

import '../styles/login-overlay.css';

function LoginOverlay({ submitLogin }) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState(''); // TODO: ''
  const [password, setPassword] = useState('123123'); // TODO: ''

  const target = useRef(null);

  return (
    <div className="header-link">
      <a href="#" ref={target} onClick={() => setShow(!show)}>
        login
      </a>
      <Overlay target={target.current} show={show} placement="bottom" rootClose={true} onHide={() => setShow(false)}>
        {({
          arrowProps,
          show: _show,
          ...props
        }) => {
          return (
            <form
              {...props}
              className="login-overlay-container"
              style={{
                ...props.style,
                left: '-36px',
              }}
            >
              <div>
                <div className="test">email</div>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  name="email"
                />
              </div>
              <div>
                <div>password</div>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  type="password"
                  name="password"
                />
              </div>
              <div>
                <Button onClick={() => submitLogin(email, password)}>
                submit
                </Button>
              </div>
            </form>
          )
        }}
      </Overlay>
    </div>
  );
}

const mapStateToProps = state => {
  const { user } = state;

  return {
    user,
  };
};

const mapDispatchToProps = {
  submitLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginOverlay);

