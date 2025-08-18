type PokemonSpecies = {
  name: string
  url: string
}
export type PokemonPagination = {
  count: number
  next?: string
  orevious?: string
  result: PokemonSpecies[]
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
  evolution?: PokemonEvolutionList[]
  evolution_chain?: {
    url: string
  }
  color: string
}

export type PokemonList = {
  name: string
  url: string
}

export type PokemonSpeciesResponse = {
  evolution_chain: {
    url: string
  }
  color: {
    name: string
  }
  varieties: [
    {
      pokemon: {
        name: string
        url: string
      }
    }
  ]
  name: string
  id: number
}

export type PokemonEvolution = {
  evolves_to: PokemonEvolution[]
  species: PokemonSpecies
}
export type PokemonEvolutionResponse = {
  id: number
  pokemonId: number
  chain: PokemonEvolution
}

export type PokemonEvolutionList = {
  name: string
  pokemon: Pokemon
}

export enum backgroundStatColor {
  low = '#ff5f56',
  medium = '#ffbd2d',
  good = '#26c940'
}

export enum backgroundColor {
  green = '#64dbb2',
  red = '#fb6c6d',
  blue = '#58abf6',
  yellow = '#facd4b',
  purple = '#9f5bba',
  brown = '#ca8179',
  pink = '#ffc5b4',
  black = '#0c0c0c',
  gray = '#848484',
  white = '#b3bbd0'
}
