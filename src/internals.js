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
  vdomNode = null;
  renderedComponent = null;
  instance = null;

  constructor(vdomNode) {
    this.vdomNode = vdomNode;
  }

  getInstance() {
    return this.instance;
  }

  mount() {
    const { elementType, props } = this.vdomNode;

    let renderedVdomNode;
    if (isClassComponent(elementType)) {
      // TODO: Handle class components
    } else {
      this.instance = null;
      renderedVdomNode = elementType(props);
    }

    this.renderedComponent = createComponent(renderedVdomNode);
    return this.renderedComponent.mount();
  }
}

class DomComponent {
  vdomNode = null;
  renderedChildren = [];
  domNode = null;

  constructor(vdomNode) {
    this.vdomNode = vdomNode;
  }

  getInstance() {
    return this.domNode;
  }

  mount() {
    const { elementType, props } = this.vdomNode;

    let children = props.children || [];
    if (!Array.isArray(children)) {
      children = [children];
    }

    if (elementType === 'text') {
      const domNode = document.createTextNode(children[0]);
      this.domNode = domNode;
      return domNode;
    }

    const domNode = document.createElement(elementType);
    this.domNode = domNode;

    Object.keys(props).forEach((key) => {
      if (key !== 'children') {
        domNode.setAttribute(key, props[key]);
      }
    });

    const renderedChildren = children.map((child) => createComponent(child));
    this.renderedChildren = renderedChildren;

    renderedChildren.forEach((renderedChild) => {
      domNode.appendChild(renderedChild.mount());
    });

    return domNode;
  }
}
