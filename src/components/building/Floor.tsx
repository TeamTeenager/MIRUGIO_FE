import { motion } from 'framer-motion'
import type { Floor as FloorType } from '../../types'
import floor1 from '../../assets/1층.png'
import floor2 from '../../assets/2층.png'
import floor3 from '../../assets/3floor.svg'
import floor4 from '../../assets/4floor.svg'
import floor5 from '../../assets/5floor.svg'

interface Props {
  floor: FloorType
  index: number
}

const floorImages: Record<number, string> = {
  1: floor1,
  2: floor2,
  3: floor3,
  4: floor4,
  5: floor5,
}

export default function Floor({ floor, index }: Props) {
  return (
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      exit={{ scaleY: 0, opacity: 0, filter: 'brightness(2)', transition: { duration: 0.4 } }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      style={{ transformOrigin: 'bottom' }}
      className="relative w-full"
    >
      <img
        src={floorImages[floor.importance]}
        alt={`${floor.position + 1}층`}
        className="w-full block"
        draggable={false}
      />
      {/* 층 정보 오버레이 */}
      <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
        <span className="text-xs font-bold text-white/60 drop-shadow">{floor.position + 1}F</span>
        <span className="text-xs text-white/80 drop-shadow truncate mx-2 flex-1 text-right">
          {floor.title}
        </span>
      </div>
    </motion.div>
  )
}
