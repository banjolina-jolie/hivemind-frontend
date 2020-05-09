import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import LoggedInOverlay from './logged-in-overlay';
import LoginOverlay from './login-overlay';

import { fetchUser } from '../reducer';

import '../styles/header.css';

class Header extends Component {

  componentDidMount() {
    const { fetchUser, user } = this.props;
    if (!user && localStorage.getItem('authToken')) {
      fetchUser();
    }
  }

  render() {
    const { centerContent, user } = this.props;

    return (
      <div className="app-header">
        <Link to="/">
          <b>Hivemind</b>
        </Link>

        <div>{centerContent}</div>

        {user ? <LoggedInOverlay /> : <LoginOverlay /> }
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state;

  return {
    user,
  };
};

const mapDispatchToProps = {
  fetchUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

