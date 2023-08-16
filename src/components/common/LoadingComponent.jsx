import { motion } from "framer-motion";


export function LoadingComponent() { 

    //const loadingArrowsSize = size - 5;
return (
    <div 
        style={{ width: '45px', height: '45px', backdropFilter: "blur(5px)" }} 
        className="d-flex p-2 pe-3 bg-opacity-75 overflow-hidden justify-content-center align-items-center bg-background rounded-3">
        <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 21.34 14.61"
        style={{
          overflow: 'visible',
          width: '35px', 
          height: '35px',
          }}
        >
        <motion.path animate={{
            x: [0, 7, 7, 13, 13, 20, 0], opacity: [0, 1, 1,1, 1, 0, 0],
            rotateX: [0, 0, 0, 180, 180,180, 0]
        }}
        style={{fill: 'rgb(68, 207, 192)'}}
        transition={{ duration: 2.2, repeat: Infinity, }}
        d="M2.61,0H0L5.41,7.32,0,14.61H2.61L8.08,7.32Z" />
        

        <motion.path animate={{
           x: [0, 6, 6, 13, -7, 0, 0], opacity: [1, 1,1, 0, 0, 1, 1],

        }}
        style={{fill: 'rgb(154, 51 ,103)'}}
        transition={{ duration: 2.2, repeat: Infinity, }}
        d="M9.21,0H6.6L12,7.32,6.6,14.61H9.21l5.47-7.29Z" />


        <motion.path animate={{
           x: [0, 7, -13, -6, -6, 0, 0], opacity: [1, 0,0, 1, 1, 1, 1],
        }}
        style={{fill: 'white'}}
        transition={{ duration: 2.2, repeat: Infinity, }}
        d="M15.87,0H13.26l5.41,7.29-5.41,7.29h2.61l5.47-7.29Z" />
        
 
    
    </motion.svg>
    </div>
)
}

