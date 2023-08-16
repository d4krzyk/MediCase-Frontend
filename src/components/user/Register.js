import { useCallback, useState, useMemo } from 'react';
import { LabeledInput } from '../common/LabeledInput';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import logo from '../../static/MediCaseNav.svg';
import { register } from '../../network/lib/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { motion } from 'framer-motion';

function MedicaseBrand({ className = '' }) {

    return (
        <Link to='/site' className='justify-content-center align-items-center d-flex'>
			<img src={logo} alt={'MediCase'} width='90vw' height='90vw' className='d-flex py-1 my-1 w-75 justify-content-center align-items-center' />
        </Link>
    )
}



export const Register = props => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ name: '', surname: '', password: '', email: '' });
	//const [error, setError] = useState(null)

	const {
		mutate: mutateRegister,
		isLoading,
		error,
	} = useMutation({
		mutationFn: register,
		onSuccess: () => {
			navigate('/site/login');
		},
	});
	const validationErrors = useMemo(() => error?.response?.data?.errors ?? '', [error])

	const handleRegister = useCallback(() => {
		mutateRegister(formData);
	}, [formData, mutateRegister]);


	return (
		<Container
			style={{ backdropFilter: 'blur(5px)' }}
			className='container d-flex flex-column justify-content-center h-100 p-0 bg-opacity-50 bg-background border-end border-start border-2 border-background'>
			<Row className='justify-content-center h-100 mx-0'>
				<Col xs={12} sm={12} md={10} lg={9} className='mb-4 h-100  px-0 '>
					<div className='text-white rounded-0 h-100'>
						<div className='d-flex flex-column p-0 p-lg-5 p-sm-2 h-100'>
							<motion.div initial={{y: -20 , opacity: 0 }} animate={{y: 0, opacity: 1, transition: { duration: 0.7} }} exit={{y: -20, opacity: 0 }}  
								className='bg-white shadow bg-gradient m-3 m-sm-4 py-2 py-sm-4 rounded-3 justify-content-evenly d-flex flex-column flex-fill'>
								<div className='justify-content-center d-flex'>
									<MedicaseBrand/>
								</div>
								<Form className='justify-content-center align-items-center d-flex'>
									<Form.Group className='w-75 justify-content-center align-items-center'>
									<LabeledInput
											className='fs-4 rounded-pill px-3'
											placeholder='First name'
											error={validationErrors?.FirstName ?? ''}
											value={formData.username}
											setValue={value => setFormData({ ...formData, firstName: value })}
										/>
										<LabeledInput
											className='fs-4 rounded-pill px-3'
											placeholder='Last name'
											error={validationErrors?.LastName ?? ''}
											value={formData.username}
											setValue={value => setFormData({ ...formData, lastName: value })}
										/>
										<LabeledInput
											className='fs-4 rounded-pill px-3'
											placeholder='Email'
											error={validationErrors?.Email ?? ''}
											value={formData.email}
											setValue={value => setFormData({ ...formData, email: value })}
										/>
										<LabeledInput
											className='fs-4 rounded-pill px-3'
											placeholder='Password'
											type='password'
											error={validationErrors?.Password ?? ''}
											value={formData.password}
											setValue={value => setFormData({ ...formData, password: value })}
										/>

									</Form.Group>
								</Form>

								{isLoading ? (
									<LoadingSpinner className={'spinner-grow align-self-center'} />
								) : (
									<Button variant='primary' className='fs-4 mx-5 mt-1 rounded-pill text-white' onClick={handleRegister}>
										Register
									</Button>
								)}
								<Link to="/site" className='btn btn-dark fs-4 mx-5 rounded-pill text-white'>
										Back
								</Link>
						</motion.div>
						</div>
					</div>
				</Col>
			</Row>
		</Container>
	);
};