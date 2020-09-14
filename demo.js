import { renderTree, markup, StatefulComponent } from './src/miniFrameWorkVDOM.js';

const componentBorderStyle =
  'border: 1px solid #ccc;margin: 20px 0; padding: 10px;border-radius: 4px;background: #fff;';

class ClassComponent extends StatefulComponent {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };
  }

  onInput(text) {
    this.setState({
      text,
    });
  }

  render() {
    const { text } = this.state;
    const { children } = this.props;

    return markup(
      'div',
      {
        style: componentBorderStyle,
      },
      [
        markup('div', null, markup('strong', null, 'This component has state!')),
        markup('input', {
          type: 'text',
          oninput: (e) => {
            this.onInput(e.target.value);
          },
        }),
        markup('p', null, text),
        markup('div', null, [
          markup('div', null, ['Custom children in class component', children]),
        ]),
      ],
    );
  }
}

const ComponentWithChildren = ({ children }) => {
  return markup(
    'div',
    {
      style: componentBorderStyle,
    },
    [markup('h1', null, 'Children in component'), children],
  );
};

const ListItem = ({ number }) => {
  return markup('li', null, `Number: ${number}`);
};

const MainComponent = () => {
  const listItems = [];

  for (let i = 0; i < 20; i++) {
    listItems.push(markup(ListItem, { number: i }));
  }

  const child1 = markup('h2', null, 'I am child 1');
  const child2 = markup('h3', null, 'I am child 2');

  return markup('div', null, [
    markup('h1', { style: 'color: #444;' }, 'This is the vdom experiment test page!'),
    markup('ul', { style: `${componentBorderStyle}list-style: none;` }, listItems),
    null,
    'I am a simple string passed as child',
    markup(ClassComponent, null, child1),
    markup(ComponentWithChildren, null, child1),
    markup(ComponentWithChildren, null, child2),
  ]);
};

const start = Date.now();
renderTree(document.getElementById('app-root'), markup(MainComponent, null));
console.log('Initial render took', Date.now() - start, 'ms');
