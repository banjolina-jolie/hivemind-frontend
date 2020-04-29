import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { useHistory } from "react-router-dom";
import ReconnectingWebSocket from 'reconnecting-websocket';

import { fetchQuestion, setNextVotingRound } from './reducer';

import './question-page-styles.css';

const wsUrl = 'ws://localhost:9001';
// const wsUrl = 'ws://hivemind-ws.herokuapp.com';

// function NavButton() {
//   const history = useHistory();
//   return (
//     <button onClick={() => {
//       history.push('/');
//     }}>nav</button>
//   );
// }

class QuestionPage extends Component {
  state = {
    name: '',
    rankedScoreArr: null,
    text: '',
    votingRoundEndTime: null,
  };

  submitTypedVote = () => {
    this.submitVote(this.state.text);
  };

  submitVote = text => {
    const { question } = this.props;
    const { name } = this.state;

    if (!name || !this.ws) { return }

    const str = `${name} ${text} ${question.id.toString()}`;
    this.ws.send(str);
    this.setState({ text });
  };

  connectToWebsocket = () => {
    const {
      setNextVotingRound,
      match: { params: { questionId } },
    } = this.props;

    this.ws = new ReconnectingWebSocket(`${wsUrl}?question=${questionId}`);

    this.ws.onmessage = ({ data }) => {
      console.log(data)
      const isObject = data.indexOf('}') !== -1;

      if (isObject) {
        const obj = JSON.parse(data.slice(0, data.indexOf('}') + 1)); // cut off weird byte strings at end :/
        const { votingRoundEndTime } = obj;
        if (obj.start) {
          this.setState({ votingRoundEndTime });
        } else if (typeof obj.winningWord === 'string') {
          if (obj.winningWord === '(complete-answer)') {
            console.log('end of voting')
          } else {
            console.log('setting next round')
          }
          setNextVotingRound(obj.winningWord);
          this.setState({ votingRoundEndTime, text: '' });
          this.setState({ rankedScoreArr: null });
        }
      } else if (data.indexOf(']') !== -1) {
        // THIS IS THE SCORE COMING IN
        const scoreArr = JSON.parse(data.slice(0, data.indexOf(']') + 1));
        const rankedScoreArr = [];

        for (let i = 0; i < scoreArr.length; i += 2) {
          rankedScoreArr.push([scoreArr[i], scoreArr[i+1]]);
        }
        this.setState({ rankedScoreArr })
      }
    };
  };

  componentWillUnmount() {
    clearInterval(this.refreshTimer);
  }

  componentDidMount() {
    clearInterval(this.refreshTimer);

    this.refreshTimer = setInterval(() => {
      this.forceUpdate();
    }, 1000);

    const {
      fetchQuestion,
      match: { params: { questionId } },
      question,
    } = this.props;

    fetchQuestion(questionId);

    // if (question && !question.end_time) {
      this.connectToWebsocket();
    // }
  };

  render() {
    const { question } = this.props;

    if (!question) {
      return (<div>loading...</div>);
    } else {
      const votingRoundEndTime = (this.state.votingRoundEndTime && Number(this.state.votingRoundEndTime)) || question.voting_round_end_time;
      let secondsLeft = '';

      if (votingRoundEndTime) {
        secondsLeft = Math.ceil((new Date(votingRoundEndTime).getTime() - Date.now()) / 1000);
      }

      const startTime = new Date(question.start_time);
      const questionIsActive = Date.now() >= startTime;

      return (
        <div>
          {
            !question.end_time && (
              <div>
                your name: <input
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </div>
            )
          }
          <br/>
          { !questionIsActive && this.renderTooEarly() }
          <div>{question.end_time ? 'Voting done' : secondsLeft > 0 ? secondsLeft : 'Loading next round...'}</div>
          <br/>
          <p>
            <b>Q:</b> {question.question_text}
          </p>

          <br/>
          <div>
            <b>A:</b> {question.answer} {!question.end_time && (
              <div className="word-scores">
                { this.renderScores() }
              </div>
            )}
          </div>
          <br/>

          { questionIsActive && this.renderVoting(secondsLeft) }

        </div>
      );
    }
  }

  renderVoting(secondsLeft) {
    const { question } = this.props;

    if (question.end_time) {
      return null;
    }

    return (
      <div>
        <div>
          your vote: <input
            onChange={e => this.setState({ text: e.target.value })}
            value={this.state.text}
          />
        </div>
        <button onClick={() => this.submitTypedVote()} disabled={secondsLeft <= 0}>
          submit
        </button>
        <br/>
        <button onClick={() => this.submitVote('(complete-answer)')} disabled={secondsLeft <= 0}>
          Vote to complete answer ✓
        </button>
        <br/>
        <br/>

      </div>
    );
  }

  renderTooEarly() {
    return (<div>Voting starts in:</div>);
  }

  renderScores() {
    const { rankedScoreArr } = this.state;
    return rankedScoreArr && rankedScoreArr.map(([word, score], idx) => (
      <div key={idx}>
        <span
          className="scored-word"
          onClick={() => this.submitVote(word)}
        >
          {word === '(complete-answer)' ? '✅' : word}
        </span>: {score}
      </div>
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
  setNextVotingRound,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPage);
