import { useState, useEffect } from 'react';
import styles from './BoardAdmin.module.css';
import { FiInfo } from 'react-icons/fi';
import { Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { QuickModal } from '../common/QuickModal';
import { ErrorHandler } from '../common/ErrorHandler';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../../network/lib/user';
const itemSlide = {
	hidden: { y: '5%', opacity: 0 },
	visible: {
		y: '0%',
		opacity: 1,
	},
};

const container = {
	visible: {
		opacity: 1,
		y: '0%',
		transition: {
			duration: 1.5,
			delayChildren: 0.15,
			staggerChildren: 0.15,
			ease: 'easeOut',
		},
	},
	hidden: { opacity: 0, y: '5%' },
};

export function UserList({ users, activeIndex, setActiveIndex }) {
	const [showDetailsIndex, setShowDetailsIndex] = useState(-1);
	//const [activeIndex, setActiveIndex] = useState(-1)
	return (
		<motion.div initial='hidden' animate='visible' exit='hidden' variants={container}>
			{users.map((item, index) => {
				const isActive = index === activeIndex;
				return (
					<div key={index}>
						<motion.div
							variants={itemSlide}
							onClick={() => setActiveIndex(index)}
							className={`container-fluid mb-3 p-3 bg-light bg-gradient rounded m-0 border-2 border border-dark shadow-sm ${
								isActive ? styles.active : styles.inactive
							}`}
							key={index}
							style={{ overflowX: 'auto' }}>
							<div className='row align-items-center'>
								<div className='col-md-2 d-flex justify-content-center'>
									<div
										className='btn btn-background d-flex align-content-center justify-content-center'
										onClick={() => setShowDetailsIndex(index)}>
										<FiInfo className='me-1 d-flex align-items-center justify-content-center text-white' size={24} />
										Details
									</div>
								</div>
								<div className='col-md-5'>
									<div className='h-100 flex-fill d-flex p-1'>
										<div className='container m-1 g-1'>
											<div className='row align-items-center'>
												<div className='fw-bold col p-0 d-flex justify-content-md-end text-start'>NAME:</div>
												<div className='col h6 mb-0 d-flex justify-content-md-end'>{item.firstName + ' ' + item.lastName}</div>
											</div>
											<div className='row align-items-center'>
												<div className='fw-bold col p-0 d-flex justify-content-md-end text-start'>EMAIL:</div>
												<div className='col h6 mb-0 d-flex justify-content-md-end'>{item.email}</div>
											</div>
										</div>
									</div>
								</div>
								<div className='col-md-5'>
									<div className='h-100 flex-fill d-flex p-1'>
										<div className='container m-1 g-1'>
											<div className='row align-items-center'>
												<div className='fw-bold col p-0 d-flex justify-content-md-center text-start'>ROLES:</div>
												<div className='col p-0 h6 mb-0 d-flex justify-content-md-start text-start'>
													<div className='row ms-sm-0 ms-1'>
														<div className='col form-check form-check-inline'>
															<label className='form-check-label m-0' htmlFor='inlineCheckbox3'>
																User
															</label>
															<input
																className='form-check-input'
																type='checkbox'
																id='inlineCheckbox3'
																value='option2'
																checked={item.isUser}
																disabled
															/>
														</div>
														<div className='col form-check form-check-inline'>
															<label className='form-check-label m-0' htmlFor='inlineCheckbox1'>
																Mod
															</label>
															<input
																className='form-check-input'
																type='checkbox'
																id='inlineCheckbox1'
																value='option1'
																checked={item.isModerator}
																disabled
															/>
														</div>
														<div className='col form-check form-check-inline'>
															<label className='form-check-label m-0' htmlFor='inlineCheckbox3'>
																Admin
															</label>
															<input
																className='form-check-input'
																type='checkbox'
																id='inlineCheckbox3'
																value='option2'
																checked={item.isAdmin}
																disabled
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				);
			})}

			{users[showDetailsIndex] !== undefined && (
				<UserDetailsModal show={users[showDetailsIndex] !== undefined} setShow={setShowDetailsIndex} user={users[showDetailsIndex]} />
			)}
		</motion.div>
	);
}

function UserDetailsModal({ show, setShow, user }) {
	const { data: UserInfo, isLoading, isError, error, refetch: refetchUsers } = useQuery(['user'], () => getUser(user.id));

	useEffect(() => {
		refetchUsers();
	}, [refetchUsers]);

	return (
		<QuickModal className='modal-dialog-scrollable modal-dialog-centered' show={show} setShow={setShow}>
			<Modal.Header closeButton>
				<Modal.Title>User Details</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Group className='mb-1'>
					<Form.Label className='fw-bold  '>
						Name:
						<div className='fw-normal'>
							{user.firstName} {user.lastName}
						</div>
					</Form.Label>
				</Form.Group>

				<Form.Group className='mb-1'>
					<Form.Label className='fw-bold  '>
						Email:
						<div className='fw-normal'>{user.email}</div>
					</Form.Label>
				</Form.Group>

				<Form.Group className='mb-1'>
					<Form.Label className='fw-bold'>Roles:</Form.Label>
					<div className='p-1 rounded checkbox-form'>
						<div className={`form-check ${styles.form_check}`}>
							<input
								className={`form-check-input ${styles.form_check_input} `}
								type='checkbox'
								checked={user.isUser}
								readOnly
								value={user.isUser}
								id='flexCheckDefault-1'
							/>
							<label className=' m-0 form-check-label' htmlFor='flexCheckDefault-1'>
								User
							</label>
						</div>
					</div>
					<div className='p-1 rounded checkbox-form'>
						<div className={`form-check ${styles.form_check}`}>
							<input
								className={`form-check-input ${styles.form_check_input} `}
								type='checkbox'
								checked={user.isModerator}
								readOnly
								value={user.isModerator}
								id='flexCheckDefault-1'
							/>
							<label className=' m-0 form-check-label' htmlFor='flexCheckDefault-1'>
								Moderator
							</label>
						</div>
					</div>
					<div className='p-1 rounded checkbox-form'>
						<div className={`form-check ${styles.form_check}`}>
							<input
								className={`form-check-input ${styles.form_check_input}`}
								type='checkbox'
								checked={user.isAdmin}
								readOnly
								value={user.isAdmin}
								id='flexCheckDefault-1'
							/>
							<label className=' m-0 form-check-label' htmlFor='flexCheckDefault-1'>
								Admin
							</label>
						</div>
					</div>
				</Form.Group>

				<Form.Group className='mb-1'>
					<Form.Label className='fw-bold  '>
						Groups:
						<div className='fw-normal'>
							{isLoading ? (
								<Spinner className='m-4 text-primary' />
							) : isError ? (
								<ErrorHandler error={error} />
							) : (
								<div className='flex-row row mx-1' style={{ wordBreak: 'keep-all' }}>
									{UserInfo.groups.map((item, index) => {
										return (
											<Col key={index} className=' me-1 my-1 rounded p-1 text-white bg-primary align-items-center'>
												<Row className='mx-1 justify-content-center'>{item.name}</Row>
											</Col>
										);
									})}
								</div>
							)}
						</div>
					</Form.Label>
				</Form.Group>
			</Modal.Body>
		</QuickModal>
	);
}
