import React from 'react';
import { findAllByRole, findByText, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import { incorrectToken, correctToken } from './mock'
import App from '../App'

const INITIAL_STATE = { player: { 
  name: 'rafael',
  assertions: 0,
  score: 0,
  gravatarEmail: 'rafael@teste.com.br',
}}

localStorage.setItem('token', 'xpto')
afterEach(() => jest.clearAllMocks());

describe('1) Tests Game Page:', () => {
  it('renders all correct buttons, question and answers', async () => {

    const { history, debug } = renderWithRouterAndRedux(<App />, INITIAL_STATE, '/game');
    expect(history.location.pathname).toBe('/game');

    debug()
    // expect(question).toBeInTheDocument();

  });
});