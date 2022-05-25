import React from 'react';
import PropTypes from 'prop-types';
import getToken from '../services/triviaToken';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
    };
  }

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  }

  loginBtnEnabled = () => {
    const { name, email } = this.state;
    if (name.length > 0 && email.length > 0) return false;
    return true;
  }

  loginBtnClick = async () => {
    const { history } = this.props;
    const token = await getToken();
    localStorage.setItem('token', token);
    history.push('/game');
  }

  settingsBtnClick = () => {
    const { history } = this.props;
    history.push('/settings');
  }

  render() {
    const { name, email } = this.state;
    return (
      <form>
        <input
          placeholder="nome"
          type="text"
          name="name"
          data-testid="input-player-name"
          value={ name }
          onChange={ this.handleChange }
        />
        <input
          placeholder="email"
          type="text"
          name="email"
          data-testid="input-gravatar-email"
          value={ email }
          onChange={ this.handleChange }
        />
        <button
          type="button"
          data-testid="btn-play"
          disabled={ this.loginBtnEnabled() }
          onClick={ this.loginBtnClick }
        >
          Play
        </button>
        <button
          type="button"
          data-testid="btn-settings"
          onClick={ this.settingsBtnClick }
        >
          Settings
        </button>
      </form>
    );
  }
}

export default Login;

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
