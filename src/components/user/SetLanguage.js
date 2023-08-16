import { useEffect, useState } from 'react';
import Flag from 'react-flagkit';
import { useAppStore } from '../../lib/store';
import { getLanguages } from '../../network/lib/language';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { ErrorHandler } from '../common/ErrorHandler';
import { motion } from 'framer-motion';
import { LoadingComponent } from '../common/LoadingComponent';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const itemSlide = {
	hidden: { y: 10, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			duration: 0.3,
			ease: 'easeIn',
		},
	},
};
const itemSlide2 = {
	hidden: { y: 15, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			delay: 0.7,
			duration: 0.3,
			ease: 'easeIn',
		},
	},
};
const container = {
	visible: {
		opacity: 1,
		y: '0%',
		transition: {
			duration: 1.0,
			delayChildren: 0.2,
			staggerChildren: 0.15,
			ease: 'easeOut',
		},
	},
	hidden: { opacity: 0, y: '5%' },
};

const SetLanguage = () => {
	const config = useAppStore(store => store.config);
	const {updateLanguages,  updateConfig} = useAppStore();
	const navigate = useNavigate();
	const { data: languages, isLoading, isError, error } = useQuery(['languages'], () => getLanguages());
	const [selectedLanguages, setSelectedLanguages] = useState({ ...config });
	const queryClient = useQueryClient();
	const [showSuccess, setShowSuccess] = useState(false);

	useEffect(() => {
		getLanguages().then(languages => updateLanguages(languages)).catch(() => {
			navigate('/error');
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const saveChanges = useCallback(() => {
		updateConfig(selectedLanguages);
		queryClient.invalidateQueries();
		setShowSuccess(true);
	}, [selectedLanguages, updateConfig, queryClient]);

	if (isError) return <ErrorHandler error={error} />;
	return (
		<div className='h-100 overflow-auto'>
			<motion.div
				className='container d-flex flex-column justify-content-center h-100 p-0 bg-opacity-50 bg-background border-end border-start border-2 border-background'
				style={{ backdropFilter: 'blur(5px)' }}>
				<motion.div
					initial='hidden'
					animate='visible'
					variants={container}
					className='p-4 d-flex align-items-center justify-content-center align-self-center rounded-0 flex-wrap'>
					{isLoading ? (
						<div className='m-5 mh-100 align-items-center d-flex justify-content-center'>
							<LoadingComponent />
						</div>
					) : (
						<>
							<motion.div variants={itemSlide} className='col-lg-5 my-3 mx-sm-4'>
								<h2 className=' p-3 mx-3 text-center text-white rounded-2 d-flex align-items-center justify-content-center'>
									<Flag className='rounded-4 m-3 ' country={selectedLanguages.nativeCode} size={44} />
									<p className='m-1'>Select primary language:</p>
								</h2>
								<select
									defaultValue={selectedLanguages.native}
									className='form-select btn p-2 m-1 bg-background text-white text-center border-0 rounded-4'
									id='language-select'
									onChange={event => {
										setSelectedLanguages({
											...selectedLanguages,
											native: parseInt(event.target.value),
											nativeCode: languages.find(l => l.langId === parseInt(event.target.value)).langValue,
										});
									}}>
									{languages.map((item, index) => {
										return (
											<option key={index} value={item.langId}>
												{item.langValue}
											</option>
										);
									})}
								</select>
							</motion.div>

							<motion.div variants={itemSlide} className='col-lg-5 my-3 mx-sm-4'>
								<h2 className=' p-3 mx-3 text-center text-white rounded-2 d-flex align-items-center justify-content-center'>
									<Flag className='rounded-4 m-3' country={selectedLanguages.foreignCode} size={44} />
									<p className='m-1'>Select secondary language:</p>
								</h2>
								<select
									defaultValue={selectedLanguages.foreign}
									className='form-select btn bg-background text-white p-2 m-1 text-center border-0 rounded-4'
									id='language-select-2'
									onChange={event =>
										setSelectedLanguages({
											...selectedLanguages,
											foreign: parseInt(event.target.value),
											foreignCode: languages.find(l => l.langId === parseInt(event.target.value)).langValue,
										})
									}>
									{languages.map((item, index) => {
										return (
											<option key={index} value={item.langId}>
												{item.langValue}
											</option>
										);
									})}
								</select>
							</motion.div>
						</>
					)}
				</motion.div>
				{isLoading ? (
					<></>
				) : (
					<motion.div
						initial='hidden'
						animate='visible'
						variants={itemSlide2}
						className='btn btn-secondary text-white m-3 border-2 rounded-5 px-5 py-2 align-self-center'
						onClick={() => saveChanges()}>
						Confirm
					</motion.div>
				)}
			</motion.div>
			<div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 9999, width:'100%', display:'flex', justifyContent:'center' }}>
				<ToastContainer className='position-static p-2'>
					<Toast bg={'primary'} style={{width:'170px'}} show={showSuccess} onClose={() => setShowSuccess(false)} delay={2000} autohide>
						<Toast.Header>
							<strong className='me-auto'>Language config</strong>
						</Toast.Header>
						<Toast.Body class='p-0'>
							<div className='d-flex align-items-center justify-content-center'>
								<Flag className='rounded-4 m-1' country={config.nativeCode} size={44} />
								<span className='h1 text-white' style={{fill:'white'}}>→</span>
								<Flag className='rounded-4 m-1' country={config.foreignCode} size={44} />
							</div>
						</Toast.Body>
					</Toast>
				</ToastContainer>
			</div>
		</div>
	);
};
export default SetLanguage;
