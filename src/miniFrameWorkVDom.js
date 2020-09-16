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
  state = {};
  props = null; // Set by renderer

  constructor(props) {
    this.props = props;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }
}

StatefulComponent.prototype.isStatefulComponent = true;
