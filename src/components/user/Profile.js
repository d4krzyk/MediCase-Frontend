import styles from '../common/common.module.scss';
import { QuickModal } from '../common/QuickModal';
import { useState, useCallback, useMemo } from 'react';
import { Button, Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import { Input } from '../common/Input';
import { motion } from 'framer-motion';
import { BiUser } from 'react-icons/bi';
import { LabeledInput } from '../common/LabeledInput';
import { useAppStore } from '../../lib/store';
import { updateEmail, updateName, updatePassword } from '../../network/lib/user';
import { useMutation } from '@tanstack/react-query';
 

//const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const itemSlide = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
	},
};
const itemShadow = {
	hidden: { opacity: 0, borderColor: 'transparent', borderWidth: 2 },
	visible: {
		opacity: 1,
		borderColor: 'white',
		borderWidth: 2,
		transitionEnd: {
			borderColor: 'transparent',
			borderWidth: 2,
		},
	},
};
const containerShadow = {
	visible: {
		opacity: 1,
		transition: {
			delayChildren: 0.4,
			staggerChildren: 0.15,
			ease: 'easeOut',
		},
	},
	hidden: { opacity: 0 },
};
const container = {
	visible: {
		opacity: 1,
		y: '0%',
		transition: {
			duration: 2.0,
			delayChildren: 0.25,
			staggerChildren: 0.15,
			ease: 'easeOut',
		},
	},
	hidden: { opacity: 0, y: '5%' },
};
function validateName(value) {
	if (!/^[\s\p{L}]+$/u.test(value)) {
		return 'Name can consist of only letters';
	}
	return undefined;
}
/*function validateEmail(value) {
	if (!validator.isEmail(value)) {
		return 'Not a valid email';
	}
	return undefined;
}*/
function validatePassword(value) {
	if (!passwordRegex.test(value)) {
		return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
	}
	return undefined;
}

