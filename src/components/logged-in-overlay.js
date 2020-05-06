import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";

import Overlay from 'react-bootstrap/Overlay';
import Button from 'react-bootstrap/Button';

import { logout } from '../reducer';

import '../styles/login-overlay.css';

function LoggedInOverlay({ logout, user }) {
  const [show, setShow] = useState(false);
  const history = useHistory();

  const target = useRef(null);

  return (
    <div>
      <a href="#" ref={target} onClick={() => setShow(!show)}>
        {user.email}
      </a>
      <Overlay target={target.current} show={show} placement="bottom" rootClose={true} onHide={() => setShow(false)}>
        {({
          arrowProps,
          show: _show,
          ...props
        }) => {
          return (
            <div
              {...props}
              className="login-overlay-container"
              style={{
                ...props.style,
              }}
            >
              <div><a href="#" onClick={() => logout()}>logout</a></div>
              <div><a href="/question/new">href new q</a></div>
              <div><a href="#" onClick={() => history.push('/question/new')}>push new q</a></div>
            </div>
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
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoggedInOverlay);

