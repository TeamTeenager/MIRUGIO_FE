import { motion, AnimatePresence } from 'framer-motion'
import sapImg from '../../assets/sap.svg'
import hammerImg from '../../assets/hammer.svg'
import drillImg from '../../assets/drille.svg'
import forcraneImg from '../../assets/forcrane.svg'
import carImg from '../../assets/car.svg'
import type { Importance } from '../../types'

const toolIcons: Record<Importance, string> = {
  1: sapImg,
  2: hammerImg,
  3: drillImg,
  4: forcraneImg,
  5: carImg,
}

interface Props {
  importance: Importance | null
}

export default function ConstructionAnim({ importance }: Props) {
  return (
    <AnimatePresence>
      {importance !== null && (
        <motion.div
          key={importance}
          className="absolute top-0 left-0 right-0 z-10 pointer-events-none flex justify-around px-2"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.3 } }}
        >
          {[0, 1, 2].map((i) => (
            <motion.img
              key={i}
              src={toolIcons[importance]}
              alt=""
              className="w-36 h-36 drop-shadow-xl"
              initial={{ y: -30, rotate: -30 }}
              animate={{
                y: [-30, 6, -30, 6, -30, 6, -30, 6, -30, 6, -30, 6, -30, 6, -30, 6],
                rotate: [-30, 15, -30, 15, -30, 15, -30, 15, -30, 15, -30, 15, -30, 15, -30, 15],
              }}
              transition={{
                duration: 5,
                ease: 'easeInOut',
                delay: i * 0.18,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
