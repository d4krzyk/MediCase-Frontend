import { motion } from 'framer-motion';

const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
  };

export const ListFadeInMotionFramer = ({items}) => {

  return (
      <motion.ul
        initial={'closed'}
        animate={'open'}
        variants={{
          open: {
            clipPath: "inset(0% 0% 0% 0% round 10px)",
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.3,
              delayChildren: 0.15,
              staggerChildren: 0.05
            }
          },
          closed: {
            clipPath: "inset(10% 50% 90% 50% round 10px)",
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.3
            }
          }
        }}
      >
        {items.map((item, index) => {
          return (
            <motion.li key={index} variants={itemVariants} style={{listStyleType:"none", margin:"0", padding:"0"}}>
              {item}
            </motion.li>
          )
        })}
      </motion.ul>
  );
}