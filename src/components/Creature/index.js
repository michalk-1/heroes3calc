import React from 'react';
import style from './Creature.css';

export class Creature extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.src = "creatures_small/" + this.props.name + ".gif";
  }

  handleClick(ev) {
    this.props.onClick(this.props.name);
  }

  render() {
    return (
      <div className={style.creature}>
        <img src={this.src} alt={this.props.name} onClick={this.handleClick}/>
      </div>
    );
  }
}

