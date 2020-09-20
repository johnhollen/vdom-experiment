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

function MainComponent() {
  return markup('div', null, [
    markup(
      CustomComponent,
      { name: 'Mister Smith' },
      markup('text', null, 'some custom children!'),
    ),
    markup('p', null, markup('text', null, 'I am a simple p tag!')),
    markup(TestClassComponent, { titleColor: 'salmon' }),
  ]);
}

const start = Date.now();
renderTree(document.getElementById('app-root'), markup(MainComponent));
console.log('Initial render took', Date.now() - start, 'ms');
