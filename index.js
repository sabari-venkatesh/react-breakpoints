import React, { Component } from 'react';
import { render } from 'react-dom';
import Breakpoint from './Breakpoint';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
      <div>
        <Breakpoint xsmall up>
          <h1>Welcome mobile</h1>
        </Breakpoint>
        <Breakpoint large up>
          <strong>Welcome Tablet</strong>
        </Breakpoint>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
