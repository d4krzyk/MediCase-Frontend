import { motion } from "framer-motion";
import { WelcomePage } from "./WelcomePage";
import { useState } from 'react';
import { Navigate } from "react-router-dom";


/*const changePage = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay: '8.5',
        duration: "2.2",
        ease: "easeIn"
      }
    }
  };*/
  const changePage2 = {
    hidden: {
      opacity: 0,
      transition: {
        delay: '6.9',
        duration: "0.5",
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
    }
  };

  


export function Welcome() {

    

    const handleFirstDivComplete = () => {
        // Wywołaj animację drugiego motion.div

        setSecondDivVisible(true);
      };
    const [secondDivVisible, setSecondDivVisible] = useState(false);

    if( secondDivVisible) {
        return (
            <Navigate to='/site'/>
        );
      }
      


return(
<motion.div 
initial="visible" 
animate="hidden" 
variants={changePage2} 
onAnimationComplete={
    definition => { handleFirstDivComplete() }
}
style={{backdropFilter: "blur(5px)"}} 
className="position-absolute container-fluid vh-100 bg-background bg-opacity-50 d-flex align-items-center justify-content-center">
      <div className="row">
        <div xs={12} className="col h1 text-center text-white">
        <WelcomePage/>
        </div>
      </div>
</motion.div>
);
};