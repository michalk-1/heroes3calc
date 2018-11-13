import React from 'react';
import style from './Creature.css';

export class Creature extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.image = this.props.image;
  }

  handleClick(ev) {
    this.props.onClick(this.props.name, this.props.town);
  }

  render() {
    return (
      <div className={style.creature}>
        <img src={this.image} alt={this.props.name} onClick={this.handleClick}/>
      </div>
    );
  }
}

