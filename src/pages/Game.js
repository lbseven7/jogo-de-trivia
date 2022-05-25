import React from 'react';
import PropTypes from 'prop-types';
import getAsk from '../services/getAsk';
import Header from '../component/Header';

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      trivia: [],
      index: 0,
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
  }

  answers() {
    const { trivia, index } = this.state;
    const max = trivia[index].incorrect_answers.length;
    const correct = Math.floor(Math.random() * (max - 0 + 1) + 0);
    const answers = trivia[index].incorrect_answers;
    answers.splice(correct, 0, trivia[index].correct_answer);
    return (
      answers.map((answer, i) => (
        <button
          key={ i }
          type="button"
          data-testid={ this.dataTestAnswer(i, correct) }
        >
          { answer }
        </button>
      ))
    );
  }

  dataTestAnswer(i, correct) {
    if (i === correct) {
      return 'correct-answer';
    } if (i > correct) {
      return `wrong-answer-${i - 1}`;
    } return `wrong-answer-${i}`;
  }

  render() {
    const { trivia, index } = this.state;
    return (
      <div>
        <Header />
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
