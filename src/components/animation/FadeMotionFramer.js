import { motion } from 'framer-motion';


export default function FadeMotionFramer(props) {
  return(
  <motion.div
    initial={'hidden'}
    animate={'visible'}
    variants={{
      visible: { opacity: 1 },
      hidden: { opacity: 0 },
    }}
    transition={{
      duration: 0.5,
      ease: 'easeOut',
    }}
    >
    {props.children}
    </motion.div>
  )
}
