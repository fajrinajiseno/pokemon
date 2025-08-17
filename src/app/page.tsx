'use client'
import { useState } from 'react'
import type { Pokemon } from '@/types/pokemon'
import usePokemon from '@/hooks/usePokemon'
import Card from '@/components/atoms/card'
import CardDetail from '@/components/organism/card-detail'

export default function Home() {
  const [activePokemon, setActivePokemon] = useState<Pokemon>()
  const { pokemon } = usePokemon()

  function handleClickCard(pokemon: Pokemon) {
    setActivePokemon(pokemon)
  }
  function handleCloseClick() {
    setActivePokemon(undefined)
  }

  return (
    <div className="flex justify-center pb-10 px-3">
      <main className="lg:w-[1024px] sm:w-[800px] w-[480px] relative">
        <h1 className="text-[40px] font-bold mt-10 mb-6">Pokedex</h1>
        <div className="flex flex-wrap gap-4">
          {pokemon &&
            pokemon.map((item) => (
              <div
                className="lg:basis-[calc(25%-0.8rem)] lg:w--[calc(25%-0.8rem)] sm:basis-[calc(33%-0.6rem)] sm:w--[calc(33%-0.6rem)] basis-[calc(50%-0.5rem)] w--[calc(50%-0.5rem)]"
                key={item.name}
              >
                <Card pokemon={item} handleClick={handleClickCard}></Card>
              </div>
            ))}
        </div>
        {activePokemon && (
          <CardDetail
            pokemon={activePokemon}
            handleCloseClick={handleCloseClick}
            className="absolute top-0 left-0 w-[inherit] h-[-webkit-fill-available]"
            useAnimation={true}
          ></CardDetail>
        )}
      </main>
    </div>
  )
}
