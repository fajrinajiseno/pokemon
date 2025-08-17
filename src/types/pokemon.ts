type PokemonSpecies = {
  name: string
  url: string
}
export type Pokemon = {
  id: number
  name: string
  sprites: {
    front_default: string
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
  order: number
  types: {
    slot: number
    type: {
      name: string
      url: string
    }
  }[]
  species: PokemonSpecies
  height: number
  weight: number
  abilities: {
    ability: {
      name: string
      url: string
    }
  }[]
  moves: {
    move: {
      name: string
      url: string
    }
  }[]
  stats: {
    base_stat: number
    stat: {
      name: string
      url: string
    }
  }[]
  evolution?: PokemonEvolutionList
}

export type PokemonList = {
  name: string
  url: string
}

export type PokemonSpeciesResponse = {
  evolution_chain: {
    url: string
  }
  id: number
}

export type PokemonEvolution = {
  evolves_to: PokemonEvolution[]
  species: PokemonSpecies
}
export type PokemonEvolutionList = {
  id: number
  pokemonId: number
  chain: PokemonEvolution
}

export enum backgroundColor {
  green = '#64dbb2',
  orange = '#f0776a',
  blue = '#58abf6',
  yellow = '#facd4b',
  purple = '#9f5bba',
  coco = '#ca8179'
}

export enum pokemonColor {
  bulbasaur = backgroundColor.green,
  ivysaur = backgroundColor.green,
  venusaur = backgroundColor.green,
  charmander = backgroundColor.orange,
  charmeleon = backgroundColor.orange,
  charizard = backgroundColor.orange,
  squirtle = backgroundColor.blue,
  wartortle = backgroundColor.blue,
  blastoise = backgroundColor.blue,
  caterpie = backgroundColor.green,
  metapod = backgroundColor.green,
  butterfree = backgroundColor.purple,
  weedle = backgroundColor.yellow,
  kakuna = backgroundColor.yellow,
  beedrill = backgroundColor.yellow,
  pidgey = backgroundColor.coco,
  pidgeotto = backgroundColor.coco,
  pidgeot = backgroundColor.coco,
  rattata = backgroundColor.purple,
  raticate = backgroundColor.yellow
}
