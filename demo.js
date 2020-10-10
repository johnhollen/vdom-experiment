import { renderTree, markup, StatefulComponent } from './src/miniFrameWorkVDOM.js';
import { pokemon } from './sampleData.js';

function Button({ onClick, children }) {
  return markup('button', { class: 'button', onclick: onClick }, children);
}

class PokeListItem extends StatefulComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };

    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  toggleExpanded() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  renderExpanded() {
    const { expanded } = this.state;
    const { pokemon } = this.props;

    if (!expanded) {
      return null;
    }

    const stats = Object.keys(pokemon.base).map((key) =>
      markup('div', { class: 'stat' }, [
        markup('strong', null, markup('text', null, `${key}: `)),
        markup('text', null, pokemon.base[key]),
      ]),
    );

    return markup('div', { class: 'expanded-list-item' }, [
      markup('div', { class: 'stat' }, [
        markup('strong', null, markup('text', null, 'Type: ')),
        markup('text', null, pokemon.type.join(', ')),
      ]),
      ...stats,
    ]);
  }

  render() {
    const { pokemon } = this.props;
    const { expanded } = this.state;
    return markup('li', null, [
      markup('div', { class: 'poke-list-item' }, [
        markup('span', null, markup('text', null, pokemon.name)),
        markup(
          Button,
          { onClick: this.toggleExpanded },
          markup('text', null, expanded ? 'Collapse' : 'Expand'),
        ),
      ]),
      this.renderExpanded(),
    ]);
  }
}

class Pokedex extends StatefulComponent {
  constructor(props) {
    super(props);
    this.state = {
      filterString: '',
    };

    this.onFilterChange = this.onFilterChange.bind(this);
  }

  onFilterChange(event) {
    this.setState({
      filterString: event.target.value,
    });
  }

  render() {
    const { pokemons } = this.props;
    const { filterString } = this.state;

    const filteredPokemon = filterString
      ? pokemons.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(filterString.toLocaleLowerCase()),
        )
      : pokemon;

    const renderedListItems = filteredPokemon.map((pokemon) =>
      markup(PokeListItem, { pokemon }),
    );

    return markup('div', null, [
      markup('h1', null, markup('text', null, 'Pokedex')),
      markup('input', {
        type: 'text',
        class: 'input',
        placeholder: 'Filter list',
        oninput: this.onFilterChange,
      }),
      markup('ul', null, renderedListItems),
    ]);
  }
}

function MainComponent() {
  return markup('div', null, markup(Pokedex, { pokemons: pokemon }));
}

const start = Date.now();
renderTree(document.getElementById('app-root'), markup(MainComponent));
console.log('Initial render took', Date.now() - start, 'ms');
