import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';

import Overlay from 'react-bootstrap/Overlay';
import Button from 'react-bootstrap/Button';

import '../styles/login-overlay.css';

import { submitSignup } from '../reducer';

function SignupOverlay({ submitSignup }) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const target = useRef(null);

  return (
    <div className="header-link">
      <a href="#" ref={target} onClick={() => setShow(!show)}>
        signup
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
              className="login-overlay-container shit"
              style={{
                ...props.style,
                left: '-36px',
              }}
            >
              <div>
                <div className="test">email</div>
                <input
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  name="email"
                />
              </div>
              <div>
                <div>password</div>
                <input
                  onChange={e => setPassword(e.target.value)}
                  placeholder="password"
                  type="password"
                  name="password"
                />
              </div>
              <div>
                <div>confirm password</div>
                <input
                  onChange={e => setPasswordConfirmation(e.target.value)}
                  placeholder="confirm password"
                  type="password"
                  name="confirm-password"
                />
              </div>
              <div>
                <Button onClick={() => submitSignup({ email, password, passwordConfirmation })}>
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
  submitSignup,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupOverlay);

