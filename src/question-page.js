import React, { Component } from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
import ReconnectingWebSocket from 'reconnecting-websocket';

import { fetchQuestion } from './reducer';

function NavButton() {
  const history = useHistory();
  return (
    <button onClick={() => {
      history.push('/');
    }}>nav</button>
  );
}

class QuestionPage extends Component {
  state = {
    text: '',
    name: '',
    rankedScoreArr: [],
  };

  submitVote = () => {
    const { question } = this.props;
    const { name, text } = this.state;
    const str = `${name} ${text} ${question.id.toString()}`;
    this.ws.send(str);
  };

  componentDidMount() {
    const {
      fetchQuestion,
        match: { params: { questionId } },
        question,
        user,
      } = this.props;

    fetchQuestion(questionId);

    this.ws = new ReconnectingWebSocket(`ws://127.0.0.1:9001?question=${questionId}&user=${user.id}`);

    this.ws.onmessage = ({ data }) => {
      const scoreArr = JSON.parse(data.slice(0, data.indexOf(']') + 1));
      const rankedScoreArr = [];

      for (let i = 0; i < scoreArr.length; i += 2) {
        rankedScoreArr.push([scoreArr[i], scoreArr[i+1]]);
      }

      this.setState({ rankedScoreArr })
    };

    this.ws.onopen = function() { // thing to do on open
    };
  }

  render() {
    const { question, user } = this.props;

    return (
      <div className="">
        <header className="">
          <p>
            {question && question.question_text}
          </p>

          <div>
            name: <input
              onChange={e => this.setState({ name: e.target.value })}
            />
          </div>
          <div>
            text: <input
              onChange={e => this.setState({ text: e.target.value })}
            />
          </div>
          <button onClick={this.submitVote}>
            submit
          </button>

          { this.renderScores() }
        </header>
      </div>
    );
  }

  renderScores() {
    const { rankedScoreArr } = this.state;
    return rankedScoreArr.map(([a, b], idx) => (
      <div key={idx}>{a}: {b}</div>
    ));
  }

}

const mapStateToProps = state => {
  const { user, question } = state;

  return {
    user,
    question
  };
};

const mapDispatchToProps = {
  fetchQuestion,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPage);
