import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { introspect, logout } from '../network/lib/auth'
import { LanguageData } from '../network/lib/language'
import { NodeType } from '../network/lib/entity'
import { UserData } from '../network/lib/user'
import { SidebarType } from '../components/learning/Sidebar2'
//import { Dispatch, SetStateAction } from 'react'
 
export const specialValues = {
    navigationType: 3,
    ignoreNavigationType: 6
}

export interface LanguageConfig {
    native: number,
    nativeCode: string,
    foreign: number,
    foreignCode: string,
}

export interface Factory<T> {
    (t: T): T;
}

export interface Changer<T> {
    (change: Factory<T>): void
}

interface AppStore {
    token?: string,
    setToken: (token: string) => void,
    sidebarState: SidebarType,
    setSidebarState: (change: Factory<SidebarType>) => void,
    user: UserData | null,
    config: LanguageConfig | null,
    moderatorConfig: LanguageConfig | null,
    languages: LanguageData[],
    moderatorLanguages: LanguageData[],
    nodeTypes: NodeType[],
    updateUser: (user: UserData) => void,
    logoutUser: () => void,
    updateConfig: (config: LanguageConfig) => void,
    updateModeratorConfig: (config: LanguageConfig) => void,
    updateLanguages: (languages: LanguageData[]) => void,
    updateModeratorLanguages: (moderatorLanguages: LanguageData[]) => void,
    updateNodeTypes: (nodeTypes: NodeType[]) => void
}

export const useAppStore = create<AppStore>()(
    devtools(persist((set, get) => ({
        setToken: (token) => set(store => ({ ...store, token })),
        sidebarState: { layers: [] },
        setSidebarState: (change) => {
            set(store => ({ ...store, sidebarState: change(get().sidebarState) }))
        },
        user: null,
        config: null,
        moderatorConfig: null,
        languages: [],
        moderatorLanguages: [],
        nodeTypes: [],
        updateUser: async () => {
            const user = await introspect()
            set(store => ({ ...store, user }))
        },
        logoutUser: async () => {
            try {
                await logout()
            } finally {
                set(store => ({ ...store, user: null }))
            }
        },
        updateConfig: (config) => set(
            store => ({ ...store, config: config, })
        ),
        updateModeratorConfig: (config) => set(
            store => ({ ...store, moderatorConfig: config, })
        ),
        updateLanguages: (languages) => {
            set(store => ({ ...store, languages }))
        },
        updateModeratorLanguages: (moderatorLanguages) => {
            set(store => ({ ...store, moderatorLanguages }))
        },
        updateNodeTypes: (nodeTypes) => set(store => ({ ...store, nodeTypes }))
    }), () => ({
        name: 'app-storage',
        getStorage: () => localStorage,
    })))
) 