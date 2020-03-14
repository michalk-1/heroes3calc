import React from 'react';
import style from './Bank.css';

export class Bank extends React.Component {

  render() {
    const props = this.props;
    return (
      <div className={style.bank}>
        <img src={props.image} alt={props.name} onClick={() => props.onClick()}/>
        <span style={{textAlign: 'center'}}>{props.name}</span>
      </div>
    );
  }
}

