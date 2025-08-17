import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { backgroundColor, pokemonColor } from '@/types/pokemon'
import type { Pokemon } from '@/types/pokemon'
import CardTab from '@/components/molecules/card-tab'
import './index.scss'

type CardProps = {
  pokemon: Pokemon
  handleCloseClick?: () => void
  className?: string
  useAnimation?: boolean
}

export default function Card({
  className,
  pokemon,
  handleCloseClick,
  useAnimation
}: CardProps) {
  const [computedClassName, setComputedClassName] = useState(className)
  const componentRef = useRef<HTMLDivElement | null>(null)
  const closeClicked = useRef(true)
  const initialized = useRef(true)
  function capitalizeFirst(str: string) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
  }

  function handleCloseClicked() {
    // setComputedClassName(className)
    setComputedClassName(`${className} slidedown`)
    if (closeClicked.current) {
      closeClicked.current = false
    }
  }

  // useEffect(() => {
  //   setComputedClassName(`${className} show`)
  // }, [])
  useEffect(() => {
    if (initialized.current) {
      const scrollY = window.scrollY // save position
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      const docHeight = document.documentElement.scrollHeight
      if (componentRef.current) {
        componentRef.current.style.height = docHeight + 'px'
      }
      initialized.current = false
    }
  }, [])

  useEffect(() => {
    // if (!closeClicked.current && !computedClassName?.includes('show')) {
    if (!closeClicked.current && computedClassName?.includes('slidedown')) {
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      // restore scroll position
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
      setTimeout(() => {
        handleCloseClick && handleCloseClick()
      }, 600)
    }
  }, [computedClassName])

  return (
    <div
      ref={componentRef}
      className={`pokemon-card-detail bg-white ${computedClassName} ${useAnimation ? 'pokemon-card-detail--use-animation' : ''}`}
      data-testid={`pokemon-card-${pokemon.name}-detail`}
    >
      <div className="pokemon-card-detail__container">
        <div
          style={{
            backgroundColor:
              pokemonColor[pokemon.name as keyof typeof pokemonColor] ||
              backgroundColor.green
          }}
        >
          <div className="flex justify-between items-center px-5 py-4">
            <div>
              <h3 className="text-[40px] font-bold mb-1 text-white">
                {capitalizeFirst(pokemon.name)}
              </h3>
              <div className="flex">
                {pokemon.types.map((type, i) => {
                  return (
                    <div className="pokemon-card-detail__skill" key={i}>
                      {type.type.name}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="pokemon-card-detail__order">
              <div>
                # <span>{pokemon.order}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image
              className="pokemon-card-detail__image"
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              width={300}
              height={300}
              priority
            />
          </div>
          <div
            className="pokemon-card-detail__close"
            onClick={handleCloseClicked}
            data-testid={`pokemon-card-${pokemon.name}-detail-close`}
          >
            &#x2715;
          </div>
        </div>
        <CardTab pokemon={pokemon}></CardTab>
      </div>
    </div>
  )
}