export default function Profile() {
	const [modifiedField, setModifiedField] = useState();
	const user = useAppStore(store => store.user);
	const { updateUser } = useAppStore();

	const performUpdate = useCallback(async () => {
		if (modifiedField.title === 'Name') {
			await updateName({ firstName: modifiedField.fields.at(0).value, lastName: modifiedField.fields.at(1).value });
		} else if (modifiedField.title === 'Email') {
			await updateEmail({ email: modifiedField.fields.at(0).value, password: modifiedField.fields.at(1).value });
		} else if (modifiedField.title === 'Password') {
			if (modifiedField.fields.at(1).value !== modifiedField.fields.at(2).value) {
				modifiedField.fields.at(2).error = 'Passwords do not match';
				return false;
			}
			await updatePassword({ oldPassword: modifiedField.fields.at(0).value, newPassword: modifiedField.fields.at(1).value });
		}
		updateUser();
		return true;
	}, [modifiedField, updateUser]);

	const {
		mutate: mutateProfile,
		isLoading,
		error,
	} = useMutation({
		mutationFn: performUpdate,
		onSuccess: () => {
			setModifiedField(undefined);
		},
	});

	const validationErrors = useMemo(() => error?.response?.data?.errors, [error]);
	const otherErrors = useMemo(() => error?.response?.data, [error]);

	const validatedModifiedField = useMemo(() => {
		if (modifiedField === undefined) return modifiedField;
		const fields = [...modifiedField.fields];
		fields.forEach((f, i, arr) => {
			f.error = undefined;
			f.error = f.validate?.(f.value) ?? undefined;
			if (f.error === undefined && validationErrors !== undefined && validationErrors.hasOwnProperty(`${f.name}`)) {
				f.error = validationErrors[`${f.name}`].at(0);
			}
			arr[i] = f;
		});
		return { ...modifiedField, fields };
	}, [validationErrors, modifiedField]);

	const submitChanges = useCallback(async () => {
		mutateProfile();
	}, [mutateProfile]);

	const handleEditName = () => {
		setModifiedField({
			title: 'Name',
			fields: [
				{ value: user.firstName, name: 'FirstName', label: 'First Name', validate: validateName },
				{ value: user.lastName, name: 'LastName', label: 'Last Name', validate: validateName },
			],
		});
	};
	/*const handleEditEmail = () => {
		setModifiedField({
			title: 'Email',
			fields: [
				{ value: user.email, name: 'Email', label: 'Email', validate: validateEmail },
				{ value: '', name: 'Password', label: 'Current password', type: 'password' },
			],
		});
	};*/
	const handleEditPassword = () => {
		setModifiedField({
			title: 'Password',
			fields: [
				{ value: '', label: 'Old password', type: 'password' },
				{ value: '', name: 'NewPassword', label: 'New password', type: 'password', validate: validatePassword },
				{ value: '', label: 'Confirm password', type: 'password' },
			],
		});
	};
    const { logoutUser } = useAppStore()
    const handleLogout = useCallback(() => {
        logoutUser()
    }, [logoutUser])

	if (user === undefined) return <>Error: no user</>;
	return (
		<Container
			style={{ backdropFilter: 'blur(5px)' }}
			className='container d-flex flex-column justify-content-center h-100 p-0 bg-opacity-50 bg-background border-end border-start border-2 border-background'>
			<Row className='justify-content-center h-100 mx-0'>
				<Col xs={12} md={8} lg={9} className='mb-4 h-100  px-0'>
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='text-white rounded-0 h-100'>
						<div className='d-flex flex-column h-100 justify-content-center p-4 p-lg-5 p-sm-3'>
							<motion.div initial='hidden' animate='visible' variants={container}>
								<motion.div
									initial={{ opacity: 0, y: '25%' }}
									animate={{ opacity: 1, y: '0%' }}
									transition={{
										duration: 0.9,
										delay: 1.0,
										ease: [0.22, 1, 0.36, 1],
									}}
									className='text-center '>
									<motion.div whileTap={{y: 5}}>	
									<BiUser
										style={{
											borderTopRightRadius: '40%',
											borderTopLeftRadius: '40%',
										}}
										className='bg-background pt-2  border-bottom border-2 border-primary'
										size={'7rem'}
									/>
									</motion.div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: '10%' }}
									animate={{ opacity: 1, y: '0%' }}
									transition={{ duration: 0.5 }}
									style={{cursor: 'default'}}
									className={`h1 ${styles.disableTextSelection} card-title bg-background border border-2 border-primary p-2 rounded-pill text-center mb-3`}>
									{user.firstName}  {user.lastName}
								</motion.div>

								<motion.div
									variants={itemSlide}
									transition={{ duration: 0.5 }}
									className='p-3 mx-1 mx-md-5 mb-4 border border-2 bg-background border-primary rounded-3'>
									<span>
										<h4 className={`card-title ${styles.disableTextSelection} border-primary p-2 text-center mb-3 text-break`}>{user.email}</h4>
									</span>

									<motion.div
										initial='hidden'
										animate='visible'
										variants={containerShadow}
										className='d-grid gap-2 d-md-flex justify-content-md-center'>
										<motion.div key={handleEditName}  variants={itemShadow} className='btn btn-primary text-white' onClick={handleEditName}>
											Edit Name
										</motion.div>
										{/*<motion.div className='btn btn-primary text-white' variants={itemShadow} onClick={handleEditEmail}>
											Edit e-mail
									</motion.div>*/}
										<motion.div key={handleEditPassword} className='btn btn-primary text-white' variants={itemShadow} onClick={handleEditPassword}>
											Edit Password
										</motion.div>
										<motion.div key={handleLogout} onClick={handleLogout} className='btn btn-primary text-white' variants={itemShadow}>
											Logout
										</motion.div>
									</motion.div>
								</motion.div>
							</motion.div>
						</div>
					</motion.div>
				</Col>
			</Row>

			{modifiedField !== undefined && (
				<QuickModal key={modifiedField} show={modifiedField !== undefined} setShow={() => setModifiedField(undefined)}>
					<Modal.Header closeButton>Modify {modifiedField?.title}</Modal.Header>
					<Modal.Body>
						{validatedModifiedField.fields.map((item, index) => {
							const field = modifiedField.fields[index];
							return (
								<div key={index}>
									<LabeledInput
										value={field.value}
										name={field.name}
										label={field.label}
										type={field.type}
										error={item.error}
										errorNewLine
										className='mb-3'
										setValue={value =>
											setModifiedField(old => {
												const oldFields = [...old.fields];
												oldFields[index].value = value;
												return { ...old, fields: oldFields };
											})
										}
									/>
								</div>
							);
						})}
						{modifiedField.value !== undefined && (
							<Input value={modifiedField.value} setValue={value => setModifiedField(old => ({ ...old, value: value }))} />
						)}
					</Modal.Body>

					<Modal.Footer>
						{typeof otherErrors === 'string' ? <div className='fw-bold text-danger p-2'>{otherErrors}</div> : <div></div>}

						<Button variant='dark' className='me-auto' onClick={() => setModifiedField(undefined)}>
							Cancel
						</Button>
						{isLoading ? <Spinner /> : <></>}
						<Button
							variant='success'
							onClick={() => submitChanges()}
							disabled={validatedModifiedField.fields.some(f => (f.validate?.(f.value) ?? undefined) !== undefined)}>
							Confirm
						</Button>
					</Modal.Footer>
				</QuickModal>
			)}
		</Container>
	);
}
