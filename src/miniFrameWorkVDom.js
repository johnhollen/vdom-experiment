let tree = {};
let nodeTrackId = 0;

const traverseVDom = (startNode) => {
  if (!startNode) {
    return document.createDocumentFragment();
  }

  if (typeof startNode === 'string') {
    return document.createTextNode(startNode);
  }

  const { element, props, children, nodeTrackId: trackingId } = startNode;

  const domElement = document.createElement(element);
  domElement.setAttribute('data-node-track-id', trackingId);

  if (props) {
    Object.keys(props)
      .filter((key) => key !== 'children')
      .forEach((key) => {
        if (key.startsWith('on')) {
          domElement[key] = props[key];
        } else {
          domElement.setAttribute(key, props[key]);
        }
      });
  }
  if (children) {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        domElement.appendChild(traverseVDom(child));
      });
    } else if (typeof children === 'string') {
      domElement.appendChild(document.createTextNode(children));
    } else {
      domElement.appendChild(traverseVDom(children));
    }
  }

  return domElement;
};

const createVDomNode = (el) => ({
  element: el.elementType,
  props: el.props,
  children: el.children,
  nodeTrackId: nodeTrackId++,
});

export const renderTree = (_rootNode, rootComponent) => {
  tree = rootComponent;
  console.log(tree);
  _rootNode.appendChild(traverseVDom(tree));
};

export const markup = (elementType, props, children) => {
  const actualProps = props ? { ...props, children } : { children };
  if (elementType.prototype && elementType.prototype.isStatefulComponent) {
    const instance = new elementType(actualProps);
    instance.props = actualProps;
    return instance.render();
  } else if (typeof elementType === 'function') {
    return elementType(actualProps);
  }

  return createVDomNode({
    elementType,
    props: actualProps,
    children,
  });
};

export class StatefulComponent {
  state = {};
  props = null; // Set by renderer

  constructor(props) {
    this.props = props;
  }

  setState(newState) {
    const oldVDom = this.render();
    this.state = { ...this.state, ...newState };
    const newVdom = this.render();

    console.log(oldVDom, newVdom);
  }
}

StatefulComponent.prototype.isStatefulComponent = true;
