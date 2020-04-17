import React from 'react';
import './App.css';
import { connect } from 'react-redux';
// import { useHistory } from "react-router-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App({ user }) {
  // let history = useHistory();

  return (
    <div className="App">
      <header className="App-header">
        Shit
        <p>
          {JSON.stringify(user)}
        </p>
        {/*<button onClick={() => {
          console.log('app click')
          history.push('/foo');
        }}>nav</button>*/}
        <Link to="/foo">Foo</Link>
      </header>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
// export default App;
