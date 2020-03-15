import React from 'react';
import ReactDOM from 'react-dom';
import { Calc } from './components/Calc/index.js';
import { CreatureBank } from './components/CreatureBank/index.js';
import { asyncGetBank } from './components/Creatures/index.js';

export class CreatureBankApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    asyncGetBank('Griffin Conservatory').then(bank => { this.setState({bank: bank}); });
  }

  render() {
    const props = this.props;
    const bank = this.state.bank;
    return <CreatureBank bank={bank} onGuardClick={guard => console.log(guard.toJS())} />
  }
}

ReactDOM.render(
    <CreatureBankApp />,
    document.getElementById('index')
);
