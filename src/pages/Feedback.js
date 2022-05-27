import React from 'react';
import Header from '../component/Header';

class Feedback extends React.Component {
  render() {
    return (
      <div>
        <h1 data-testid="feedback-text">Feedback</h1>
        <Header />
      </div>

    );
  }
}

export default Feedback;
