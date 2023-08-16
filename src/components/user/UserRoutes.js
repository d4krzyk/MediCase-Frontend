import { Route, Routes } from "react-router-dom";
import { ContentComponent } from "../learning/ContentComponent";
import Profile from "./Profile";
import SetLanguage from "./SetLanguage";
import { AdminRoutes } from "./AdminRoutes";
import { ModeratorLanguages } from "../moderator/ModeratorLanguages";
import { ModeratorEditor } from "../moderator/ModeratorEditor";
import { AnimatePresence } from 'framer-motion';

export function UserRoutes() {

    return (
        <AnimatePresence mode="wait">
        <Routes>
            <Route path='' element={<Profile />} />
            <Route path='options' element={<SetLanguage />} />
            <Route path="mod/*" element={
                <Routes>
                    <Route path='languages' element={<ModeratorLanguages />}/>
                    <Route index path='editor' element={<ModeratorEditor />} />
                </Routes>
            } />
            <Route path="admin/*" element={<AdminRoutes />} />
            <Route path="content/*" element={<ContentComponent/>} />
        </Routes>
        </AnimatePresence>
    )
}