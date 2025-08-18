import Image from 'next/image'
import { useState } from 'react'
import type { Pokemon } from '@/types/pokemon'
import Stats from '@/components/atoms/stats'
import { useEvolutionClick } from '@/context/EvolutionClickContext'
import './index.scss'

type CardTabProps = {
  pokemon: Pokemon
}

export default function CardTab({ pokemon }: CardTabProps) {
  const navigations = ['About', 'Base Stats', 'Evolutions', 'Moves']
  const [activeTab, setActivePokemon] = useState(navigations[0])
  const { handleEvolutionClick } = useEvolutionClick()

  function capitalizeFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  function formatLabel(str: string) {
    const capitalizeStrFirst = capitalizeFirst(str)
    return capitalizeStrFirst.replaceAll('-', ' ')
  }

  function onEvolutionClick(pokemonItem: Pokemon) {
    handleEvolutionClick(pokemonItem)
    document.querySelector('.pokemon-card-detail')?.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
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
      value: pokemon.abilities.map((ability) => ability.ability.name).join(' ')
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
              <div
                className="flex mb-10 items-center"
                key={`ability-data-${i}`}
              >
                <div className="text-gray-400 basis-[30%] w-[30%]">
                  {formatLabel(data.stat.name)}
                </div>
                <div className="basis-[10%] w-[10%]">{data.base_stat}</div>
                <div className="basis-[60%] w-[60%] px-1">
                  <Stats value={data.base_stat}></Stats>
                </div>
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
                pokemon.evolution.map((evolution) => (
                  <div
                    className="flex flex-col items-center mb-2 cursor-pointer"
                    key={`evolution-${evolution.name}`}
                    onClick={() => onEvolutionClick(evolution.pokemon)}
                    data-testid={`pokemon-card-tab-content-${navigations[2]}-${evolution.name}`}
                  >
                    <Image
                      src={
                        evolution.pokemon.sprites.other['official-artwork']
                          .front_default
                      }
                      alt={evolution.name}
                      width={200}
                      height={200}
                    />
                    <div className="font-bold text-lg">
                      {capitalizeFirst(evolution.name)}
                    </div>
                  </div>
                ))}
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
