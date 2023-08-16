import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import Flag from 'react-flagkit';
import Select from 'react-select';
import { getLanguages, postLanguage } from '../../network/lib/language';
import { QuickModal } from '../common/QuickModal';
import { LanguagesTable } from './LanguagesTable';
import { motion } from 'framer-motion';
import { useAppStore } from '../../lib/store';
import { countryCodes } from './countryCodes';

const slideAnimationY = {
	hidden: {
		opacity: 0,
		y: '-5%',
	},
	visible: {
		opacity: 1,
		y: '0%',
		transition: {
			duration: '0.9',
			ease: 'easeOut',
		},
	},
};

export function ModeratorLanguages() {
	const { updateModeratorLanguages } = useAppStore();
	const queryClient = useQueryClient();

	const { mutate: mutatePostLanguage } = useMutation(postLanguage, {
		onSuccess: data => {
			getLanguages(true).then(languages => updateModeratorLanguages(languages));
		},
		onError: () => {
			alert('error on postLanguage');
		},
		onSettled: response => {
			queryClient.invalidateQueries(['languages']);
		},
	});

	const [newLanguage, setNewLanguage] = useState({});
	const [showNew, setShowNew] = useState(false);

	const handleAddNewLanguage = useCallback(() => {
		mutatePostLanguage(newLanguage.langValue);
		setShowNew(false);
	}, [mutatePostLanguage, newLanguage]);

	const SelectStyles = {
		menuList: base => ({
			...base,

			'::-webkit-scrollbar': {
				width: '20px',
				height: '0px',
			},
			'::-webkit-scrollbar-track': {
				boxShadow: 'inset 0 0 7px hsl(188, 46%, 22%)',
				background: 'hsl(194, 31%, 15%)',
				borderRadius: '4px',
			},
			'::-webkit-scrollbar-thumb': {
				backgroundColor: 'hsl(185, 69%, 60%)',
				boxShadow: 'inset 0 0 3px hsl(182, 86%, 24%)',
				border: '1px solid hsl(182, 86%, 24%)',
				borderRadius: '4px',
				backgroundClip: 'border-box',
			},
			'::-webkit-scrollbar-thumb:hover': {
				backgroundColor: 'hsl(185, 65%, 45%)',
			},
		}),
	};

	return (
		<>
			<div className='flex-fill position-relative container p-2 mt-4' style={{ height: 0 }}>
				<div className='h-100'>
					<div className='default_scroll h-100'>
						<motion.div
							initial='hidden'
							animate='visible'
							variants={slideAnimationY}
							className='d-flex pb-4 p-3 text-white'>
							<h1>Languages</h1>
							<Button
								variant='primary'
								className='ms-auto btn text-white'
								onClick={() => {
									setNewLanguage({ langValue: countryCodes[0] });
									setShowNew(true);
								}}>
								Add Language
							</Button>
						</motion.div>
						<LanguagesTable />
					</div>
				</div>
			</div>
			<QuickModal show={showNew} setShow={setShowNew}>
				<Modal.Header closeButton>Add New Languages</Modal.Header>
				<Modal.Body>
					<Form className='admin_scroll '>
						<Select
							styles={SelectStyles}
							placeholder='Select Language'
							classNames={{
								placeholder: state => 'text-white ',
								singleValue: state => 'text-white',
								control: state => `border-0 p-0 m-0 bg-primary bg-gradient text-white`,
								option: styles => 'bg-primary bg-gradient text-white',
								menu: state => `m-0 p-0 rounded-bottom`,
								menuList: state => `m-0 p-0 rounded-bottom bg-primary  text-white  scroll`,
							}}
							onChange={item => setNewLanguage({ langValue: item.value })}
							options={countryCodes}
							getOptionLabel={({ countryCode }) => {
								return (
									<div className='flex items-center'>
										<Flag className='me-2' country={countryCode} size={20} />
										<span>{countryCode}</span>
									</div>
								);
							}}
						/>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button className='text-white' variant='primary' onClick={e => handleAddNewLanguage()}>
						Confirm
					</Button>
				</Modal.Footer>
			</QuickModal>
		</>
	);
}
