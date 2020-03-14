import React from 'react';
import style from './Creature.css';

export class Creature extends React.Component {

  render() {
    const props = this.props;
    return (
      <div className={style.creature}>
        <img src={props.image} alt={props.name} onClick={() => props.onClick()}/>
      </div>
    );
  }
}
