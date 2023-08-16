import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import FadeMotionFramer from '../animation/FadeMotionFramer';
import { motion } from 'framer-motion';
import { AiOutlineDoubleRight } from 'react-icons/ai';
import { useState } from 'react';
import sass_variables from '../../preferences.scss';
import { useAppStore } from '../../lib/store';
import style from '../common/common.module.scss';

const changePage = {
	hidden: {
		opacity: 0,
		x: '50%',
	},
	visible: {
		opacity: 1,
		x: '0%',
		transition: {
			duration: '0.7',
			ease: 'easeInOut',
		},
	},
};

function HomeSignInUp() {
	const user = useAppStore(store => store.user);
	const navigate = useNavigate();
	const [isHoverSignIn, setHoverIn] = useState(false);
	const [isHoverSignUp, setHoverUp] = useState(false);

	if (user === null)
		return (
			<div className={`d-flex align-self-center align-items-center justify-content-center`}>
				<motion.div
					initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
					animate={{ backgroundColor: isHoverSignUp ? sass_variables.primary : 'rgba(0,0,0,0)' }}
					className='rounded-3 ms-1 ms-lg-5 ms-md-5 ms-sm-5   d-flex align-items-center '>
					<motion.div
						onMouseEnter={() => setHoverUp(true)}
						onMouseLeave={() => setHoverUp(false)}
						initial={{ color: 'black' }}
						id='sign_up'
						onClick={()=>{navigate('/site/register')}}
						className='btn border-0 btn-primary p-1 px-2 px-sm-3 px-md-5 p-sm-2 m-1'>
						<Link to={'/site/register'} className='nav-link text-white'>
							Sign up!
						</Link>
					</motion.div>
					<motion.div
						initial={{ x: '-20%', opacity: 0 }}
						animate={{ x: isHoverSignUp ? '0%' : '-20%', opacity: isHoverSignUp ? 1 : 0 }}>
						<AiOutlineDoubleRight size={30} className='ms-2 me-2  text-light' />
					</motion.div>
				</motion.div>
				<motion.div
					initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
					animate={{ backgroundColor: isHoverSignIn ? sass_variables.secondary : 'rgba(0,0,0,0)' }}
					className='rounded-3 ms-3  d-flex align-items-center '>
					<motion.div
						onMouseEnter={() => setHoverIn(true)}
						onMouseLeave={() => setHoverIn(false)}
						initial={{ color: 'black' }}
						onClick={()=>{navigate('login')}}
						id='sign_up'
						className='btn border-0 btn-secondary px-2 px-sm-3 px-md-5 p-1 p-sm-2 m-1'>
						<Link to={'login'} className={`nav-link text-white`}>
							Sign In
						</Link>
					</motion.div>
					<motion.div
						initial={{ x: '-20%', opacity: 0 }}
						animate={{ x: isHoverSignIn ? '0%' : '-20%', opacity: isHoverSignIn ? 1 : 0 }}>
						<AiOutlineDoubleRight size={30} className='ms-2 me-2  text-light' />
					</motion.div>
				</motion.div>
			</div>
		);
}

const YoutubeEmbed = () => {

	const styleContainer = {
		position: 'relative',
		overflow: 'hidden',
		width: '100%',
		paddingTop: '56.25%',
	}
	const styleIFrame = {
		position: ' absolute',
		top: '0',
		left: '0',
		bottom: '0',
		right: '0',
		width: '99%',
		height: '100%',
	}

	return (
      <motion.div className='row m-0 d-flex py-3 ms-0 ms-sm-4'>
        <div className="col m-0 ">
          <div style={styleContainer}>
			<iframe className="  rounded-3 border-3 border border-secondary"
			style={styleIFrame}
			width="600" height="350" 
			src="https://www.youtube.com/embed/PX62Rg46CaQ" 
			title="Discover MediCase: The Future of Healthcare is Here" 
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
			>
			</iframe>
          </div>
        </div>
      </motion.div>
	);
  };

