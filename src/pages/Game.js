import React from 'react';
import PropTypes from 'prop-types';
import getAsk from '../services/getAsk';

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

  render() {
    const { trivia, index } = this.state;
    return (
      <div>
        <h1>Game</h1>
        { trivia.length !== 0 && (
          <div>
            <p data-testid="question-text">trivia[index].question</p>
            <p data-testid="question-category">
              {trivia[index].category}
            </p>
          </div>

        ) }

      </div>

    );
  }
}
Game.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
};
export default Game;
