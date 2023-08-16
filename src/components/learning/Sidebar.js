/*
import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../state/store';
import styles from '../common.module.scss';
import { useQuery } from '@tanstack/react-query';
import { getEntityWithChildrenConfig } from '../../network/lib/entity';

const colorPalette = ['#0a100c', '#111d16', '#16271d', '#1a3224', '#1e3e2b'];

const item_sidebar = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
	},
	transition: {
		duration: 0.3,
		ease: 'easeOut',
	},
};

export function Sidebar({ nodeId = 3, colorIndex = 0, moderator = false }) {
	const config = useAppStore(store => (moderator ? store.moderatorConfig : store.config));

	const {
		data: node,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['sidebar', `sidebar_${nodeId}_${JSON.stringify(config)}`],
		queryFn: () => getEntityWithChildrenConfig(nodeId, config, moderator),
	});

	const [showIndex, setShowIndex] = useState(-1);
	const [childrenComponent, setChildrenComponent] = useState(<></>);
	const navigate = useNavigate();

	const openedId = parseInt(useLocation().pathname.split('/').at(-1));

	const itemChosen = useCallback(
		(child, index) => {
			if (child.typeId === 3) {
				if (index === showIndex) {
					setShowIndex(-1);
					setChildrenComponent(<></>);
				} else {
					setShowIndex(index);
					setChildrenComponent(<Sidebar nodeId={child.entityId} colorIndex={(colorIndex + 1) % 5} moderator={moderator} />);
				}
			}
			if (moderator) {
				navigate(`/site/user/admin/review/${child.entityId}`);
			} else {
				navigate(`/site/user/content/${child.entityId}`);
			}
		},
		[colorIndex, navigate, showIndex, moderator]
	);

	if (isLoading) return <></>;
	if (isError) return <div className='m-2 rounded-4 p-3 bg-white text-dark'>Error: {error.message}</div>;

	return (
		<>
			<div className='d-flex flex-column'>
				{node.childs.map((child, index) => {
					const isNavigation = child.typeId === 3;
					const isContentContainer = child.typeId === 6;
					const isOpened = openedId === child.entityId;

					if (isContentContainer) return <div key={index}></div>;

					return (
						<div key={index} className='mb-1'>
							<motion.div
								variants={item_sidebar}
								className={`btn btn-white border-0 align-items-center mt-1 mx-1 text-start ${
									isOpened ? 'bg-secondary text-white' : styles.btn
								}`}
								onClick={() => itemChosen(child, index)}
								style={{
									color: colorPalette[colorIndex],
									borderBottomRightRadius: 20,
									borderTopRightRadius: 20,
								}}>
								<span className={isNavigation ? 'fw-bold' : 'fw-normal'}>{child.entityTranslations[0]?.mainTitle}</span>
							</motion.div>
							<motion.div
								className='ms-2'
								initial={'hidden'}
								viewport={{ once: true }}
								animate={showIndex === index ? 'visible' : 'hidden'}
								variants={{
									visible: {
										opacity: 1,
										x: '0%',
										y: '0%',
										borderopacity: 1,
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
										borderopacity: 0,
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
								<div
									style={{
										borderLeft: '2px solid #091139',
										borderColor: colorPalette[(colorIndex + 1) % 5],
									}}>
									{index === showIndex && childrenComponent}
								</div>
							</motion.div>
						</div>
					);
				})}
			</div>
		</>
	);
}
*/