import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

const logout = {
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.53,
            ease: "easeOut",
        }
    },
    hidden: { opacity: 0,y: -20 },
}
export function LoggedOutInfo(){

    return (
        <div  style={{backdropFilter:'blur(5px)'}} className="border border-left border-right border-background border-2 container bg-background bg-opacity-50 h-100 text-white ">
            <motion.div className="d-flex flex-column justify-content-center align-items-center h-100" initial="hidden" animate="visible" variants={logout}>
            <span className="h1 py-5">
            You have been logged out
            </span>
            <Link to='/site/login' className="w-50 btn fw-semibold btn-outline-light border border-2">Log in again</Link>
            </motion.div>
        </div>
    )
}
