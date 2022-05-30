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

describe('1) Tests Game Page:', () => {
  afterEach(() => jest.clearAllMocks());
  it('render game without local storage pushes to home', async () => {
    localStorage.removeItem('token');
    const { history } = renderWithRouterAndRedux(<App />, INITIAL_STATE, '/game');
    expect(history.location.pathname).toBe('/');
  });

  it('renders all correct buttons, question and answers', async () => {
    localStorage.setItem('token', 'correctToken')
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(correctToken)
    });
    const { history } = renderWithRouterAndRedux(<App />, INITIAL_STATE, '/game');
    
    expect(history.location.pathname).toBe('/game');
    const firstQuestion = await screen.findByText(/What is the name of the capital of Turkey/i)
    const correctAnswer = screen.getByText(/ankara/i)
    const incorrectAnswer = screen.getByText(/Istanbul/i)
    const timer = screen.getByText(/30/i)

    expect(firstQuestion).toBeInTheDocument();
    expect(correctAnswer).toBeInTheDocument();
    expect(incorrectAnswer).toBeInTheDocument();
    expect(timer).toBeInTheDocument();
  });

  it('directs to home if token is incorrect', () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(incorrectToken)
    });
    const { history } = renderWithRouterAndRedux(<App />, INITIAL_STATE, '/game');
    

  });

  it('renders next button', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(correctToken)
    });
    renderWithRouterAndRedux(<App />, INITIAL_STATE, '/game');
    const correctAnswer = await screen.findByText(/Istanbul/i)
    userEvent.click(correctAnswer)
    const btnNext = screen.getByRole('button', { name: /next/i})
    expect(btnNext).toBeInTheDocument();

  });

  it('after last question pushes to feedback page', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(correctToken)
    });
    const { history, debug } = renderWithRouterAndRedux(<App />, INITIAL_STATE, '/game');
    const answerOne = await screen.findByText(/Istanbul/i)
    userEvent.click(answerOne)
    const btnNextOne = screen.getByRole('button', { name: /next/i})
    userEvent.click(btnNextOne)

    const answerTwo = screen.getByText(/Croix Meridies/i)
    userEvent.click(answerTwo)
    const btnNextTwo = screen.getByRole('button', { name: /next/i})
    userEvent.click(btnNextTwo)

    const answerTree = screen.getByText(/Sea Wasp/i)
    userEvent.click(answerTree)
    const btnNextTree = screen.getByRole('button', { name: /next/i})
    userEvent.click(btnNextTree)

    const answerFour = screen.getByText(/Eurasian Plate/i)
    userEvent.click(answerFour)
    const btnNextFour = screen.getByRole('button', { name: /next/i})
    userEvent.click(btnNextFour)

    const answerFive = screen.getByText(/Sayori/i)
    userEvent.click(answerFive)
    const btnNextFive = screen.getByRole('button', { name: /next/i})
    userEvent.click(btnNextFive)

    expect(history.location.pathname).toBe('/feedback');
    const feedbackText = screen.getByText(/Could be better.../i)
    expect(feedbackText).toBeInTheDocument();
  
  })

  it('after last question pushes to feedback page', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(correctToken)
    });
    renderWithRouterAndRedux(<App />, INITIAL_STATE, '/game');
    const correctAnswer = await screen.findByTestId('correct-answer')
    userEvent.click(correctAnswer)
    const btnNext = screen.getByRole('button', { name: /next/i})
    userEvent.click(btnNext)
    const score = await screen.findByTestId('header-score')
    expect(score).toHaveTextContent('70')  
  })

  it('next button is on screen after 40 seconds', async () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(correctToken)
    });
    const { debug } = renderWithRouterAndRedux(<App />, INITIAL_STATE, '/game');
    
    const firstQuestion = await screen.findByText(/What is the name of the capital of Turkey/i)    
    jest.advanceTimersByTime(30000);
    const btnNext = screen.getByRole('button', { name: /next/i})
    expect(btnNext).toBeInTheDocument();
  });

  it('timer is 29 after one second', async () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(correctToken)
    });
    const { debug } = renderWithRouterAndRedux(<App />, INITIAL_STATE, '/game');
    
    const firstQuestion = await screen.findByText(/What is the name of the capital of Turkey/i)    
    jest.advanceTimersByTime(1000);
    const timer = screen.getByText(/29/i);
    expect(firstQuestion).toBeInTheDocument();
    expect(timer).toBeInTheDocument();
  });
});