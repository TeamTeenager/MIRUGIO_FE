import { motion, AnimatePresence } from 'framer-motion'
import type { Floor as FloorType, Importance } from '../../types'
import floor1 from '../../assets/1층.png'
import floor2 from '../../assets/2층.png'
import floor3 from '../../assets/3층.png'
import floor4 from '../../assets/4층.png'
import floor5 from '../../assets/5층.png'
import sapImg from '../../assets/sap.svg'
import hammerImg from '../../assets/hammer.svg'
import drillImg from '../../assets/drille.svg'
import forcraneImg from '../../assets/forcrane.svg'
import carImg from '../../assets/car.svg'

interface Props {
  floor: FloorType
  index: number
  isNew?: boolean
}

const floorImages: Record<number, string> = {
  1: floor1, 2: floor2, 3: floor3, 4: floor4, 5: floor5,
}

const toolIcons: Record<Importance, string> = {
  1: sapImg, 2: hammerImg, 3: drillImg, 4: forcraneImg, 5: carImg,
}

export default function Floor({ floor, index, isNew }: Props) {
  return (
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      exit={{
        x: [0, -8, 8, -6, 6, -3, 3, 0],
        scaleY: [1, 1, 1, 1, 1, 1, 0.5, 0],
        opacity: [1, 1, 1, 1, 1, 0.8, 0.4, 0],
        filter: ['brightness(1)', 'brightness(2.5) sepia(1) hue-rotate(-20deg)', 'brightness(1.5)', 'brightness(1)', 'brightness(1)', 'brightness(1)', 'brightness(1)', 'brightness(1)'],
        transition: { duration: 0.7, ease: 'easeIn' }
      }}
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

      {/* 공사 애니메이션 - 이 층 위에 직접 표시 */}
      <AnimatePresence>
        {isNew && (
          <motion.div
            className="absolute inset-0 flex items-center justify-around px-3 z-10 pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            {[0, 1, 2].map((i) => (
              <motion.img
                key={i}
                src={toolIcons[floor.importance as Importance]}
                alt=""
                className="w-24 h-24 drop-shadow-xl"
                initial={{ y: -20, rotate: -30 }}
                animate={{
                  y: [-20, 6, -20, 6, -20, 6, -20, 6, -20, 6, -20, 6, -20, 6, -20, 6],
                  rotate: [-30, 15, -30, 15, -30, 15, -30, 15, -30, 15, -30, 15, -30, 15, -30, 15],
                }}
                transition={{ duration: 5, ease: 'easeInOut', delay: i * 0.18 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
