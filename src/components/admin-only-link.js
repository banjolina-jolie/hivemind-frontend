import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

function AdminOnlyLink({ user, to, children }) {
  if (user && user.isAdmin) {
    return ( <Link to={to}>{children}</Link> );
  } else {
    return ( <div>{children}</div> );
  }
}

const mapStateToProps = state => {
  const { user } = state;

  return {
    user,
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminOnlyLink);
