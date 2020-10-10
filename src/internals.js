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

function createArrayOfChildren(children) {
  return (Array.isArray(children) ? children : [children]).filter(
    (child) => child !== undefined && child !== null,
  );
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

  getDomNode() {
    return this.renderedComponent.getDomNode();
  }

  mount() {
    const { elementType, props } = this.vdomNode;

    let renderedVdomNode;
    if (isClassComponent(elementType)) {
      this.instance = new elementType(props);
      this.instance.props = props;
      this.instance._internalInstance = this;
      this.instance.onMount();
      renderedVdomNode = this.instance.render();
    } else {
      this.instance = null;
      renderedVdomNode = elementType(props);
    }

    this.renderedComponent = createComponent(renderedVdomNode);
    return this.renderedComponent.mount();
  }

  update(nextVdomNode) {
    const prevProps = this.vdomNode.props;
    const prevRenderedComponent = this.renderedComponent;
    const prevVdomNode = prevRenderedComponent.vdomNode;
    const nextProps = nextVdomNode.props;

    const nextElementType = nextVdomNode.elementType;

    let nextRenderedVdomNode;
    if (isClassComponent(nextElementType)) {
      // Add component will update call on class comonent that updates
      this.instance.props = nextProps;
      nextRenderedVdomNode = this.instance.render();
    } else {
      nextRenderedVdomNode = nextElementType(nextProps);
    }

    this.diffAndUpdateRendered(prevVdomNode, nextRenderedVdomNode);
  }

  diffAndUpdateRendered(prevVdomNode, nextVdomNode) {
    const prevRenderedComponent = this.renderedComponent;

    if (prevVdomNode.elementType === nextVdomNode.elementType) {
      prevRenderedComponent.update(nextVdomNode);
      return;
    }

    const prevNode = prevRenderedComponent.getDomNode();
    prevRenderedComponent.unmount();

    const nextRenderedComponent = createComponent(nextVdomNode);
    const nextNode = nextRenderedComponent.mount();

    this.renderedComponent = nextRenderedComponent;
    prevNode.parentNode.replaceChild(nextNode, prevNode);
  }

  stateChanged() {
    this.diffAndUpdateRendered(this.renderedComponent.vdomNode, this.instance.render());
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

  getDomNode() {
    return this.domNode;
  }

  mount() {
    const { elementType, props } = this.vdomNode;

    const children = createArrayOfChildren(props.children);

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

  update(nextVdomNode) {
    const prevProps = this.vdomNode.props;
    const nextProps = nextVdomNode.props;
    const prevChildren = createArrayOfChildren(this.vdomNode.props.children);
    const nextChildren = createArrayOfChildren(nextVdomNode.props.children);

    // If we update a text node, just set the new text
    if (nextVdomNode.elementType === 'text' && this.vdomNode.elementType === 'text') {
      this.domNode.nodeValue = nextChildren[0];
      return;
    }

    this.diffProps(prevProps, nextProps);

    // diff children
    const nextRenderedChildren = [];
    const updateQueue = [];

    nextChildren.forEach((nextVdomChild, index) => {
      const prevChild = this.renderedChildren[index];

      if (!prevChild) {
        const nextRenderedChild = createComponent(nextVdomChild);
        const domNode = nextRenderedChild.mount();

        nextRenderedChildren.push(nextRenderedChild);
        updateQueue.push({ type: 'ADD', domNode });
      } else {
        const canUpdateNode =
          nextVdomChild.elementType === prevChildren[index].elementType;

        if (canUpdateNode) {
          prevChild.update(nextVdomChild);
          nextRenderedChildren.push(prevChild);
        } else {
          const prevDomNode = prevChild.getDomNode();
          prevChild.unmount();

          const nextChild = createComponent(nextVdomChild);
          const nextDomNode = nextChild.mount();
          nextRenderedChildren.push(nextChild);
          updateQueue.push({ type: 'REPLACE', prevDomNode, nextDomNode });
        }
      }
    });

    // Remove children that doesn't exist in nextChildren
    for (let i = nextChildren.length; i < prevChildren.length; i++) {
      const prevChild = this.renderedChildren[i];
      const domNode = prevChild.getDomNode();
      prevChild.unmount();

      updateQueue.push({ type: 'REMOVE', domNode });
    }

    this.renderedChildren = nextRenderedChildren;
    this.vdomNode = nextVdomNode;
    this.applyUpdates(updateQueue);
  }

  diffProps(prevProps, nextProps) {
    Object.keys(prevProps).forEach((key) => {
      if (key !== 'children' && !nextProps.hasOwnProperty(key)) {
        if (key.startsWith('on')) {
          this.domNode[key] = null;
        } else {
          this.domNode.removeAttribute(key);
        }
      }
    });

    Object.keys(nextProps).forEach((key) => {
      if (key !== 'children') {
        if (key.startsWith('on')) {
          this.domNode[key] = nextProps[key];
        } else {
          this.domNode.setAttribute(key, nextProps[key]);
        }
      }
    });
  }

  applyUpdates(updateQueue) {
    console.log('UpdateQueue >>', updateQueue);
    updateQueue.forEach((update) => {
      switch (update.type) {
        case 'ADD': {
          this.domNode.appendChild(update.domNode);
          break;
        }
        case 'REPLACE': {
          this.domNode.replaceChild(update.nextDomNode, update.prevDomNode);
          break;
        }
        case 'REMOVE': {
          this.domNode.removeChild(update.domNode);
        }
      }
    });
  }

  unmount() {
    this.renderedChildren.forEach((renderedChild) => {
      renderedChild.unmount();
    });
  }
}
