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
      currentQuestion: 0,
      disabledQuestion: false,
      timer: 30,
      correctAnswersIndex: [],
      allAnswers: [],
    };
  }

  async componentDidMount() {
    await this.getTrivia();
    this.setTimer();
    this.setAnswers();
  }

  getTrivia = async () => {
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
  }

  setTimer = () => {
    const { timer } = this.state;
    const oneSecond = 1000;
    let counter = timer;
    const intervalId = setInterval(() => {
      this.setState((prevState) => ({
        timer: prevState.timer - 1,
      }));
      counter -= 1;
      if (counter === 0) {
        clearInterval(intervalId);
        this.setState({ disabledQuestion: true });
      }
    }, oneSecond);
  }

  setAnswers = () => {
    const { trivia } = this.state;
    const correctAnswersIndex = [];
    trivia.forEach((question) => {
      const max = question.incorrect_answers.length;
      const random = Math.floor(Math.random() * (max - 0 + 1) + 0);
      correctAnswersIndex.push(random);
    });

    const allAnswers = [];
    trivia.forEach((question, index) => {
      const wrongAnswers = question.incorrect_answers;
      wrongAnswers.splice(correctAnswersIndex[index], 0, question.correct_answer);
      allAnswers.push(wrongAnswers);
    });

    this.setState({ correctAnswersIndex, allAnswers });
  }

  renderAnswers = () => {
    const {
      correctAnswersIndex,
      allAnswers,
      currentQuestion,
      disabledQuestion,
    } = this.state;
    const correct = correctAnswersIndex[currentQuestion];
    return (
      allAnswers[currentQuestion]
        .map((answer, ind) => (
          <button
            key={ ind }
            type="button"
            data-testid={ this.dataTestAnswer(ind, correct) }
            className={ this.btnStyle(ind, correct) }
            onClick={ () => this.setState({ disabledQuestion: true }) }
            disabled={ disabledQuestion }
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
    const { disabledQuestion } = this.state;
    if (disabledQuestion && index === correct) return 'correct-btn';
    if (disabledQuestion && index !== correct) return 'incorrect-btn';
  }

  render() {
    const { trivia, currentQuestion, timer, allAnswers } = this.state;
    return (
      <div>
        <Header />
        <p>{ timer }</p>
        { allAnswers.length !== 0 && (
          <div>
            <p data-testid="question-text">{ trivia[currentQuestion].question }</p>
            <p data-testid="question-category">
              {trivia[currentQuestion].category}
            </p>
            <div data-testid="answer-options">
              { this.renderAnswers() }
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
