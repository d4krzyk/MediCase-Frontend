import { Button, Modal } from 'react-bootstrap';
import { QuickTable } from '../common/QuickTable';
import { useCallback, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { QuickModal } from '../common/QuickModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLanguage, getLanguages } from '../../network/lib/language';
import Flag from 'react-flagkit';
import { motion } from 'framer-motion';
import { useAppStore } from '../../lib/store';

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

export function LanguagesTable() {
	const queryClient = useQueryClient();
	const languages = useAppStore(store => store.moderatorLanguages);
	const { updateModeratorLanguages } = useAppStore();
	const { mutate: mutateDeleteLanguage } = useMutation(deleteLanguage, {
		onError: () => {
			alert('Error on deleteLanguage');
		},
		onSettled: () => {
			queryClient.invalidateQueries('languages');
			getLanguages(true).then(languages => updateModeratorLanguages(languages));
		},
	});

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [languageToDelete, setLanguageToDelete] = useState(undefined);

	const handleDeleteLanguage = useCallback(() => {
		mutateDeleteLanguage(languageToDelete.langId);
		setShowDeleteModal(false);
	}, [languageToDelete, mutateDeleteLanguage]);

	return (
		<motion.div
			initial='hidden'
			animate='visible'
			variants={slideAnimationY}
			className='overflow-auto select_option_scroll m-2 rounded pe-2'
			style={{ maxHeight: '67vh' }}>
			<QuickTable
				className='table table-hover text-white bg-background rounded-3 '
				columnDefinitions={['Country code', 'Icon', 'Delete']}
				style={{ maxHeight: '67vh' }}
				items={languages}
				rowFactory={item => {
					return (
						<>
							<td className='text-center text-white bg-secondary'>
								<div className='d-flex text-center'>{item.langValue}</div>
							</td>
							<td className='text-white bg-secondary'>
								<Flag country={item.langValue} size={34} />
							</td>
							<td className='text-white bg-secondary'>
								<Button
									variant='danger'
									className='p-2 w-100'
									onClick={() => {
										setLanguageToDelete(item);
										setShowDeleteModal(true);
									}}>
									<RiDeleteBinLine size={16} />
								</Button>
							</td>
						</>
					);
				}}
			/>

			<QuickModal show={showDeleteModal} setShow={setShowDeleteModal}>
				<Modal.Header closeButton>Czy na pewno chcesz usunąć ten język?</Modal.Header>
				<Modal.Body className='bg-light text-dark'>
					<Flag className='me-2' country={languageToDelete?.langValue} size={44} />
					{languageToDelete?.langValue}
				</Modal.Body>
				<Modal.Footer>
					<Button variant='danger' className='ms-auto' onClick={e => handleDeleteLanguage()}>
						Zatwierdź
					</Button>
				</Modal.Footer>
			</QuickModal>
		</motion.div>
	);
}
