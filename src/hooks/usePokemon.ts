'use client'
import type {
  Pokemon,
  PokemonList,
  PokemonEvolutionList,
  PokemonEvolutionResponse,
  PokemonSpeciesResponse,
  PokemonPagination,
  PokemonEvolution
} from '@/types/pokemon'
import { useState, useEffect } from 'react'

/**
 * Custom hooks to manage Pokemon
 */
const usePokemon = () => {
  const apiURL = 'https://pokeapi.co/api/v2/pokemon'
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [pokemonMapping, setPokemonMapping] = useState<{
    [key: string]: Pokemon
  }>({})
  const [pokemonPagination, setPokemonPagination] =
    useState<PokemonPagination>()
  const [activePokemon, setActivePokemon] = useState<Pokemon>()
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

  function getPokemonByName(name: string) {
    return new Promise((resolve, reject) => {
      fetch(`${apiURL}/${name}`)
        .then((res) => res.json())
        .then((data) => {
          resolve(data)
        })
        .catch((error) => reject(error))
    })
  }

  function getPokemonSpecies(
    pokemoSpeciesUrl: string
  ): Promise<PokemonSpeciesResponse> {
    return new Promise((resolve, reject) => {
      fetch(pokemoSpeciesUrl)
        .then((res) => res.json())
        .then((data) => {
          resolve(data)
        })
        .catch((error) => reject(error))
    })
  }

  function getPokemonEvolution(
    pokemoEvolutionUrl: string
  ): Promise<PokemonEvolutionResponse> {
    return new Promise((resolve, reject) => {
      fetch(pokemoEvolutionUrl)
        .then((res) => res.json())
        .then((data) => {
          resolve({ ...data })
        })
        .catch((error) => reject(error))
    })
  }

  function constructEvolution(evolution: PokemonEvolution): string[] {
    if (evolution.evolves_to.length === 0) return [evolution.species.name]
    return [
      evolution.species.name,
      ...constructEvolution(evolution.evolves_to[0])
    ]
  }

  const getPokemonDetail = async (pokemonItem: Pokemon) => {
    try {
      if (!pokemonItem.evolution_chain || !pokemonItem.color) {
        const speciesResult = await getPokemonSpecies(pokemonItem.species.url)
        pokemonItem.evolution_chain = speciesResult.evolution_chain
        pokemonItem.color = speciesResult.color.name
      }
      const evolutionResult = await getPokemonEvolution(
        pokemonItem.evolution_chain?.url!
      )
      const allPokemonEvolutionName = constructEvolution(evolutionResult.chain)

      const pokemonResult = await Promise.allSettled(
        allPokemonEvolutionName.map((pokemonName) =>
          pokemonMapping[pokemonName]
            ? Promise.resolve(pokemonMapping[pokemonName])
            : getPokemonByName(pokemonName)
        )
      )
      const fullfiledPokemonResult: { [key: string]: Pokemon } = pokemonResult
        .filter(
          (result): result is PromiseFulfilledResult<Pokemon> =>
            result.status === 'fulfilled'
        )
        .map((result) => result.value)
        .reduce(
          (result, item) => ({
            ...result,
            [item.name]: item
          }),
          {}
        )

      setPokemonMapping({ ...pokemonMapping, ...fullfiledPokemonResult })

      const evolutionWithPokemonData: PokemonEvolutionList[] =
        allPokemonEvolutionName.map((name) => ({
          name,
          pokemon: fullfiledPokemonResult[name]
        }))

      const newPokemon = {
        ...pokemonItem,
        evolution: evolutionWithPokemonData
      }

      setActivePokemon(newPokemon)
    } catch (error) {
      // console.error(error)
    }

    // setPokemon((prev) => {
    //   const updated = [...prev]
    //   updated[index] = newPokemon
    //   return updated
    // })
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

    const pokemonSpeciesResult: { [key: string]: PokemonSpeciesResponse } =
      fullfiledSpeciesResult.reduce(
        (result, item) => ({
          ...result,
          [item.name]: item
        }),
        {}
      )

    // const evolutionResult = await Promise.allSettled(
    //   fullfiledSpeciesResult.map((pokemon) =>
    //     getPokemonEvolution(pokemon.evolution_chain.url, pokemon.id)
    //   )
    // )
    // const fullfiledEvolutionResult: { [key: string]: PokemonEvolutionList } =
    //   evolutionResult
    //     .filter(
    //       (result): result is PromiseFulfilledResult<PokemonEvolutionList> =>
    //         result.status === 'fulfilled'
    //     )
    //     .reduce(
    //       (result, item) => ({
    //         ...result,
    //         [item.value.pokemonId]: item.value
    //       }),
    //       {}
    //     )
    const finalResult: Pokemon[] = fullfiledResult.map((item) => ({
      ...item,
      // evolution: fullfiledEvolutionResult[item.id],
      evolution_chain: pokemonSpeciesResult[item.name].evolution_chain,
      color: pokemonSpeciesResult[item.name].color.name
    }))
    setPokemon([...pokemon, ...finalResult])

    const pokemonDetailResult: { [key: number]: Pokemon } = finalResult.reduce(
      (result, item) => ({
        ...result,
        [item.name]: item
      }),
      {}
    )
    setPokemonMapping({ ...pokemonMapping, ...pokemonDetailResult })
    setIsFetching(false)
  }

  async function fetchPokemon(url = apiURL) {
    try {
      setIsFetching(true)
      const response = await fetch(url)
      const result = await response.json()
      setPokemonPagination(result)
      loadPokemon(result.results)
    } catch (error) {
      setError(error as Error)
    }
  }

  useEffect(() => {
    fetchPokemon()
  }, [])

  return {
    pokemon,
    pokemonPagination,
    activePokemon,
    fetchPokemon,
    getPokemonDetail,
    setActivePokemon,
    isFetching,
    error
  }
}

export default usePokemon