export function Home() {

	const [isShowMoreInfo, setIsShowMoreInfo] = useState(false);

	return (
		<>
			<motion.div initial='hidden' animate='visible' variants={changePage} className='h-100' style={{ display: 'grid' }}>
				<div
					style={{
						gridRow: '1 / 2',
						gridColumn: '1 / 2',
						position: 'relative',
					}}>
					<div
						className={`h-100 bg-background bg-opacity-75 d-none d-lg-block ${style.container2}`}
						style={{
							left: -100,
							transform: 'skew(-8deg)',
							paddingLeft: '80vw',
							backdropFilter: 'blur(5px)',
							position: 'absolute',
						}}
					/>
				</div>
				<div
					style={{
						gridRow: '1 / 2',
						gridColumn: '1 / 2',
						position: 'relative',
					}}>
					<div
						className={`h-100 bg-background bg-opacity-75 w-100 d-lg-none ${style.container3}`}
						style={{ backdropFilter: 'blur(5px)', position: 'absolute' }}
					/>
				</div>
				<div
					style={{ gridRow: '1 / 2', gridColumn: '1 / 2' }}
					className={`d-flex flex-column justify-content-center h-100 overflow-auto position-relative p-2 p-sm-4 ${style.container}`}>
					<div className='h1 text-white ms-2 ms-sm-5 d-flex align-items-lg-center'>MediCase</div>


					<motion.div className={`${isShowMoreInfo ? '' : 'd-none'}`}
					initial={{opacity: 0, y: 10}} animate={{opacity: isShowMoreInfo ? 1 : 0, y: isShowMoreInfo ? 0 : 10}}>
					
					<p className='mb-3 fs-6  ms-sm-5 ms-2 me-sm-1 me-2 text-white'>
						Umiejętność właściwego porozumiewania się z pacjentem jest nie tylko wyzwaniem dla lekarza, lecz także kompetencją, którą
						powinien on doskonalić w ciągu całego życia zawodowego.
						<br />I tu z pomocą, jako narzędziem dydaktycznym – przychodzi współczesna technologia pozwalając wznieść edukację medyków na
						poziom wyraźnie poprawiający efektywność kształtowania własnych kompetencji komunikacyjnych.
						<br />
						Implementacja nowych urządzeń i aplikacji do procesu kształcenia to sposób na budowanie właściwych postaw zawodowych i
						dynamiczny rozwój własny.
					</p>
					<div className='mb-3 mb-md-3 mb-lg-3 fs-5 ms-sm-5 ms-2 me-sm-1 me-2 text-white'>
						Wartością proponowanej aplikacji jest ogromne zaangażowanie ich twórców - doświadczonego zespołu interdyscyplinarnego,
						otwartego na wprowadzenia innowacji do procesu kształcenia komunikacji medycznej.
						<div className='justify-content-start d-flex mt-2'>
							<div
								onClick={() => {
									setIsShowMoreInfo(false);
								}}
								className='align-self-center btn btn-primary text-white'>
								Back to Video
							</div>
					</div>
					</div>
					
					</motion.div>


					<motion.div className={`${isShowMoreInfo ? 'd-none' : ''}`}
					initial={{opacity: 0, y: 10}} animate={{opacity: isShowMoreInfo ? 0 : 1, y: isShowMoreInfo ? 10 : 0}}>
					<div className='d-flex fs-5 mb-3 mb-md-3 mb-lg-3 ms-sm-5 ms-2 me-sm-1 me-2 text-white'>
						Aplikacja, która jest środkiem dydaktycznym w nauce komunikacji medycznej.
						<br />
						Dedykowana dla szerokiej grupy zawodów medycznych, jak również studentów.
						<div className='justify-content-center align-items-center d-flex ps-lg-2 ps-0'>
							<div
								onClick={() => {
									setIsShowMoreInfo(true);
								}}
								className='align-self-center btn btn-primary text-white'>
								Show more
							</div>
						</div>
					</div>
					<YoutubeEmbed />
					</motion.div>
					<HomeSignInUp />
				</div>
			</motion.div>
		</>
	);
}

export function Home2() {
	//const user = useAppStore(store => store.user)
	// Co ma się wyświetlać gdy użytkownik jest zalogowany, a co gdy nie jest?

	return (
		<FadeMotionFramer>
			<motion.div
				initial='hidden'
				animate='visible'
				variants={changePage}
				className='position-fixed w-100 h-100 d-flex align-items-center'
				style={{ left: 0 }}>
				<Container className='position-relative  h-100 p-0 m-0 '>
					<Row>
						<Col
							className='bg-background border-end border-start border-4 border-background bg-opacity-75 d-lg-flex d-none col-12 flex-column justify-content-center align-items-start position-absolute h-100'
							style={{ left: -100, transform: 'skew(-8deg)', paddingLeft: '80vw', backdropFilter: 'blur(5px)' }}
						/>
						<Col
							className='bg-background bg-opacity-75 d-lg-none d-flex col-12 flex-column justify-content-center align-items-start position-absolute h-100'
							style={{ left: 0, backdropFilter: 'blur(5px)' }}
						/>
						<Col
							className='overflow-auto py-3 default_scroll_trans d-flex flex-column justify-content-center col-12 col-md-10 col-sm-11 align-items-start position-absolute h-100'
							style={{ left: 0 }}>
							<div className='h1 text-white ms-2 ms-sm-5 d-flex align-items-lg-center'>MediCase</div>

							<p className='mb-3 fs-6  ms-sm-5 ms-2 me-sm-1 me-2 text-white'>
								Umiejętność właściwego porozumiewania się z pacjentem jest nie tylko wyzwaniem dla lekarza, lecz
								także kompetencją, którą powinien on doskonalić w ciągu całego życia zawodowego.
								<br />I tu z pomocą – narzędziem dydaktycznym, przychodzi współczesna technologia, pozwalając
								wznieść edukację medyków na poziom wyraźnie poprawiający efektywność kształtowania własnych
								kompetencji komunikacyjnych.
								<br />
								Implementacja nowych urządzeń i aplikacji do procesu kształcenia to sposób na budowanie właściwych
								postaw zawodowych i dynamiczny rozwój własny.{' '}
							</p>
							<p className='mb-3 mb-md-3 mb-lg-3 fs-5 ms-sm-5 ms-2 me-sm-1 me-2 text-white'>
								Wartością proponowanej aplikacji jest ogromne zaangażowanie ich twórców - doświadczonego zespołu
								interdyscyplinarnego, otwartego na wprowadzenia innowacji do procesu kształcenia komunikacji
								medycznej.
							</p>

							<HomeSignInUp />
						</Col>
					</Row>
				</Container>
			</motion.div>
		</FadeMotionFramer>
	);
}