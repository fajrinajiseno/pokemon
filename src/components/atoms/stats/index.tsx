import { backgroundStatColor } from '@/types/pokemon'
import './index.scss'

type StatsProps = {
  value: number
}

export default function Stats({ value }: StatsProps) {
  function getBackgroundColour(data: number) {
    if (data < 50) return backgroundStatColor.low
    else if (data < 75) return backgroundStatColor.medium
    else return backgroundStatColor.good
  }
  function getStatWidth(data: number) {
    if (data < 0) return 0
    else if (data > 100) return 100
    else return data
  }

  return (
    <div className="pokemon-stats">
      <div
        style={{
          backgroundColor: getBackgroundColour(value),
          width: `${getStatWidth(value)}%`
        }}
      ></div>
    </div>
  )
}
