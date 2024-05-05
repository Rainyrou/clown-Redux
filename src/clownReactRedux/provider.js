import React, { useMemo, useEffect } from "react";
import ReactReduxContext from "./connect";
import Subscription from "./subscription";

function Provider(props) {
  const { store, children } = props;
  const contextValue = useMemo(() => {
    const subscription = new Subscription(store);
    subscription.onStateChange = subscription.notifyNestedSub;
    return { store, subscription };
  }, [store]);
  const preState = useMemo(() => store.getState(), [store]);
  useEffect(() => {
    const { subscription } = contextValue;
    subscription.trySubscribe();
    if (preState !== store.getState()) subscription.notifyNestedSub();
  }, [contextValue, preState]);
  return (
    <ReactReduxContext.Provider value={contextValue}>
      {children}
    </ReactReduxContext.Provider>
  );
}

export default Provider;
