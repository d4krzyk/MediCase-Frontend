import { useState, useCallback } from 'react';
import { LabeledInput } from '../common/LabeledInput';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { login } from '../../network/lib/auth';
import logo from '../../static/MediCaseNav.svg';
import { useAppStore } from '../../lib/store';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { motion } from 'framer-motion';

function MedicaseBrand({ className = '' }) {

    return (
        <Link to='/site' className='justify-content-center align-items-center d-flex'>
			<img src={logo} alt={'MediCase'} width='90vw' height='90vw' className='d-flex py-1 my-3 w-75 justify-content-center align-items-center' />
        </Link>
    )
}


export function Login() {

	const { setToken, updateUser } = useAppStore();
	const [credentials, setCredentials] = useState({ email: '', password: '' });
	const navigate = useNavigate();

	const {
		mutate: mutateLogin,
		isLoading,
		isError
	} = useMutation({
		mutationFn: login,
		onSuccess: token => {
			setToken(token);
      updateUser().then(() => {
        navigate('/site');
      })
		},
	});

	const tryLogin = useCallback(async () => {
		mutateLogin(credentials);
	}, [credentials, mutateLogin]);

	return (
		<Container
			style={{ backdropFilter: 'blur(5px)' }}
			className='container d-flex flex-column justify-content-center h-100 p-0 bg-opacity-50 bg-background border-end border-start border-2 border-background'>
			<Row className='justify-content-center h-100 mx-0'>
				<Col xs={12} sm={12} md={10} lg={9} className='mb-4 h-100  px-0 '>
					<div className='text-white rounded-0 h-100'>
						<div className='d-flex flex-column p-0 p-lg-5 p-sm-2 h-100'>
							<motion.div
								initial={{ y: -20, opacity: 0 }}
								animate={{ y: 0, opacity: 1, transition: { duration: 0.7 } }}
								exit={{ y: -20, opacity: 0 }}
								className='bg-white shadow bg-gradient m-3 m-sm-4 py-2 py-sm-4 rounded-3 justify-content-evenly d-flex flex-column flex-fill'>
								<div className='justify-content-center d-flex'>
									<MedicaseBrand />
								</div>
								<Form className='justify-content-center align-items-center d-flex'>
									<Form.Group className='w-75 justify-content-center align-items-center'>
										<LabeledInput
											className='fs-4 rounded-pill px-3'
											placeholder='Email'
											value={credentials.username}
											setValue={value => setCredentials({ ...credentials, email: value })}
										/>
										<LabeledInput
											className='fs-4 rounded-pill px-3'
											placeholder='Password'
											type='password'
											value={credentials.password}
											setValue={value => setCredentials({ ...credentials, password: value })}
										/>
									</Form.Group>
									
								</Form>
								{isLoading ? (
										<LoadingSpinner className={'align-self-center'} />
									) : (
										<Button variant='primary' className='fs-4 mx-5 mt-4 rounded-pill text-white' onClick={() => tryLogin()}>
											Login
										</Button>
									)}
									{isError ? (
										<span className='text-danger d-flex fw-bold m-2 rounded-2 justify-content-center align-content-center'>
											User with given credentials was not found
										</span>
									) : (
										<></>
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
}
