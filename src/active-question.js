import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { useHistory } from "react-router-dom";
import ReconnectingWebSocket from 'reconnecting-websocket';
import { fetchQuestion, setNextVotingRound } from './reducer';
import './active-question-styles.css';

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

class ActiveQuestion extends Component {
  state = {
    rankedScoreArr: null,
    text: '',
    votingRoundEndTime: null,
  };

  submitTypedVote = () => {
    this.submitVote(this.state.text);
  };

  submitVote = text => {
    const { question, user } = this.props;

    if (!this.ws) { return }

    const str = `${user.id} ${text} ${question.id.toString()}`;
    this.ws.send(str);
    this.setState({ text });
  };

  connectToWebsocket = () => {
    const {
      setNextVotingRound,
      question,
    } = this.props;

    this.ws = new ReconnectingWebSocket(`${wsUrl}?question=${question.id}`);

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
      question,
    } = this.props;

    // fetchQuestion(question.id);

    // if (question && !question.endTime) {
      this.connectToWebsocket();
    // }
  };

  render() {
    const { question, user } = this.props;

    // if (!question) {
    //   return (<div>loading...</div>);
    // } else {
      const votingRoundEndTime = (this.state.votingRoundEndTime && Number(this.state.votingRoundEndTime)) || question.votingRoundEndTime;
      let secondsLeft = '';

      if (votingRoundEndTime) {
        secondsLeft = Math.ceil((new Date(votingRoundEndTime).getTime() - Date.now()) / 1000);
      }

      const startTime = new Date(question.startTime);
      const questionIsActive = Date.now() >= startTime;

      return (
        <div>
          { !questionIsActive && this.renderTooEarly(secondsLeft) }
          { questionIsActive && !question.endTime && (secondsLeft > 0 ? secondsLeft : 'Loading next round...') }
          { question.endTime && 'Voting done' }
          <br/>
          <div className="label">Question</div>
          <div className="big-text">{question.questionText}</div>
          <div className="label">Answer</div>
          <div className="big-text">{question.answer} {!question.endTime && (
            <div className="word-scores">
              { this.renderScores() }
            </div>
          )}</div>
          <br/>

          { questionIsActive && user && this.renderVoting(secondsLeft) }

        </div>
      );
    // }
  }

  renderVoting(secondsLeft) {
    const { question } = this.props;

    if (question.endTime) {
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

  renderTooEarly(secondsLeft) {
    const oneDay = 60 * 60 * 24;
    if (Number(secondsLeft) < oneDay) {
      const text = window.moment().hour(0).minute(0).second(Number(secondsLeft)).format('HH:mm:ss');
      return (<div>Voting starts in: {text}</div>);
    } else {
      const text = window.moment(new Date().getTime() + (Number(secondsLeft) * 1000)).calendar();
      return (<div>Voting starts: {text}</div>);
    }
  }

  renderScores() {
    const { user } = this.props;
    const { rankedScoreArr } = this.state;
    return rankedScoreArr && rankedScoreArr.map(([word, score], idx) => (
      <div key={idx}>
        <span
          className="scored-word"
          onClick={() => user && this.submitVote(word)}
          style={{
            cursor: user ? 'pointer' : 'default',
          }}
        >
          {word === '(complete-answer)' ? '✅' : word}
        </span>{/*: {score}*/}
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

export default connect(mapStateToProps, mapDispatchToProps)(ActiveQuestion);
