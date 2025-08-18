'use client'
import { useEffect } from 'react'
import type { Pokemon } from '@/types/pokemon'
import usePokemon from '@/hooks/usePokemon'
import Spinner from '@/components/atoms/spinner'
import Card from '@/components/atoms/card'
import CardDetail from '@/components/organism/card-detail'
import { EvolutionClickProvider } from '@/context/EvolutionClickContext'

export default function Home() {
  // const [activePokemon, setActivePokemon] = useState<Pokemon>()
  // const [activeIndex, setActiveIndex] = useState<number>()
  const {
    pokemon,
    isFetching,
    pokemonPagination,
    activePokemon,
    fetchPokemon,
    getPokemonDetail,
    setActivePokemon
  } = usePokemon()

  function handleClickCard(pokemonItem: Pokemon) {
    getPokemonDetail(pokemonItem)
    // setActiveIndex(index)
  }

  function handleCloseClick() {
    // setActiveIndex(undefined)
    setActivePokemon(undefined)
  }

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement

      // check if user reached bottom
      if (
        !activePokemon &&
        !isFetching &&
        pokemonPagination?.next &&
        scrollTop + clientHeight >= scrollHeight - 50
      ) {
        fetchPokemon(pokemonPagination?.next)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isFetching, pokemonPagination?.next, activePokemon])

  useEffect(() => {
    const checkNeedLoadmore = () => {
      const { scrollHeight, clientHeight } = document.documentElement
      if (
        !activePokemon &&
        !isFetching &&
        pokemonPagination?.next &&
        scrollHeight <= clientHeight
      ) {
        fetchPokemon(pokemonPagination?.next)
      }
    }

    checkNeedLoadmore()
  }, [isFetching, pokemonPagination?.next, activePokemon])

  return (
    <div className="flex justify-center pb-10 px-3">
      <main className="lg:w-[1024px] sm:w-[800px] w-[480px] relative">
        <h1 className="text-[40px] font-bold mt-10 mb-6">Pokedex</h1>
        <div className="flex flex-wrap gap-4 mb-4">
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
        {isFetching && (
          <div className="flex justify-center">
            <Spinner></Spinner>
          </div>
        )}
        <EvolutionClickProvider getPokemonDetail={getPokemonDetail}>
          {activePokemon && (
            <CardDetail
              pokemon={activePokemon}
              handleCloseClick={handleCloseClick}
              className="absolute top-0 left-0 w-[inherit] h-[-webkit-fill-available]"
              useAnimation={true}
            ></CardDetail>
          )}
        </EvolutionClickProvider>
      </main>
    </div>
  )
}
