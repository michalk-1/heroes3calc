import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class CalcForm extends React.Component {
  render() {
    return (
    );
  }
}

class Result extends React.Component {
  render() {
    return (
    );
  }
}

class Calc extends React.Component {
  renter() {
    return (
      <h1> Foo </h1>
    );
  }
}

// ===

ReactDOM.render(
  <Calc />,
  document.getElementById('root')
);

function calc() {
  const aattack = document.getElementById('aattack').value;
  const aamount = document.getElementById('aamount').value;
  const abasemin = document.getElementById('abasemin').value;
  const abasemax = document.getElementById('abasemax').value;
  const ddefense = document.getElementById('ddefense').value;
  const damount = document.getElementById('damount').value;
  const dhp = document.getElementById('dhp').value;

  var param = 0;
  if (aattack > ddefense) {
    param = 0.05;
  } else if (aattack < ddefense) {
    param = 0.025;
  }

  const resultMin = aamount * abasemin * (1 + param * (aattack - ddefense));
  const resultMax = aamount * abasemax * (1 + param * (aattack - ddefense));
  document.getElementById("resultmin").innerHTML = resultMin;
  document.getElementById("resultmax").innerHTML = resultMax;
  document.getElementById("resultavg").innerHTML = 0.5 * (resultMin + resultMax);
  document.getElementById("totalhp").innerHTML = dhp * damount;
}