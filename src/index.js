import React from 'react';
import ReactDOM from 'react-dom';
import { Calc } from './components/Calc/index.js';

/*
Todo:
- Add one unit health left in the top prompt (Remaining: X (YY health)).
- Clicking on bank adjusts the number of guards if the name did not change in a slot.
- Disable editing in inputs that are pre-populated.
- Rearrange the layout of top level components to more tight and aligned.
*/

export class DebugApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        {Object.keys(this.props).map(key => <div>{this.props[key]}</div>)}
        {Object.keys(this.state).map(key => <div>{this.state[key]}</div>)}
      </div>
    );
  }
}

ReactDOM.render(
    <Calc />,
    document.getElementById('index')
);
