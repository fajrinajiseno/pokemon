'use client'
import { createContext, useContext } from 'react'
import type { Pokemon } from '@/types/pokemon'

type EvolutionClickCtx = {
  handleEvolutionClick: (pokemonItem: Pokemon) => void
}

const EvolutionClickContext = createContext<EvolutionClickCtx | null>(null)

export const useEvolutionClick = () => {
  const ctx = useContext(EvolutionClickContext)
  if (!ctx)
    throw new Error('useEvolutionClick must be used in EvolutionClickProvider')
  return ctx
}

type EvolutionClickProviderProps = {
  children: React.ReactNode
  getPokemonDetail: (pokemonItem: Pokemon) => void
}

export function EvolutionClickProvider({
  children,
  getPokemonDetail
}: EvolutionClickProviderProps) {
  function handleEvolutionClick(pokemonItem: Pokemon) {
    getPokemonDetail(pokemonItem)
  }

  return (
    <EvolutionClickContext.Provider value={{ handleEvolutionClick }}>
      {children}
    </EvolutionClickContext.Provider>
  )
}
