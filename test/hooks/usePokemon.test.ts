import { waitFor, renderHook, act } from '@testing-library/react'
import { Pokemon } from '@/types/pokemon'
import usePokemon from '@/hooks/usePokemon'
import getPokemon from '../__mocks__/getPokemon.json'
import getPokemonById from '../__mocks__/getPokemonById.json'
import getPokemonSpecies from '../__mocks__/getPokemonSpecies.json'
import getPokemonEvolution from '../__mocks__/getPokemonEvolution.json'

global.fetch = jest.fn()

describe('usePokemon', () => {
  it('should return the initial values', async () => {
    const { result } = renderHook(() => usePokemon())

    expect(result.current.pokemon.length).toBe(0)
    expect(result.current.activePokemon).toBe(undefined)
    expect(result.current.pokemonPagination).toBe(undefined)
    expect(result.current.isFetching).toBe(true)
    expect(result.current.error).toBe(undefined)

    await waitFor(() => {
      expect(result.current.isFetching).toBe(true)
      expect(result.current.error?.message).toBe(
        "Cannot read properties of undefined (reading 'json')"
      )
    })
  })

  describe('getPokemon', () => {
    describe('success', () => {
      beforeEach(() => {
        global.fetch = jest
          .fn()
          .mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(getPokemon)
          })
          .mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(getPokemonById)
          })
          .mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(getPokemonSpecies)
          })
        // .mockResolvedValueOnce({
        //   json: jest.fn().mockResolvedValue(getPokemonEvolution)
        // })
      })

      it('should return successfully', async () => {
        const { result } = renderHook(() => usePokemon())

        const pokemonData = [
          {
            ...getPokemonById,
            evolution_chain: getPokemonSpecies.evolution_chain,
            color: getPokemonSpecies.color.name
          }
        ]

        await waitFor(() =>
          expect(result.current).toEqual({
            pokemon: pokemonData,
            activePokemon: undefined,
            pokemonPagination: getPokemon,
            fetchPokemon: expect.any(Function),
            getPokemonDetail: expect.any(Function),
            setActivePokemon: expect.any(Function),
            isFetching: false,
            error: undefined
          })
        )
      })
    })

    describe('error', () => {
      const errorMessage = 'example error'
      const mockedError = new Error(errorMessage)

      beforeEach(() => {
        global.fetch = jest.fn().mockRejectedValue(mockedError)
      })

      it('should return error', async () => {
        const { result } = renderHook(() => usePokemon())

        await waitFor(() => {
          expect(result.current.error?.message).toBe(errorMessage)
        })
      })
    })
  })

  describe('getPokemonDetail', () => {
    describe('success', () => {
      beforeEach(() => {
        global.fetch = jest
          .fn()
          .mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(getPokemon)
          })
          .mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(getPokemonById)
          })
          .mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(getPokemonSpecies)
          })
          .mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(getPokemonSpecies)
          })
          .mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(getPokemonEvolution)
          })
      })

      it('should return successfully', async () => {
        const { result } = renderHook(() => usePokemon())

        const pokemonData = [
          {
            ...getPokemonById,
            evolution_chain: getPokemonSpecies.evolution_chain,
            color: getPokemonSpecies.color.name
          }
        ]

        const pokemonDetailData = {
          ...getPokemonById,
          evolution: [{ name: getPokemonById.name, pokemon: getPokemonById }]
        }

        await waitFor(() =>
          expect(result.current).toEqual({
            pokemon: pokemonData,
            activePokemon: undefined,
            pokemonPagination: getPokemon,
            fetchPokemon: expect.any(Function),
            getPokemonDetail: expect.any(Function),
            setActivePokemon: expect.any(Function),
            isFetching: false,
            error: undefined
          })
        )

        act(() => {
          result.current.getPokemonDetail(
            pokemonDetailData as unknown as Pokemon
          )
        })

        await waitFor(() => {
          expect(result.current.activePokemon).toEqual({
            ...getPokemonById,
            evolution_chain: getPokemonSpecies.evolution_chain,
            color: getPokemonSpecies.color.name,
            evolution: [
              {
                name: getPokemonById.name,
                pokemon: {
                  ...getPokemonById,
                  evolution_chain: getPokemonSpecies.evolution_chain,
                  color: getPokemonSpecies.color.name
                }
              },
              {
                name: 'ivysaur',
                pokemon: undefined
              },
              {
                name: 'venusaur',
                pokemon: undefined
              }
            ]
          })
          expect(result.current.isFetching).toEqual(false)
        })
      })
    })

    describe('error', () => {
      const errorMessage = 'creat error'
      const mockedError = new Error(errorMessage)

      beforeEach(() => {
        global.fetch = jest
          .fn()
          .mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(getPokemon)
          })
          .mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(getPokemonById)
          })
          .mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(getPokemonSpecies)
          })
          .mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(getPokemonSpecies)
          })
          .mockRejectedValueOnce(mockedError)
      })

      it('should return error', async () => {
        const { result } = renderHook(() => usePokemon())

        const pokemonData = [
          {
            ...getPokemonById,
            evolution_chain: getPokemonSpecies.evolution_chain,
            color: getPokemonSpecies.color.name
          }
        ]

        const pokemonDetailData = {
          ...getPokemonById,
          evolution: [{ name: getPokemonById.name, pokemon: getPokemonById }]
        }

        await waitFor(() =>
          expect(result.current).toEqual({
            pokemon: pokemonData,
            activePokemon: undefined,
            pokemonPagination: getPokemon,
            fetchPokemon: expect.any(Function),
            getPokemonDetail: expect.any(Function),
            setActivePokemon: expect.any(Function),
            isFetching: false,
            error: undefined
          })
        )

        act(() => {
          result.current.getPokemonDetail(
            pokemonDetailData as unknown as Pokemon
          )
        })

        await waitFor(() =>
          expect(result.current.activePokemon).toEqual(undefined)
        )
      })
    })
  })

  // describe('deleteTask', () => {
  //   let mockedData
  //   beforeEach(() => {
  //     mockedData = [
  //       {
  //         id: 1,
  //         title: 'Finish an interview'
  //       },
  //       {
  //         id: 2,
  //         title: 'Study React'
  //       }
  //     ]

  //     global.fetch.mockResolvedValueOnce({
  //       json: jest.fn().mockResolvedValueOnce(mockedData)
  //     })
  //   })

  //   describe('success', () => {
  //     it('should return successfully', async () => {
  //       const { result } = renderHook(() => useTask())

  //       await waitFor(() =>
  //         expect(result.current).toEqual({
  //           tasks: mockedData,
  //           isFetching: false,
  //           error: null,
  //           createTask: expect.any(Function),
  //           deleteTask: expect.any(Function)
  //         })
  //       )

  //       global.fetch.mockResolvedValueOnce({
  //         json: jest.fn().mockResolvedValueOnce({})
  //       })

  //       act(() => {
  //         result.current.deleteTask(2)
  //       })

  //       expect(result.current.error).toBe(null)

  //       await waitFor(() =>
  //         expect(result.current).toEqual({
  //           tasks: [mockedData[0]],
  //           isFetching: false,
  //           error: null,
  //           createTask: expect.any(Function),
  //           deleteTask: expect.any(Function)
  //         })
  //       )
  //     })
  //   })

  //   describe('error', () => {
  //     const errorMessage = 'delete error'
  //     const mockedError = new Error(errorMessage)

  //     it('should return error', async () => {
  //       const { result } = renderHook(() => useTask())

  //       await waitFor(() =>
  //         expect(result.current).toEqual({
  //           tasks: mockedData,
  //           isFetching: false,
  //           error: null,
  //           createTask: expect.any(Function),
  //           deleteTask: expect.any(Function)
  //         })
  //       )

  //       global.fetch.mockRejectedValue(mockedError)

  //       act(() => {
  //         result.current.deleteTask(2)
  //       })

  //       expect(result.current.error).toBe(null)

  //       await waitFor(() =>
  //         expect(result.current).toEqual({
  //           tasks: mockedData,
  //           isFetching: false,
  //           error: errorMessage,
  //           createTask: expect.any(Function),
  //           deleteTask: expect.any(Function)
  //         })
  //       )
  //     })
  //   })
  // })
})
