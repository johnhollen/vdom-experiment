import { renderTree, markup, StatefulComponent } from './src/miniFrameWorkVDOM.js';

function Button({ onClick, children }) {
  return markup(
    'button',
    {
      style:
        'background: salmon; color: white; border-radius: 4px; border: none; padding: 10px; font-size: 14px;',
      onclick: onClick,
    },
    children,
  );
}

class ClassComponent extends StatefulComponent {
  constructor(props) {
    super(props);
    this.state = {
      bigTitle: true,
    };
    this.toggleTitle = this.toggleTitle.bind(this);
  }

  toggleTitle() {
    this.setState({
      bigTitle: !this.state.bigTitle,
    });
  }

  render() {
    const { bigTitle } = this.state;

    return markup(bigTitle ? 'h1' : 'h3', null, [
      markup('text', null, 'Title'),
      markup(Button, { onClick: this.toggleTitle }, markup('text', null, 'Toggle')),
    ]);
  }
}

function BigTitle() {
  return markup('h1', null, markup('text', null, 'I am a custom h1 component'));
}

function SmallTitle() {
  return markup('h3', null, markup('text', null, 'I am a custom h3 component'));
}

function Title({ bigTitle }) {
  return markup(bigTitle ? BigTitle : SmallTitle);
}

class ClassComponentCustom extends StatefulComponent {
  constructor(props) {
    super(props);
    this.state = {
      bigTitle: true,
    };
    this.toggleTitle = this.toggleTitle.bind(this);
  }

  toggleTitle() {
    this.setState({
      bigTitle: !this.state.bigTitle,
    });
  }

  render() {
    const { bigTitle } = this.state;

    return markup('div', null, [
      markup(Title, { bigTitle }),
      markup(Button, { onClick: this.toggleTitle }, markup('text', null, 'Toggle')),
    ]);
  }
}

function MainComponent() {
  return markup('div', null, [markup(ClassComponent), markup(ClassComponentCustom)]);
}

const start = Date.now();
renderTree(document.getElementById('app-root'), markup(MainComponent));
console.log('Initial render took', Date.now() - start, 'ms');
