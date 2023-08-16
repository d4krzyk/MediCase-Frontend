import { motion } from 'framer-motion';

export default function FadeMotionFramer(props) {
  return (
    <motion.div
      key={'MainContainer'}
      initial={'initialState'}
      animate={'animateState'}
      exit={'exitState'}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
      }}
      variants={{
        initialState: {
          y: '-10%',
          opacity: 0,
        },
        animateState: {
          y: '0%',
          opacity: 1,
        },
        exitState: {
          y: '-10%',
          opacity: 0,
          transition: { duration: 0.6, ease: 'easeOut' },
        },
      }}
      
    >
        {props.children}
    </motion.div>
  );
}
