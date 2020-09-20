function isClassComponent(elementType) {
  return !!(elementType.prototype && elementType.prototype.isStatefulComponent);
}

export function createComponent(vdomNode) {
  if (typeof vdomNode.elementType === 'function') {
    return new CustomComponent(vdomNode);
  } else if (typeof vdomNode.elementType === 'string') {
    return new DomComponent(vdomNode);
  }

  throw new Error(`Cannot create a component from ${typeof elementType}`);
}

class CustomComponent {
  constructor(vdomNode) {
    this.vdomNode = vdomNode;
    this.renderedComponent = null;
    this.instance = null;
    this.componentName = vdomNode.elementType.name;
  }

  getInstance() {
    return this.instance;
  }

  mount() {
    const { elementType, props } = this.vdomNode;

    let renderedVdomNode;
    if (isClassComponent(elementType)) {
      this.instance = new elementType(props);
      this.instance.props = props;
      this.instance.onMount();
      renderedVdomNode = this.instance.render();
    } else {
      this.instance = null;
      renderedVdomNode = elementType(props);
    }

    this.renderedComponent = createComponent(renderedVdomNode);
    return this.renderedComponent.mount();
  }

  unmount() {
    if (this.instance) {
      this.instance.onUnmount();
    }
    this.renderedComponent.unmount();
  }
}

class DomComponent {
  constructor(vdomNode) {
    this.vdomNode = vdomNode;
    this.renderedChildren = [];
    this.domNode = null;
  }

  getInstance() {
    return this.domNode;
  }

  mount() {
    const { elementType, props } = this.vdomNode;

    const children = Array.isArray(props.children) ? props.children : [props.children];

    if (elementType === 'text') {
      this.domNode = document.createTextNode(children[0]);
      return this.domNode;
    }

    this.domNode = document.createElement(elementType);

    Object.keys(props).forEach((key) => {
      if (key !== 'children') {
        if (key.startsWith('on')) {
          this.domNode[key] = props[key];
        } else {
          this.domNode.setAttribute(key, props[key]);
        }
      }
    });

    this.renderedChildren = children.map((child) => {
      const renderedChild = createComponent(child);
      this.domNode.appendChild(renderedChild.mount());
      return renderedChild;
    });

    return this.domNode;
  }

  unmount() {
    this.renderedChildren.forEach((renderedChild) => {
      renderedChild.unmount();
    });
  }
}
