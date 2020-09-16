import { renderTree, markup } from './src/miniFrameWorkVDOM.js';

function CustomComponent(props) {
  return markup('div', { style: 'color: blue;', title: 'I am a title' }, [
    markup('text', null, `Hello, ${props.name}!`),
    markup('p', null, props.children),
  ]);
}

function MainComponent() {
  return markup('div', null, [
    markup(
      CustomComponent,
      { name: 'Mister Smith' },
      markup('text', null, 'some custom children!'),
    ),
    markup('p', null, markup('text', null, 'I am a simple p tag!')),
  ]);
}

const start = Date.now();
renderTree(document.getElementById('app-root'), markup(MainComponent));
console.log('Initial render took', Date.now() - start, 'ms');
