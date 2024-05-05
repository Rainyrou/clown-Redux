import React, { useContext, useRef, useLayoutEffect, useReducer } from "react";
import ReactReduxContext from "./context";
import shallowEqual from "./shallowEqual";
import Subscription from "./subscription";

function storeStateUpdateReducer(count) {
  return count + 1;
}

function connect(mapStateToProps = () => {}, mapDispatchToProps = () => {}) {
  function childPropsSelector(store, wrapperProps) {
    const state = store.getState();
    const stateProps = mapStateToProps(state);
    const dispatchProps = mapDispatchToProps(store.dispatch);
    return Object.assign({}, stateProps, dispatchProps, wrapperProps);
  }
  return function connectHOC(WrappedComponent) {
    function ConnectFunction(props) {
      const { ...wrapperProps } = props;
      const contextValue = useContext(ReactReduxContext);
      const { store, subscription: parentSub } = contextValue;
      const actualChildProps = childPropsSelector(store, wrapperProps);
      const lastChildProps = useRef();
      useLayoutEffect(
        () => (lastChildProps.current = actualChildProps),
        [actualChildProps]
      );
      const [, forceComponentUpdateDispatch] = useReducer(
        storeStateUpdateReducer,
        0
      );
      const subscription = new Subscription(store, parentSub);
      const checkForUpdate = () => {
        const newChildProps = childPropsSelector(store, wrapperProps);
        if (!shallowEqual(newChildProps, lastChildProps.current)) {
          lastChildProps.current = newChildProps;
          forceComponentUpdateDispatch();
          subscription.notifyNestedSub();
        }
      };
      subscription.onStateChange = checkForUpdate;
      subscription.trySubscribe();
      const overrideContextValue = { ...contextValue, subscription };
      return (
        <ReactReduxContext.Provider value={overrideContextValue}>
          <WrappedComponent {...actualChildProps} />
        </ReactReduxContext.Provider>
      );
    }
    return ConnectFunction;
  };
}

export default connect;
