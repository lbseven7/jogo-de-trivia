import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../component/Header';

class Feedback extends React.Component {
  showMessage = () => {
    const { answer } = this.props;
    const number = 3;
    if (answer < number) {
      return 'Could be better...';
    }
    return 'Well Done!';
  }

  render() {
    return (
      <div>
        <Header />
        <p data-testid="feedback-text">{this.showMessage()}</p>
      </div>

    );
  }
}
const mapStateToProps = (state) => ({
  answer: state.player.quantifyAnswer,
});
Feedback.propTypes = {
  answer: PropTypes.number,
}.isRequired;

export default connect(mapStateToProps)(Feedback);
