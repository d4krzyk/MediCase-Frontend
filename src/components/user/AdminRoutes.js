import { Route, Routes } from "react-router-dom";
import BoardAdmin from "../admin/BoardAdmin";
import { ModeratorReview } from "./ModeratorReview";
import { AnimatePresence } from 'framer-motion';

export function AdminRoutes(){
    return (
        <AnimatePresence mode="wait">
        <Routes>
            <Route path='/' element={<BoardAdmin/>}/>
            <Route path='/review/*' element={<ModeratorReview/>}/>
        </Routes>
        </AnimatePresence>
    )
}