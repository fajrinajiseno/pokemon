import Image from 'next/image'
import { backgroundColor } from '@/types/pokemon'
import type { Pokemon } from '@/types/pokemon'
import './index.scss'

type CardProps = {
  pokemon: Pokemon
  handleClick: (pokemon: Pokemon) => void
}

export default function Card({ pokemon, handleClick }: CardProps) {
  function capitalizeFirst(str: string) {
    if (!str) return '' // handle empty string
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  function handleCardClicked() {
    handleClick(pokemon)
  }

  return (
    <div
      className="pokemon-card flex justify-between p-4 relative"
      style={{
        backgroundColor:
          backgroundColor[pokemon.color as keyof typeof backgroundColor] ||
          backgroundColor.white
      }}
      onClick={handleCardClicked}
      data-testid={`pokemon-card-${pokemon.name}`}
    >
      <div>
        <h3
          className="font-bold mb-2 text-white"
          data-testid={`pokemon-card-${pokemon.name}-name`}
        >
          {capitalizeFirst(pokemon.name)}
        </h3>
        {pokemon.types.map((type, i) => {
          return (
            <div className="pokemon-card__skill" key={i}>
              {type.type.name}
            </div>
          )
        })}
        <div className="pokemon-card__order">
          <div>
            # <span>{pokemon.order}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center pl-2">
        <Image
          className="pokemon-card__image"
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          width={96}
          height={96}
          priority
        />
      </div>
    </div>
  )
}
