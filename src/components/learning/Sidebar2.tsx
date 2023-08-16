import { /*Dispatch, SetStateAction, */useEffect,/* useState*/} from 'react'
import { ServerNodeData, getEntityWithChildrenConfig } from '../../network/lib/entity'
import { Changer, LanguageConfig, specialValues, useAppStore } from '../../lib/store'
import { useQuery } from '@tanstack/react-query'
import { ErrorHandler } from '../common/ErrorHandler'
import { useNavigate } from 'react-router-dom'
import { motion,AnimatePresence } from 'framer-motion';
interface SidebarLayer {
    items: ServerNodeData[],
    chosenIndex: number | undefined
}

export interface SidebarType {
    layers: SidebarLayer[]
}

interface SidebarProps {
    moderator: boolean
    //root: ServerNodeData
}
const colorPalette = ['#0a100c', '#111d16', '#16271d', '#1a3224', '#1e3e2b'];



export function Sidebar({ moderator }: SidebarProps) {
    const config = useAppStore(store => moderator ? store.moderatorConfig : store.config)
    const { data: root, isLoading, isError, error } = useQuery(['sidebar_root'],{
        queryFn: () => {
            if(config !== null){
                return getEntityWithChildrenConfig(3, config, moderator)
            } else{
                return new Promise(resolve => resolve(0));
            }
        },
    })
    const { setSidebarState} = useAppStore()
    const sidebarState = useAppStore(store => store.sidebarState)

    if (isLoading) return <></>
    if (isError) return <ErrorHandler error={error} />
    if(config === null){
		return <ErrorHandler error='No language configuration detected' />
	}
    const current: ServerNodeData = root as ServerNodeData
    return (
        <Sid sidebar={sidebarState} setSidebar={setSidebarState} depth={0} moderator={moderator} current={current} config={config} />
    )
}

interface SidProps {
    sidebar: SidebarType,
    depth: number,
    setSidebar: Changer<SidebarType>,
    current: ServerNodeData,
    moderator: boolean,
    config: LanguageConfig
}

export function Sid({ sidebar, setSidebar, current, depth, moderator, config }: SidProps) {
    const navigate = useNavigate();
    
    const { data, isLoading, isError, error } = useQuery([`sidebar_${current.entityId}_${config?.native ?? ''}`], {
        queryFn: () => getEntityWithChildrenConfig(current.entityId, config, moderator)
    })

    useEffect(() => {
        if (data !== undefined) {
            setSidebar(old => {
                let layers = [...old.layers]
                if (depth < layers.length) {
                    layers[depth].items = data.childs
                } else if (layers.length === depth) {
                    layers.push({ items: data.childs, chosenIndex: undefined })
                }
                return {
                    layers
                }
            })
        }
    }, [data, depth, setSidebar])

    if (depth >= sidebar.layers.length) return <></>
    let layer = sidebar.layers[depth]

    if (isLoading) return <></>
    if (isError) return <ErrorHandler error={error} />
    if(config === null){
		return <ErrorHandler error='No language configuration detected' />
	}

    return (
        <AnimatePresence>
            <div className='d-flex flex-column'>
                {layer?.items.map((item, index) => {
                    const isOpened = index === layer.chosenIndex
                    const isNavigation = item.typeId === specialValues.navigationType;
                    const isIgnoreNavigation = item.typeId === specialValues.ignoreNavigationType;
                    if (isIgnoreNavigation) return <div key={index}></div>;
                    return (
                        <div key={index}>
                            <motion.div
                             exit={{y: 20, opacity: 0}}
                             initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut'}}}
                            style={{
                                zIndex: 1,
                                color: colorPalette[depth],
                                borderBottomRightRadius: 20,
                                borderTopRightRadius: 20,
                            }} 
                            className={`btn btn-white border-0 align-items-center mt-1 mx-1 text-start ${isOpened ? 'bg-secondary text-white' : ''}`}
                                onClick={() => {
                                    if (moderator) {
                                        navigate(`/site/user/admin/review/${item.entityId}`);
                                    } else {
                                        navigate(`/site/user/content/${item.entityId}`);
                                    }
                                    setSidebar(old => {
                                        let layers = [...old.layers]
                                        layers[depth] = { ...layers[depth], chosenIndex: index === layers[depth].chosenIndex ? undefined : index }
                                        layers = [...layers.slice(0, depth+1)]
                                        return {
                                            layers
                                        }
                                    })
                                }
                                }>
                                <span className={isNavigation ? 'fw-bold' : 'fw-normal'}>{item.entityTranslations.at(0)?.mainTitle}</span>
                            </motion.div>
                            {isOpened && isNavigation ?
                            
                                <motion.div 
                                 className='ms-2' 
                                 initial={'hidden'}
                                 viewport={{ once: true }}
                                 animate={isOpened ? 'visible' : 'hidden'}
                                 variants={{
                                     visible: {
                                         opacity: 1,
                                         x: '0%',
                                         y: '0%',
                                         borderWidth: 1,
                                         scaleX: 1,
                                         scaleY: 1,
                                         transition: {
                                             duration: 0.3,
                                             delayChildren: 0.07,
                                             staggerChildren: 0.12,
                                             ease: 'easeOut',
                                         },
                                     },
                                     hidden: {
                                         borderWidth: 0,
                                         scaleX: 1,
                                         scaleY: 0.7,
                                         opacity: 0.5,
                                         x: '0%',
                                         y: '-30%',
                                     },
                                 }}
                                 transition={{
                                     type: 'spring',
                                     bounce: 0.34,
                                     duration: 0.4,
                                 }}>
                                    <div style={{
                                        zIndex: 3,
										borderLeft: '2px solid #092c39',
										borderColor: colorPalette[(depth + 1) % 5],
									}}>
                                    <Sid sidebar={sidebar} setSidebar={setSidebar} depth={depth + 1} moderator={moderator} current={item} config={config} />
                                    </div>
                                </motion.div>
                            
                             : <></>}
                        </div>
                    )
                })}
            </div>
        </AnimatePresence>
    )
}