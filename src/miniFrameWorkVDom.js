import { createComponent } from './internals.js';

export function renderTree(_rootNode, rootComponent) {
  const appRoot = createComponent(rootComponent);
  const domTree = appRoot.mount();
  console.log('componentTree >>', appRoot.renderedComponent);
  console.log('domTree >>', domTree);
  _rootNode.appendChild(domTree);
}

export function markup(elementType, props, children) {
  const actualProps = props ? { ...props, children } : { children };
  return { elementType, props: actualProps };
}

export class StatefulComponent {
  constructor(props) {
    this.props = props;
    this.state = {};
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  onUnmount() {}

  onMount() {}

  render() {}
}

StatefulComponent.prototype.isStatefulComponent = true;
