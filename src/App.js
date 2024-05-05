import React, { createContext, useContext } from "react";
import { Provider, connect } from "react-redux";
import store from "./store";

const CounterContext = createContext();

function Counter(props) {
  const { count } = props;
  const { incrementHandler, decrementHandler, resetHandler } =
    useContext(CounterContext);
  return (
    <>
      <h3>{count}</h3>
      <button onClick={incrementHandler}>+1</button>
      <button onClick={decrementHandler}>-1</button>
      <button onClick={resetHandler}>reset</button>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    count: state.count,
  };
};

const ConnectedCounter = connect(mapStateToProps)(Counter);

function App() {
  const contextValue = {
    incrementHandler: () => store.dispatch({ type: "INCREMENT" }),
    decrementHandler: () => store.dispatch({ type: "DECREMENT" }),
    resetHandler: () => store.dispatch({ type: "RESET" }),
  };

  return (
    <Provider store={store}>
      <CounterContext.Provider value={contextValue}>
        <ConnectedCounter />
      </CounterContext.Provider>
    </Provider>
  );
}

export default App;
