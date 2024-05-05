export default class Subscription {
  constructor(store, parentSub) {
    this.store = store;
    this.parentSub = parentSub;
    this.unsubscribe = null;
    this.listeners = [];
    this.handleChangeWrapper = this.handleChangeWrapper.bind(this);
  }
  addNestedSub(listener) {
    this.listeners.push(listener);
  }
  notifyNestedSub() {
    for (let i = 0; i < this.listeners.length; ++i) {
      const listener = this.listeners[i];
      listener();
    }
  }
  handleChangeWrapper() {
    if (this.onStateChange) this.onStateChange();
  }
  trySubscribe() {
    if (!this.unsubscribe)
      this.unsubscribe = this.parentSub
        ? this.parentSub.addNestedSub(this.handleChangeWrapper)
        : this.store.subscribe(this.handleChangeWrapper);
  }
}
