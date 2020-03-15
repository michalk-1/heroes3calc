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
    asyncGetBank('Dwarven Treasury').then(bank => { this.setState({bank2: bank}); });
  }

  render() {
    const props = this.props;
    const bank = this.state.bank;
    const bank2 = this.state.bank2;
    return (
      <div className="sth">
        <CreatureBank bank={bank} onGuardClick={guard => console.log(guard.toJS())} />
        <CreatureBank bank={bank2} onGuardClick={guard => console.log(guard.toJS())} />
      </div>
    );
  }
}

ReactDOM.render(
    <CreatureBankApp />,
    document.getElementById('index')
);
