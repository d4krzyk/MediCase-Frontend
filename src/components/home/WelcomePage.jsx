


import { motion } from "framer-motion";
const pathLogo = {
    hidden: {
      pathLength: 0,
      opacity: 0,
      fill: "rgba(255, 255, 255, 0)",
      y: "50%"
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      fill: "rgba(255, 255, 255, 1)",
      y: "0%",
      transition: {
        duration: "3.5",
        ease: "easeOut"
      }
    }
  };
  const pathCircle = {
    hidden: {
      pathLength: 0,
      opacity: 0,
      fill: "rgba(255, 255, 255, 0)",
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      fill: "rgba(255, 255, 255, 1)",
      transition: {
        delay: "2.2",
        duration: "1.5",
        ease: "easeOut"
      }
    }
  };
  const pathChildren2 = {
    hidden: {
      pathLength: 0,
      opacity: 0,
      x: "-5%",
      fill: "rgba(255, 255, 255, 0)",
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      x: "0%",
      fill: "rgba(255, 255, 255, 1)",
      transition: {
        delay: "2.2",
        duration: "1.5",
        ease: "easeInOut"
      }
    }
  };
  const pathChildrenScrolls = {
    hidden: {
      pathLength: 0,
      opacity: 0,
      ///rotateX: 360,
      //rotateY: 180,
      //y: "20%",
      x: "-25%",
      fill: "#b21f50",
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      //rotateX: 0,
      //rotateY: 0,
      //y: "0%",
      x: "0%",
      fill: "#2fb3aa",
      //stroke: "rgba(100, 200, 170, 0)",
      transition: {
        delay: "3.7",
        duration: "1.6",
        ease: "easeOut"
      }
    }
  };
  const pathChildren3 = {
    hidden: {
      pathLength: 0,
      opacity: 0,
      x: "5%",
      fill: "rgba(255, 255, 255, 0)",
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      x: "0%",
      fill: "rgba(255, 255, 255, 1)",
      transition: {
        delay: "3.5",
        duration: "1.0",
        ease: "easeOut"
      }
    }
  };
  /*
  const pathChildren4 = {
    hidden: {
      pathLength: 0,
      opacity: 0,
      y: "10%",
      fill: "rgba(255, 255, 255, 0)",
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      y: "0%",
      fill: "rgba(255, 255, 255, 1)",
      transition: {
        delay: "5",
        duration: "1.0",
        ease: "easeOut"
      }
    }
  };*/

  const styles = {
    cls_1: {
      fill: 'none',
    },
    cls_2: {
      fill: 'white',
    },
}




const pathStyle = {
    path: {overflow: 'visible', stroke: '#fff', strokeWidth: 3,strokeLinejoin: 'round', strokeLinecap: 'round', }
  }

