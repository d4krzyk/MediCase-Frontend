import { Link } from "react-router-dom"
import { motion } from "framer-motion";
import { RemoteImage } from "./RemoteImage";
import style from './ContentNavigation.module.scss'
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "../../lib/store";
import { /*getEntityWithChildren*/ getEntityWithChildrenConfig } from "../../network/lib/entity";
import { NodeMapper, getFirstFileWithType } from "../../lib/utility";
//import { LoadingSpinner } from "../LoadingSpinner";
import { LoadingComponent } from "../common/LoadingComponent";
import { ErrorHandler } from "../common/ErrorHandler";



const container = {
  visible: {
    opacity: 1, y: "0%",
    transition: {
      duration: 0.65,
      delayChildren: 0.3,
      staggerChildren: 0.15,
      ease: "easeOut",
    }
  },
  hidden: { opacity: 0, y: "-5%" },
};
const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export function ContentNavigation({ node, moderator=false }) {
  const config = useAppStore(store => moderator ? store.moderatorConfig : store.config)
  const contentContainerId = node.childs?.find(node => node.typeId === 6)?.entityId
  const { data: contentContainerNode, isLoading, isError } = useQuery({
    queryKey: ['sidebar', `sidebar_${contentContainerId}_${JSON.stringify(config)}`],
    queryFn: () => {
      if (contentContainerId === undefined) return () => undefined
      return getEntityWithChildrenConfig(contentContainerId, config, moderator)
    },
  })
  
  if(config === null){
		return <ErrorHandler error='No language configuration detected' />
	}

  return (
		<motion.div initial='hidden' animate='visible' viewport={{ once: false }} variants={container}>
			{isLoading ? (
				<div className='m-5 mh-100 align-items-center d-flex justify-content-center'>
					<LoadingComponent />
				</div>
			) : (
				contentContainerNode !== undefined && !isError && NodeMapper.get(contentContainerNode.typeId)?.mapper(contentContainerNode, moderator)
			)}
			<motion.div variants={container} className={`h-100 ${style.navgrid}`}>
				{node.childs?.map((child, index) => {
					const isContentContainer = child.typeId === 6;
					if (isContentContainer) return undefined;
					return <ContentNavigationItem key={index} node={child} imageContainerStyle={{ height: 0 }} moderator={moderator} />;
				})}
			</motion.div>
		</motion.div>
  );
}

export function ContentNavigationItem({node, moderator = false}) {
  const isPreview = node.isPreview
  const imagePath = getFirstFileWithType(node.entityTranslations.at(0), 'image')
  return (
    <Link variants={container}  to={`${moderator? '/site/user/admin/review/': '/site/user/content/'}${node.entityId}`} className={`p-2 nav-link ${isPreview ? 'd-flex justify-content-center' : ''}`}>
      <motion.div variants={item} className={`d-flex flex-column align-items-center justify-content-center h-100 p-3 pb-2 btn btn-background fs-5`} style={{width: isPreview ? '40%' : ''}}>
        <div className={`${imagePath !== undefined ? 'flex-fill align-self-stretch mb-2' : 'd-none'}`} style={{height: isPreview? '' : 0}}>
          <RemoteImage filePath={imagePath} className='bg-white h-100' moderator={moderator} />
        </div>
        <div className={`text-truncate w-100`}>{node.entityTranslations[0]?.mainTitle}</div>
      </motion.div>
    </Link>
    
  )
}

