'use client'
import type {
  Pokemon,
  PokemonList,
  PokemonEvolutionList,
  PokemonSpeciesResponse
} from '@/types/pokemon'
import { useState, useEffect } from 'react'

/**
 * Custom hooks to manage Pokemon
 */
const usePokemon = () => {
  const apiURL = 'https://pokeapi.co/api/v2/pokemon'
  const [pokemon, setPokemon] = useState<Pokemon[]>()
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<Error>()

  function getPokemon(data: PokemonList) {
    return new Promise((resolve, reject) => {
      fetch(data.url)
        .then((res) => res.json())
        .then((data) => {
          resolve(data)
        })
        .catch((error) => reject(error))
    })
  }
  function getPokemonSpecies(pokemoSpeciesUrl: string) {
    return new Promise((resolve, reject) => {
      fetch(pokemoSpeciesUrl)
        .then((res) => res.json())
        .then((data) => {
          resolve(data)
        })
        .catch((error) => reject(error))
    })
  }

  function getPokemonEvolution(pokemoEvolutionUrl: string, pokemonId: number) {
    return new Promise((resolve, reject) => {
      fetch(pokemoEvolutionUrl)
        .then((res) => res.json())
        .then((data) => {
          resolve({ ...data, pokemonId })
        })
        .catch((error) => reject(error))
    })
  }

  const loadPokemon = async (data: PokemonList[]) => {
    const result = await Promise.allSettled(
      data.map((pokemon) => getPokemon(pokemon))
    )
    const fullfiledResult: Pokemon[] = result
      .filter(
        (result): result is PromiseFulfilledResult<Pokemon> =>
          result.status === 'fulfilled'
      )
      .map((result) => result.value)

    const speciesResult = await Promise.allSettled(
      fullfiledResult.map((pokemon) => getPokemonSpecies(pokemon.species.url))
    )
    const fullfiledSpeciesResult: PokemonSpeciesResponse[] = speciesResult
      .filter(
        (result): result is PromiseFulfilledResult<PokemonSpeciesResponse> =>
          result.status === 'fulfilled'
      )
      .map((result) => result.value)

    const evolutionResult = await Promise.allSettled(
      fullfiledSpeciesResult.map((pokemon) =>
        getPokemonEvolution(pokemon.evolution_chain.url, pokemon.id)
      )
    )
    const fullfiledEvolutionResult: { [key: string]: PokemonEvolutionList } =
      evolutionResult
        .filter(
          (result): result is PromiseFulfilledResult<PokemonEvolutionList> =>
            result.status === 'fulfilled'
        )
        .reduce(
          (result, item) => ({
            ...result,
            [item.value.pokemonId]: item.value
          }),
          {}
        )
    const finalResult: Pokemon[] = fullfiledResult.map((item) => ({
      ...item,
      evolution: fullfiledEvolutionResult[item.id]
    }))
    setPokemon(finalResult)
  }

  useEffect(() => {
    async function initPokemon() {
      try {
        const response = await fetch(apiURL)
        const result = await response.json()
        loadPokemon(result.results)
      } catch (error) {
        setError(error as Error)
      } finally {
        setIsFetching(false)
      }
    }
    initPokemon()
  }, [])

  return { pokemon, isFetching, error }
}

export default usePokemon
