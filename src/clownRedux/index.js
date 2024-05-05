function createStore(reducer, enhancer) {
  if (enhancer && typeof enhancer === "function") {
    const newCreateStore = enhancer(createStore);
    const newStore = newCreateStore(reducer);
    return newStore;
  }
  let state;
  let listeners = [];
  function getState() {
    return state;
  }
  function dispatch(action) {
    state = reducer(state, action);
    for (let i = 0; i < listeners.length; ++i) {
      const listener = listeners[i];
      listener();
    }
  }
  function subscribe(callback) {
    listeners.push(callback);
  }
  const store = {
    getState,
    dispatch,
    subscribe,
  };
  return store;
}

function combineReducers(reducersMap) {
  const reducerKeys = Object.keys(reducersMap);
  const reducer = (state = {}, action) => {
    const newState = {};
    for (let i = 0; i < reducerKeys.length; ++i) {
      const key = reducerKeys[i];
      const currentReducer = reducersMap[key];
      const preState = state[key];
      newState[key] = currentReducer(preState, action);
    }
    return newState;
  };
  return reducer;
}

function compose(...fns) {
  return fns.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}

function applyMiddleware(...middlewares) {
  function enhancer(createStore) {
    function newCreateStore(reducer) {
      const store = createStore(reducer);
      const chain = middlewares.map((middleware) => middleware(store));
      const { dispatch } = store;
      const newDispatchGen = compose(...chain);
      const newDispatch = newDispatchGen(dispatch);
      return { ...store, dispatch: newDispatch };
    }
    return newCreateStore;
  }
  return enhancer;
}

export { createStore, combineReducers, applyMiddleware, compose };
