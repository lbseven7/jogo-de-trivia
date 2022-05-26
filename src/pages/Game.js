import React from 'react';
import PropTypes from 'prop-types';
import getAsk from '../services/getAsk';
import Header from '../component/Header';
import '../App.css';

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      trivia: [],
      index: 0,
      answeredQuestion: false,
      timer: 30,
      random: false;
      randomPosition,
    };
  }

  async componentDidMount() {
    const { history } = this.props;
    const token = localStorage.getItem('token');
    if (token === null) history.push('/');
    const API_ASK = await getAsk(token);
    const tokenInvalid = 3;
    if (API_ASK.response_code === tokenInvalid) {
      localStorage.removeItem('token');
      history.push('/');
    }
    const tokenValid = 0;
    if (API_ASK.response_code === tokenValid) {
      this.setState({ trivia: API_ASK.results });
    }
    this.setTimer();
    this.randomPosition()
  }

  setTimer = () => {
    const { timer } = this.state;
    const oneSecond = 1000;
    const myInterval = setInterval(() => {
      this.setState((prevState) => ({
        timer: prevState.timer - 1,
      }), (myInterval) => if (timer === 0) clearInterval(myInterval));
    }, oneSecond);
  }

  randomPosition = () => {
    const { random, trivia } = this.state
    if (!random && trivia.lenght > 0) {
      const max = trivia[index].incorrect_answers.length;
      const randomPosition = Math.floor(Math.random() * (max - 0 + 1) + 0);
      this.setState({ randomPosition })
    }
  }

  answers = () => {
    const { trivia, index, answeredQuestion, randomPosition } = this.state;
    const multiple = 4;
    const totalAnswers = trivia[index].type === 'boolean' ? 2 : multiple;
    const answers = trivia[index].incorrect_answers;
    if (answers.length < totalAnswers) {
      answers.splice(randomPosition, 0, trivia[index].correct_answer);
    }
    return (
      answers
        .map((answer, i) => (
          <button
            key={ i }
            type="button"
            disabled={ answeredQuestion }
            data-testid={ this.dataTestAnswer(i, randomPosition) }
            onClick={ () => this.setState({ answeredQuestion: true }) }
            className={ this.btnStyle(i, randomPosition) }
          >
            { answer }
          </button>
        ))
    );
  }

  dataTestAnswer = (index, correct) => {
    if (index === correct) {
      return 'correct-answer';
    } if (index > correct) {
      return `wrong-answer-${index - 1}`;
    } return `wrong-answer-${index}`;
  }

  btnStyle = (index, correct) => {
    const { answeredQuestion } = this.state;
    if (answeredQuestion && index === correct) return 'correct-btn';
    if (answeredQuestion && index !== correct) return 'incorrect-btn';
  }

  render() {
    const { trivia, index, timer } = this.state;
    return (
      <div>
        <Header />
        <p>{ timer }</p>
        { trivia.length !== 0 && (
          <div>
            <p data-testid="question-text">{ trivia[index].question }</p>
            <p data-testid="question-category">
              {trivia[index].category}
            </p>
            <div data-testid="answer-options">
              { this.answers() }
            </div>
          </div>
        ) }
      </div>
    );
  }
}
Game.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
export default Game;
