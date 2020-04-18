function featuresEqual(lhs, rhs) {
  if (lhs === undefined && rhs === undefined)
    return true;

  if (lhs === undefined || rhs === undefined)
    return false;

  return Immutable.is(lhs.attacking, rhs.attacking) && Immutable.is(lhs.defending, rhs.defending);
}

export function addToHistory(state) {
  const current = {attacking: state.attacking, defending: state.defending};
  const last = state.history.last();
  if (featuresEqual(last, current)) {
    return [state.history, state.future];
  } else {
    const history = state.history.push(Object.freeze(current));
    const future = Immutable.List();
    return [history, future];
  }
}

export function overwriteLastInHistory(state) {
  const current = {attacking: state.attacking, defending: state.defending};
  const history = state.history;
  return state.history.update(history.size - 1, () => current);
}

function saveCurrent(state, previous) {
  const current = {
    attacking: state.attacking,
    defending: state.defending
  };

  return featuresEqual(current, previous.last())
    ? previous
    : previous.push(Object.freeze(current));
}

export function moveZipper(state, previous, next) {
  if (next.size <= 0) {
    return [previous, state, next];
  } else {
    return [saveCurrent(state, previous), next.last(), next.pop()];
  }
}
