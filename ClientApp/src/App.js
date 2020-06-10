import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { LayoutStyled, HeaderStyled } from './Layout.components';
import { GameBoard } from './GameBoard'
import { PepperContextProvider, PepperContext } from './components/PepperContext'

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
      return (
          <div>
              <HeaderStyled>Pepper</HeaderStyled>
              <LayoutStyled>
                  <PepperContextProvider>
                      <GameBoard />
                  </PepperContextProvider>
              </LayoutStyled>
          </div>
    );
  }
}
