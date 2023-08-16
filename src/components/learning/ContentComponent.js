import { Offcanvas } from 'react-bootstrap';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getEntityWithChildrenConfig } from '../../network/lib/entity';
import styles from '../admin/BoardAdmin.module.css';
import { NodeMapper } from '../../lib/utility';
import { ErrorHandler } from '../common/ErrorHandler';
import { useState } from 'react';
import { BiUser } from 'react-icons/bi';
import { AiOutlineHome } from 'react-icons/ai';
import { TbMessageLanguage } from 'react-icons/tb';
import { LoadingComponent } from '../common/LoadingComponent';
import { useAppStore } from '../../lib/store';
import { Sidebar } from './Sidebar2';

const sidebar = {
	visible: {
		opacity: 1,
		transition: {
			duration: 0.23,
			delayChildren: 0.25,
			staggerChildren: 0.15,
			ease: 'easeOut',
		},
	},
	hidden: { opacity: 0 },
};

export function ContentComponent({ moderator = false }) {
	return (
		<motion.div className='h-100 d-flex flex-column container-lg p-0' style={{ height: 0 }} initial='hidden' animate='visible'>
			<Routes>
				<Route index element={<SidebarWithContent moderator={moderator} />} />
				<Route path=':nodeid' element={<SidebarWithContent moderator={moderator} />} />
			</Routes>
		</motion.div>
	);
}

function SidebarWithContent({ defaultRootNodeId = 3, moderator = false }) {
	var { nodeid } = useParams();
	const config = useAppStore(store => (moderator ? store.moderatorConfig : store.config));
	if (nodeid === undefined) nodeid = defaultRootNodeId;

	const [showNavigation, setShowNavigation] = useState(false);

	const {
		data: node,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['sidebar', `sidebar_${nodeid}_${JSON.stringify(config)}`],
		queryFn: () => getEntityWithChildrenConfig(nodeid, config, moderator),
	});

	if (isError) return <ErrorHandler error={error} />;
	if(config === null){
		return <ErrorHandler error='No language configuration detected' />
	}

	const translations = node?.entityTranslations;
	return (
		<>
			<button className='btn btn-white d-lg-none p-3 bg-white fw-bold rounded-0' onClick={() => setShowNavigation(true)}>
				{translations !== undefined ? translations[0].mainTitle : undefined}
			</button>
			<div className='row flex-fill m-0 p-0'>
				<motion.div
					className={`default_scroll_trans position-relative h-100 overflow-auto col-md-3 d-none d-lg-block bg-white py-3 shadow`}
					initial='hidden'
					animate='visible'
					variants={sidebar}>
					<div className='position-absolute'>
						<Offcanvas
							className='h-auto bg-transparent'
							placement='top'
							responsive='lg'
							show={showNavigation}
							onHide={() => setShowNavigation(false)}>
							<Offcanvas.Header closeButton className='p-2 pe-4 border-bottom border-dark bg-white'>
								<div className='flex-fill d-flex justify-content-around'>
									<Link to='/site' className='btn btn-primary text-white d-flex align-items-center mx-2'>
										<AiOutlineHome size={24} className='m-1 mx-1 mx-sm-2' />
									</Link>
									<Link to='/site/user' className='btn  btn-primary text-white d-flex align-items-center mx-2'>
										<BiUser size={24} className='mx-1 mx-sm-2' />
									</Link>
									<Link to='/site/user/options' className='btn btn-primary text-white d-flex align-items-center mx-2'>
										<TbMessageLanguage size={24} className='m-1 mx-1 mx-sm-2' />
									</Link>
								</div>
							</Offcanvas.Header>
							<Offcanvas.Body className='bg-light bg-opacity-75' style={{ backdropFilter: 'blur(5px)' }}>
								<Sidebar moderator={moderator} />
							</Offcanvas.Body>
						</Offcanvas>
					</div>
				</motion.div>
				<div className='col p-0'>
					<div
						className={` position-relative bg-background  bg-opacity-25 h-100  ${styles.admin_scroll}`}
						style={{ backdropFilter: 'blur(3px)', overflowX: 'hidden', overflowY: 'auto' }}>
						<div className='position-absolute w-100 h-100'>
							{isLoading ? (
								<div className='m-5 mh-100 align-items-center d-flex justify-content-center'>
									<LoadingComponent />
								</div>
							) : (
								<div className='py-2 px-2 px-lg-3 py-lg-3 w-100 h-100'>{NodeMapper.get(node.typeId).mapper(node, moderator)}</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
