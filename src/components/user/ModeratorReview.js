import { useState } from 'react';
import { ContentComponent } from '../learning/ContentComponent';
import { QuickModal } from '../common/QuickModal';
import { Button, Modal } from 'react-bootstrap';
import { synchronizeDatabases } from '../../network/lib/user';
import { useNavigate } from 'react-router-dom';
import { LabeledSelect } from '../common/LabeledSelect';
import { useAppStore } from '../../lib/store';
import { ErrorHandler } from '../common/ErrorHandler';

export function ModeratorReview() {
	const [show, setShow] = useState(false);
	const navigate = useNavigate();
	const languages = useAppStore(store => store.moderatorLanguages);
	const config = useAppStore(store => store.moderatorConfig);
	const { updateModeratorConfig } = useAppStore();

	if(config === null){
		return <ErrorHandler error='No language configuration detected' />
	}

	return (
		<>
			<div class='h-100 d-flex flex-column'>
				<div class='d-flex bg-primary'>
					<button className='btn btn-primary text-white p-3 rounded-0 w-100' onClick={() => setShow(true)}>
						Approve changes
					</button>
					<div className='p-2 px-4 text-white'>
						<LabeledSelect
							label='Primary language:'
							defaultValue={config.native}
							items={languages}
							labelFactory={item => item.langValue}
							valueFactory={item => item.langId}
							valueChanged={value => {
								const langId =  parseInt(value)
								updateModeratorConfig({...config,  native: langId, nativeCode: languages.find(l => l.langId === langId).langValue });
							}}
						/>
					</div>
					<div className='p-2 px-4 text-white'>
						<LabeledSelect
							label='Secondary language:'
							defaultValue={config.foreign}
							items={languages}
							labelFactory={item => item.langValue}
							valueFactory={item => item.langId}
							valueChanged={value => {
								const langId =  parseInt(value)
								updateModeratorConfig({...config, foreign: langId, foreignCode: languages.find(l => l.langId === langId).langValue });
							}}
						/>
					</div>
				</div>

				<div className='flex-fill'>
						<ContentComponent moderator={true} />
				</div>
			</div>
			<QuickModal show={show} setShow={setShow}>
				<Modal.Header closeButton>
					<Modal.Title>Are you sure you want to approve pending changes?</Modal.Title>
				</Modal.Header>
				<Modal.Footer>
					<Button
						className='text-white px-4'
						variant='success'
						onClick={() => {
							synchronizeDatabases()
								.then(() => {
									navigate('/site/user/admin/');
								})
								.catch(e => {
									alert(`Error on database synchronization: ${e}`);
								});
						}}>
						Yes
					</Button>
					<Button className='text-white px-4' variant='dark' onClick={() => setShow(false)}>
						No
					</Button>
				</Modal.Footer>
			</QuickModal>
		</>
	);
}