export function WelcomePage() { 
return (
        <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1100.65 459.66"
        style={{
          overflow: 'visible',
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50vw', height: '50vh' }}
        >
        <motion.path    
        variants={pathLogo} 
        initial="hidden"
        animate="visible"
        style={pathStyle.path}
        className={`${styles.cls_1} ${pathStyle.path}`} d="M572.49,163.8a60.29,60.29,0,0,1-33.19-7.73A57.09,57.09,0,0,1,528,147.48v-26H485.68a60.22,60.22,0,0,1,7.72-33.18A56.51,56.51,0,0,1,502,77h26V34.62a60.26,60.26,0,0,1,33.19,7.73,56.79,56.79,0,0,1,11.26,8.59V77H614.8a60.18,60.18,0,0,1-7.68,33.2,56.57,56.57,0,0,1-8.56,11.24H572.49ZM538,143.05a47.39,47.39,0,0,0,14.89,8.15,46.88,46.88,0,0,0,9.56,2.09V111.43h31.6a44.72,44.72,0,0,0,4.38-6.25A47.12,47.12,0,0,0,604.4,87H562.49V55.37A44.24,44.24,0,0,0,556.26,51,48.31,48.31,0,0,0,538,45.13V87H506.43a43.11,43.11,0,0,0-4.35,6.23,48.26,48.26,0,0,0-5.89,18.21H538Z"/>
        <motion.path 
         variants={pathCircle} 
         initial="hidden"
         animate="visible"
         style={pathStyle.path}
         className={`${styles.cls_1}`} d="M550.32,197.36c-54.28,0-99.3-43.89-100.69-98.16C450.78,44.82,495.28.77,548.88,0c54.68-.78,101,43.72,102.14,99.2C649.63,153.48,604.61,197.36,550.32,197.36Zm0-186.34c-49.55-1-90.64,39.35-90.7,88.11-.05,49.45,42.12,90.25,92.35,88.26,48.86.21,89-39.84,89-88.11C641.07,50.34,599.88,9.88,550.33,11Z"/>

    <motion.path variants={pathChildren2} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M12.07,238.76l58.27,68.59,58.18-68.59h12.16V370.51H118.19v-90L70.34,337.7,22.4,280.49v90H0V238.76Z"/>
    <motion.path variants={pathChildren2} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M258.69,238.76v20.38H189.41v29h53.71v20.21H189.41v41.82h69.28v20.38H166.83V238.76Z"/>
    <motion.path variants={pathChildren2} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M347.32,241.73c27.82,8.05,47.85,32.55,47.85,62.91s-19.95,54.76-47.85,62.9c-6.57,1.83-13.3,2.88-25.2,2.88H280.3V238.76h41.82C334,238.76,340.75,239.81,347.32,241.73ZM344,346.89c17.41-6.47,28.7-22.66,28.7-42.17S361.4,269,344,262.47c-5.16-2-10.85-3.24-21.87-3.24H302.7v90.9h19.42C333.06,350,338.83,348.9,344,346.89Z"/>
    <motion.path variants={pathChildren2} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M414.94,238.76h22.49V370.51H414.94Z"/>
    
    <motion.path variants={pathChildrenScrolls} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M490.27,241.3l47.85,62.81-47.85,62.81H467.43l47.33-62.81L467.43,241.3Zm57.91,0L596,304.11l-47.86,62.81H525.35l47.33-62.81L525.35,241.3Z"/>
    
    <motion.path variants={pathChildren3} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M724.2,291.77C718.08,272.18,702,260,680.55,260c-26.51,0-45.41,19.68-45.41,45.58,0,25.11,18.55,45.49,45.41,45.49,21.34,0,37.62-12.34,43.83-32.37l21.34,6.56c-8.05,27.56-34.12,46.19-65.17,46.19-37.88,0-68.42-28.25-68.42-65.87,0-37.1,29.57-66,68.42-66,30.18,0,56.08,16.8,64.91,45.32Z"/>
    <motion.path variants={pathChildren3} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M843.62,347H779.76l-9.63,24.41H746.51l54.15-131.76h22.23L877,371.39H853.42Zm-56-20.12h48.12l-24-60.81Z"/>
    <motion.path variants={pathChildren3} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M898,332.19c11.63,11.46,26.5,18.64,41.73,18.64s27.82-7.61,27.82-19.34c0-14.43-19.16-17.06-39.2-21.17-22.13-4.46-42-12.25-42-34,0-20.47,16.8-36.83,46-36.83a75.36,75.36,0,0,1,48.29,18L967.5,273c-9.19-8.4-22.49-13.39-35.43-13.39-13.21,0-23.8,5.77-23.8,15,0,10.5,12.42,13.21,32.55,16.8,21.17,3.58,49.07,10.58,49.07,40.15,0,22.66-21.17,39.81-49.69,39.81-18.19,0-38.58-7-56.08-23.62Z"/>  
    <motion.path variants={pathChildren3} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M1100.65,239.72v20.39h-69.29v28.95h53.72v20.21h-53.72v41.82h69.29v20.38h-91.86V239.72Z"/>
    {/*
    <motion.path style={pathStyle.path}  variants={pathChildren4} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M208.21,428.43c-5.89-20.58-39-16-38.23,5.95-.72,22.05,32.56,26.56,38.32,5.68l6.13,1.84c-7.66,26.94-51.54,21.45-50.83-7.53-.82-28.49,42.77-34.6,50.74-7.78Z"/>
    <motion.path style={pathStyle.path}  variants={pathChildren4} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M245.31,459.66c-34.11.34-34.2-50.81,0-50.48C279.5,408.92,279.41,459.94,245.31,459.66Zm0-44.62c-25.75-.36-25.66,39,0,38.58C271,454,271.05,414.67,245.31,415Z"/>
    <motion.path style={pathStyle.path}  variants={pathChildren4} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M285.46,409.09v44.62h27.65v6h-34V409.18h6.38Z"/>
    <motion.path style={pathStyle.path}  variants={pathChildren4} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M327,409.09v44.62h27.64v6h-34V409.18H327Z"/>
    <motion.path style={pathStyle.path}  variants={pathChildren4} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M396.05,409.09V415H368.49v14h21.69v5.78H368.49v19h27.56v5.86H362.1V409.09Z"/>
    <motion.path style={pathStyle.path}  variants={pathChildren4} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M439.44,420.47C428,408.79,405.09,417.25,406,434.38c-.47,24.68,38.37,26,38.93.61h-20V429h25.89c7.12,36.47-50.27,41.95-51.09,5.25-1.1-22,28.53-33.22,43.74-18.55Z"/>
    <motion.path style={pathStyle.path}  variants={pathChildren4} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M459,409.09h6.39v50.48H459Z"/>
    <motion.path style={pathStyle.path}  variants={pathChildren4} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M481.78,409.09c1.72,12.69-7,44.58,13.91,44.53,21,.12,12.28-31.86,14-44.53h6.38c-.94,17.3,6.54,50.35-20.38,50.48-27-.17-19.43-33.17-20.38-50.48Z"/>
    <motion.path style={pathStyle.path}  variants={pathChildren4} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M529.55,409.09,552,436.65l22.49-27.56h3.32v50.48h-6.3v-38L552,445.84,532.61,421.6v38h-6.39V409.09Z"/>
    <motion.path style={pathStyle.path}  variants={pathChildren4} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M611.26,409.09l22.48,27.56,22.49-27.56h3.32v50.48h-6.39v-38l-19.51,24.24L614.23,421.6v38h-6.38V409.09Z"/>
    <motion.path style={pathStyle.path}  variants={pathChildren4} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M703.82,409.09V415H676.26v14H698v5.78h-21.7v19h27.56v5.86h-34V409.09Z"/>
    <motion.path style={pathStyle.path}  variants={pathChildren4} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M736.36,410.23c24.15,6,24.14,42.3,0,48.29-4.24,1.66-18.67.88-24.14,1.05V409.09C717.77,409.2,732,408.58,736.36,410.23Zm-1.05,42.43c17-4.66,17.18-31.87,0-36.48-2.77-1.37-12.46-1-16.71-1.05V453.8C722.87,453.82,732.53,454,735.31,452.66Z"/>
    <motion.path style={pathStyle.path}  variants={pathChildren4} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M762.52,409.09h6.39v50.48h-6.39Z"/>
    <motion.path style={pathStyle.path}  variants={pathChildren4} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M821.4,428.43c-5.9-20.58-39-16-38.23,5.95-.73,22.05,32.56,26.56,38.32,5.68l6.12,1.84c-7.66,26.94-51.53,21.45-50.83-7.53-.81-28.49,42.78-34.6,50.74-7.78Z"/>
    <motion.path style={pathStyle.path}  variants={pathChildren4} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M841.08,409.09c1.72,12.69-7,44.58,13.91,44.53,21,.12,12.28-31.86,14-44.53h6.39c-1,17.3,6.53,50.35-20.39,50.48-27-.17-19.43-33.17-20.38-50.48Z"/>
    <motion.path style={pathStyle.path}  variants={pathChildren4} initial="hidden" animate="visible" className={`${styles.cls_2}`} d="M888.85,409.09l22.48,27.56,22.49-27.56h3.32v50.48h-6.39v-38l-19.5,24.24L891.82,421.6v38h-6.38V409.09Z"/>
    */}
    </motion.svg>
)
}

