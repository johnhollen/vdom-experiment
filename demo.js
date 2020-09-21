import { renderTree, markup, StatefulComponent } from './src/miniFrameWorkVDOM.js';

function CustomComponent(props) {
  return markup('div', { style: 'color: steelblue;', title: 'I am a title' }, [
    markup('text', null, `Hello, ${props.name}!`),
    markup('p', null, props.children),
  ]);
}

class TestClassComponent extends StatefulComponent {
  onClick() {
    console.log('You clicked the button');
  }

  onMount() {
    console.log('Running onMount');
  }

  render() {
    const { titleColor } = this.props;

    return markup(
      'div',
      { style: 'border: 1px solid #aaa; border-radius: 4px; padding: 10px;' },
      [
        markup(
          'h1',
          { style: `color: ${titleColor}` },
          markup('text', null, 'I am a Class Component!'),
        ),
        markup(
          'button',
          { onclick: () => this.onClick() },
          markup('text', null, 'Click Me!'),
        ),
      ],
    );
  }
}

class TestClassComponent2 extends StatefulComponent {
  constructor(props) {
    super(props);
    this.state = { typedText: '' };

    this.onType = this.onType.bind(this);
  }

  onType(event) {
    const typedText = event.target.value;

    this.setState({
      typedText,
    });
  }

  render() {
    const { typedText } = this.state;

    return markup(
      'div',
      {
        style:
          'margin-top: 10px;border: 1px solid #aaa; border-radius: 4px; padding: 10px;',
      },
      [
        markup('input', { type: 'text', oninput: this.onType }),
        markup('p', null, markup('text', null, typedText)),
      ],
    );
  }
}

function MainComponent() {
  return markup('div', null, [
    markup(
      CustomComponent,
      { name: 'Mister Smith' },
      markup('text', null, 'some custom children!'),
    ),
    markup('p', null, markup('text', null, 'I am a simple p tag!')),
    markup(TestClassComponent, { titleColor: 'salmon' }),
    markup(TestClassComponent2),
  ]);
}

const start = Date.now();
renderTree(document.getElementById('app-root'), markup(MainComponent));
console.log('Initial render took', Date.now() - start, 'ms');
