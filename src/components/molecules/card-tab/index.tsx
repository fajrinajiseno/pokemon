import { useState } from 'react'
import type { Pokemon, PokemonEvolution } from '@/types/pokemon'
import './index.scss'

type CardTabProps = {
  pokemon: Pokemon
}

export default function CardTab({ pokemon }: CardTabProps) {
  const navigations = ['About', 'Base Stats', 'Evolutions', 'Moves']
  const [activeTab, setActivePokemon] = useState(navigations[0])

  function formatLabel(str: string) {
    const capitalizeFirst = str.charAt(0).toUpperCase() + str.slice(1)
    return capitalizeFirst.replaceAll('-', ' ')
  }

  function constructEvolution(evolution: PokemonEvolution): string {
    if (evolution.evolves_to.length === 0) return evolution.species.name
    return `${evolution.species.name} → ${constructEvolution(evolution.evolves_to[0])}`
  }

  const AboutData = [
    {
      label: 'Species',
      value: pokemon.species.name
    },
    {
      label: 'Height',
      value: pokemon.height
    },
    {
      label: 'Weight',
      value: pokemon.weight
    },
    {
      label: 'Abilities',
      value: pokemon.abilities.map((ability) => ability.ability.name)
    }
  ]

  return (
    <div className="pokemon-card-tab">
      <div className="pokemon-card-tab__navigation flex justify-between items-center px-5 py-4">
        {navigations.map((navigation, i) => {
          return (
            <div
              className={`pokemon-card-tab__navigation-item ${navigation === activeTab ? 'active' : ''}`}
              key={`navigation-${i}`}
              onClick={() => setActivePokemon(navigation)}
              data-testid={`pokemon-card-tab-navigation-${navigation}`}
            >
              {navigation}
            </div>
          )
        })}
      </div>
      {activeTab === navigations[0] && (
        <div
          className={'pokemon-card-tab__content'}
          data-testid={`pokemon-card-tab-content-${navigations[0]}`}
        >
          {AboutData.map((data, i) => {
            return (
              <div className="flex mb-10" key={`about-data-${i}`}>
                <div className="text-gray-400 basis-[30%] w-[30%]">
                  {data.label}
                </div>
                <div className="basis-[70%] w-[70%]">{data.value}</div>
              </div>
            )
          })}
        </div>
      )}
      {activeTab === navigations[1] && (
        <div
          className={'pokemon-card-tab__content'}
          data-testid={`pokemon-card-tab-content-${navigations[1]}`}
        >
          {pokemon.stats.map((data, i) => {
            return (
              <div className="flex mb-10" key={`ability-data-${i}`}>
                <div className="text-gray-400 basis-[30%] w-[30%]">
                  {formatLabel(data.stat.name)}
                </div>
                <div className="basis-[70%] w-[70%]">{data.base_stat}</div>
              </div>
            )
          })}
        </div>
      )}
      {activeTab === navigations[2] && (
        <div
          className={'pokemon-card-tab__content'}
          data-testid={`pokemon-card-tab-content-${navigations[2]}`}
        >
          <div className="flex mb-10">
            <div className="text-gray-400 basis-[30%] w-[30%]">Evolution</div>
            <div className="basis-[70%] w-[70%]">
              {pokemon.evolution &&
                constructEvolution(pokemon.evolution?.chain)}
            </div>
          </div>
        </div>
      )}
      {activeTab === navigations[3] && (
        <div
          className={'pokemon-card-tab__content'}
          data-testid={`pokemon-card-tab-content-${navigations[3]}`}
        >
          {pokemon.moves.map((data, i) => {
            return (
              <div className="flex mb-10" key={`moves-data-${i}`}>
                <div className="text-gray-400 basis-[30%] w-[30%]">Name</div>
                <div className="basis-[70%] w-[70%]">{data.move.name}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
