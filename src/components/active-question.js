import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReconnectingWebSocket from 'reconnecting-websocket';

import '../styles/active-question.css';

import AdminOnlyLink from './admin-only-link';

import { setActiveHiveCount, setNextVotingRound } from '../reducer';

const wsUrl = 'ws://localhost:9001';
// const wsUrl = 'ws://hivemind-ws.herokuapp.com';

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
    const { activeQuestion, user } = this.props;

    if (!this.ws) { return }

    const str = `${user.id} ${text} ${activeQuestion.id}`;
    this.ws.send(str);
    this.setState({ text });
  };

  connectToWebsocket = () => {
    const {
      setActiveHiveCount,
      setNextVotingRound,
      activeQuestion,
      user,
    } = this.props;

    const authToken = localStorage.getItem('authToken');
    if (this.ws) {
      this.ws.close();
    }
    this.ws = new ReconnectingWebSocket(`${wsUrl}?question=${activeQuestion.id}&user=${user && user.id}&auth=${authToken}`);

    this.ws.onmessage = ({ data }) => {
      const isObject = data.indexOf('}') !== -1;

      if (isObject) {
        const obj = JSON.parse(data.slice(0, data.indexOf('}') + 1)); // cut off weird byte strings at end :/
        const { votingRoundEndTime } = obj;
        if (obj.start) {
          // START MESSAGE
          this.setState({ votingRoundEndTime });
        } else if (typeof obj.winningWord === 'string') {
          // END OF VOTING ROUND MESSAGE
          if (obj.winningWord === '(complete-answer)') {
            console.log('end of voting')
          } else {
            console.log('setting next round')
          }
          setNextVotingRound(obj.winningWord);
          this.setState({
            votingRoundEndTime,
            text: '',
            rankedScoreArr: null
          });
        } else if (obj.scores) {
          // SCORE COMING IN MESSAGE
          const rankedScoreArr = [];

          for (let i = 0; i < obj.scores.length; i += 2) {
            rankedScoreArr.push([obj.scores[i], obj.scores[i+1]]);
          }

          setActiveHiveCount(obj.activeHiveCount);
          this.setState({ rankedScoreArr });

        }
      // } else if (data.indexOf(']') !== -1) {
      //   const scoreArr = JSON.parse(data.slice(0, data.indexOf(']') + 1));
      }
    };
  };

  componentWillUnmount() {
    clearInterval(this.refreshTimer);
    this.ws.close();
  }

  componentDidMount() {
    clearInterval(this.refreshTimer);

    this.refreshTimer = setInterval(() => {
      this.forceUpdate();
    }, 1000);

    this.connectToWebsocket();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.user && this.props.user) {
      this.connectToWebsocket();
    }
  }

  render() {
    const { activeQuestion, user } = this.props;
    const { rankedScoreArr } = this.state;

    const votingRoundEndTime = (this.state.votingRoundEndTime && Number(this.state.votingRoundEndTime)) || activeQuestion.votingRoundEndTime;
    let secondsLeft = '';

    if (votingRoundEndTime) {
      secondsLeft = Math.ceil((new Date(votingRoundEndTime).getTime() - Date.now()) / 1000);
    }

    const startTime = new Date(activeQuestion.startTime);
    const questionHasStarted = Date.now() >= startTime;
    const winningWord = rankedScoreArr && rankedScoreArr[0] && rankedScoreArr[0][0];

    return (
      <div>
        <div className="voting-status">
          { !activeQuestion.endTime && !questionHasStarted && this.renderTooEarly(secondsLeft) }
          { !activeQuestion.endTime && questionHasStarted && (secondsLeft > 0 ? secondsLeft : 'Loading next round...') }
          { activeQuestion.endTime && 'Voting done' }
        </div>

        <div className="label">
          <AdminOnlyLink to={`/question/${activeQuestion.id}`}>Question</AdminOnlyLink>
        </div>
        <div className="big-text">{activeQuestion.questionText}</div>
        <div className="label">Answer</div>
        <br/>
        { questionHasStarted && user && this.renderVotingActionEls(secondsLeft) }

        <div className="big-text">
          {activeQuestion.answer}{ !activeQuestion.endTime && (
            <div className="word-scores">
              { questionHasStarted && winningWord !== '(complete-answer)' && <span className="winning-word-underline"></span> }
              { this.renderScores() }
            </div>
          )}
        </div>

      </div>
    );
  }

  renderVotingActionEls(secondsLeft) {
    const { activeQuestion } = this.props;

    if (activeQuestion.endTime) {
      return null;
    }

    return (
      <div>
        your vote: <input
          onChange={e => this.setState({
            text: e.target.value.replace(/[^a-zA-Z]/g, '').toLowerCase(),
          })}
          value={this.state.text}
          maxLength={35}
          className="voting-action-el"
        />
        <button onClick={() => this.submitTypedVote()} disabled={secondsLeft <= 0} className="voting-action-el">
          submit
        </button>
        <button onClick={() => this.submitVote('(complete-answer)')} disabled={secondsLeft <= 0} className="voting-action-el">
          Vote complete ✓
        </button>
      </div>
    );
  }

  renderTooEarly(secondsLeft) {
    const oneDay = 60 * 60 * 24;
    if (Number(secondsLeft) < oneDay) {
      const text = window.moment().hour(0).minute(0).second(Number(secondsLeft)).format('HH:mm:ss');
      return `Voting starts in ${text}`;
    } else {
      const text = window.moment(new Date().getTime() + (Number(secondsLeft) * 1000)).calendar();
      return `Voting starts ${text}`;
    }
  }

  renderScores() {
    const { user } = this.props;
    const { rankedScoreArr } = this.state;
    // const rankedScoreArr = [['apple', '100'], ['banana', '95'], ['kiwi', '90'], ['grape', '80'], ['cherry', '70'], ['orange', '60'], ['mango', '50'], ['raspberry', '40'], ['pear', '30'], ['guava', '20'], ['pineapple', '10']];
    if (!rankedScoreArr || !rankedScoreArr.length) return null;

    let topScore = Number(rankedScoreArr[0][1]);

    return rankedScoreArr && rankedScoreArr.map(([word, score], idx) => {
      let opacity = 0.95 * (Number(score) / topScore);

      if (opacity < 0.15) { opacity = 0.15; }

      return (
        <div key={idx}>
          <span
            className="scored-word"
            onClick={() => user && this.submitVote(word)}
            style={{
              cursor: user ? 'pointer' : 'default',
              color: `rgba(33,37,41, ${opacity}`,
              // textDecoration: idx === 0 ? 'underline' : null,
            }}
          >
            {word === '(complete-answer)' && idx === 0 ? '' : (<span>&nbsp;</span>)}
            {word === '(complete-answer)' ? '.' : word}
          </span>
        </div>
      );
    });
  }

}

const mapStateToProps = state => {
  const { user, activeQuestion } = state;

  return {
    user,
    activeQuestion
  };
};

const mapDispatchToProps = {
  setNextVotingRound,
  setActiveHiveCount,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveQuestion);
