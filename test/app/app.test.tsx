import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Page from '@/app/page'
import getPokemonById from '../__mocks__/getPokemonById.json'
import getPokemonSpecies from '../__mocks__/getPokemonSpecies.json'
import getPokemonEvolution from '../__mocks__/getPokemonEvolution.json'
import usePokemon from '@/hooks/usePokemon'

jest.mock('@/hooks/usePokemon', () => jest.fn())

window.scrollTo = jest.fn()

const pokemonData = [
  {
    ...getPokemonById,
    evolution_chain: getPokemonSpecies.evolution_chain,
    color: getPokemonSpecies.color.name
  }
]

const pokemonDetailData = {
  ...pokemonData[0],
  evolution: [{ name: getPokemonById.name, pokemon: getPokemonById }]
}

const getPokemonDetailMock = jest.fn()

describe('Home page', () => {
  beforeEach(() => {
    jest.useFakeTimers() // swap in fake timers
  })
  afterEach(() => {
    jest.useRealTimers() // restore normal timers
  })

  it('renders properly', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    ;(usePokemon as jest.Mock).mockReturnValue({
      pokemon: pokemonData,
      isFetching: false,
      pokemonPagination: undefined,
      activePokemon: undefined,
      fetchPokemon: jest.fn(),
      getPokemonDetail: getPokemonDetailMock,
      setActivePokemon: jest.fn()
    })
    render(<Page />)
    const cardTitle = screen.getByTestId(
      `pokemon-card-${pokemonData[0].name}-name`
    )
    expect(cardTitle).toHaveTextContent('Bulbasaur')

    // open detail
    await user.click(screen.getByTestId(`pokemon-card-${pokemonData[0].name}`))
    expect(getPokemonDetailMock).toHaveBeenCalled()
    // ;(usePokemon as jest.Mock).mockReturnValue({
    //   pokemon: pokemonData,
    //   isFetching: false,
    //   pokemonPagination: undefined,
    //   activePokemon: pokemonDetailData,
    //   fetchPokemon: jest.fn(),
    //   getPokemonDetail: getPokemonDetailMock,
    //   setActivePokemon: jest.fn()
    // })
    // const cardDetail = screen.getByTestId(
    //   `pokemon-card-${pokemonData[0].name}-detail`
    // )
    // expect(cardDetail).toHaveTextContent('Bulbasaur')

    // // click tab
    // await user.click(screen.getByTestId('pokemon-card-tab-navigation-About'))
    // expect(
    //   screen.getByTestId('pokemon-card-tab-content-About')
    // ).toBeInTheDocument()
    // await user.click(
    //   screen.getByTestId('pokemon-card-tab-navigation-Base Stats')
    // )
    // expect(
    //   screen.getByTestId('pokemon-card-tab-content-Base Stats')
    // ).toBeInTheDocument()
    // await user.click(
    //   screen.getByTestId('pokemon-card-tab-navigation-Evolutions')
    // )
    // expect(
    //   screen.getByTestId('pokemon-card-tab-content-Evolutions')
    // ).toBeInTheDocument()
    // await user.click(screen.getByTestId('pokemon-card-tab-navigation-Moves'))
    // expect(
    //   screen.getByTestId('pokemon-card-tab-content-Moves')
    // ).toBeInTheDocument()

    // await user.click(
    //   screen.getByTestId(`pokemon-card-${pokemonData[0].name}-detail-close`)
    // )
    // act(() => {
    //   // Fast-forward 1000ms
    //   jest.advanceTimersByTime(1000)
    // })

    // expect(
    //   screen.queryByTestId(`pokemon-card-${pokemonData[0].name}-detail`)
    // ).not.toBeInTheDocument()
  })

  it('renders detail properly', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    ;(usePokemon as jest.Mock).mockReturnValue({
      pokemon: pokemonData,
      isFetching: false,
      pokemonPagination: undefined,
      activePokemon: pokemonDetailData,
      fetchPokemon: jest.fn(),
      getPokemonDetail: getPokemonDetailMock,
      setActivePokemon: jest.fn()
    })
    render(<Page />)
    const cardTitle = screen.getByTestId(
      `pokemon-card-${pokemonData[0].name}-name`
    )
    expect(cardTitle).toHaveTextContent('Bulbasaur')

    // open detail
    await user.click(screen.getByTestId(`pokemon-card-${pokemonData[0].name}`))
    expect(getPokemonDetailMock).toHaveBeenCalled()
    const cardDetail = screen.getByTestId(
      `pokemon-card-${pokemonData[0].name}-detail`
    )
    expect(cardDetail).toHaveTextContent('Bulbasaur')

    // click tab
    await user.click(screen.getByTestId('pokemon-card-tab-navigation-About'))
    expect(
      screen.getByTestId('pokemon-card-tab-content-About')
    ).toBeInTheDocument()
    await user.click(
      screen.getByTestId('pokemon-card-tab-navigation-Base Stats')
    )
    expect(
      screen.getByTestId('pokemon-card-tab-content-Base Stats')
    ).toBeInTheDocument()
    await user.click(
      screen.getByTestId('pokemon-card-tab-navigation-Evolutions')
    )
    expect(
      screen.getByTestId('pokemon-card-tab-content-Evolutions')
    ).toBeInTheDocument()
    await user.click(
      screen.getByTestId(
        `pokemon-card-tab-content-Evolutions-${pokemonData[0].name}`
      )
    )
    expect(getPokemonDetailMock).toHaveBeenCalled()

    await user.click(screen.getByTestId('pokemon-card-tab-navigation-Moves'))
    expect(
      screen.getByTestId('pokemon-card-tab-content-Moves')
    ).toBeInTheDocument()

    await user.click(
      screen.getByTestId(`pokemon-card-${pokemonData[0].name}-detail-close`)
    )
    act(() => {
      // Fast-forward 1000ms
      jest.advanceTimersByTime(1000)
    })

    // expect(
    //   screen.queryByTestId(`pokemon-card-${pokemonData[0].name}-detail`)
    // ).not.toBeInTheDocument()
  })
})
