import React from 'react';
import style from './Bank.css';

export function Bank({image, name, onClick}) {
  return (
    <div className={style.bank}>
      <img src={image} alt={name} onClick={() => onClick()}/>
    </div>
    );
}
