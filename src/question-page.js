import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { useHistory } from "react-router-dom";
import ReconnectingWebSocket from 'reconnecting-websocket';

import { fetchQuestion, setNextVotingRound } from './reducer';

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
    text: '',
    name: '',
    rankedScoreArr: null,
    votingRoundEndTime: null,
  };

  submitVote = () => {
    const { question } = this.props;
    const { name, text } = this.state;
    const str = `${name} ${text} ${question.id.toString()}`;
    this.ws.send(str);
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
      setNextVotingRound,
        match: { params: { questionId } },
        // question,
        user,
      } = this.props;

    fetchQuestion(questionId);

    // this.ws = new ReconnectingWebSocket(`ws://127.0.0.1:9001?question=${questionId}&user=${user.id}`);
    this.ws = new ReconnectingWebSocket(`wss://hivemind-ws.herokuapp.com?question=${questionId}&user=${user.id}`);

    this.ws.onmessage = ({ data }) => {
      // Maybe combine startitbro and votenextwordbro to just update question
      const isObject = data.indexOf('}') !== -1;

      if (isObject) {
        const obj = JSON.parse(data.slice(0, data.indexOf('}') + 1)); // cut off weird byte strings at end :/
        const { votingRoundEndTime } = obj;
        if (obj.start) {
          this.setState({ votingRoundEndTime });
        } else if (obj.winningWord) {
          if (obj.winningWord === '<END_SENTENCE>') {
            console.log('end of voting')
          } else {
            console.log('setting next round')
            console.log('setting next round')
            console.log('setting next round')
            setNextVotingRound(obj.winningWord);
            this.setState({ votingRoundEndTime });
          }
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
  }

  render() {
    const { question } = this.props;

    if (!question) {
      return (<div>loading...</div>);
    } else {
      const votingRoundEndTime = this.state.votingRoundEndTime || question.voting_round_end_time;
      let secondsLeft = '';

      if (votingRoundEndTime) {
        secondsLeft = Math.floor((new Date(votingRoundEndTime).getTime() - Date.now()) / 1000);
      }

      const startTime = new Date(question.start_time);
      const questionIsActive = Date.now() >= startTime;

      return (
        <div>
          <div>{secondsLeft > 0 ? secondsLeft : question.end_time ? 'Voting done': 'Loading next round...'}</div>
          <br/>
          <p>
            {question.question_text}
          </p>

          <br/>
          <div>~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</div>
          <div>{question.answer}</div>
          <div>~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</div>
          <br/>

          { questionIsActive ? this.renderVoting(secondsLeft) : this.renderTooEarly() }

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
        <div>use {`<END_SENTENCE>`} to vote for answer being finished</div>
        <br/>
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
        <button onClick={this.submitVote} disabled={secondsLeft <= 0}>
          submit
        </button>
        <br/>
        <br/>

        {!question.end_time && this.renderScores()}

      </div>
    );
  }

  renderTooEarly() {
    return (<div>Little early bud</div>);
  }

  renderScores() {
    const { rankedScoreArr } = this.state;
    return rankedScoreArr && rankedScoreArr.map(([a, b], idx) => (
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
  setNextVotingRound,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPage);
