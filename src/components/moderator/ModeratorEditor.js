import { Button, Col, Container, Form, ListGroup, ListGroupItem, Modal, Row, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai';
import { IoMdAddCircleOutline, IoMdArrowBack } from 'react-icons/io';
import { RiTranslate } from 'react-icons/ri';
import { GiSoundOn } from 'react-icons/gi';

import { MdOutlineRemoveCircleOutline, MdMode } from 'react-icons/md';
import { useState, useRef, useCallback, useMemo } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { LabeledInput } from '../common/LabeledInput';
import { LabeledSelect } from '../common/LabeledSelect';
import { QuickModal } from '../common/QuickModal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	deleteEntity,
	findTranslation,
	generateEntityTranslation,
	generateEntityTranslationVoice,
	getEntityWithChildren,
	//getEntityWithTranslation,
	organizeNode,
	postEntity,
	refreshEntityLock,
	updateEntity,
} from '../../network/lib/entity';
import { deleteTranslationFile, postTranslationFile } from '../../network/lib/files';
import { postTranslation, updateTranslation } from '../../network/lib/translation';
import ReactQuill from 'react-quill';
import { useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { baseServerUrl } from '../../network/axiosClient';
import { NodeMapper } from '../../lib/utility';

import { motion, AnimatePresence } from 'framer-motion';

import { ErrorHandler } from '../common/ErrorHandler';
import { Sanitized } from '../common/Sanitized';
import { useAppStore } from '../../lib/store';
//import { LoadingSpinner } from '../LoadingSpinner';
import { LoadingComponent } from '../common/LoadingComponent';
const iconSize = 20;

const slideAnimationY = {
	hidden: {
		opacity: 0,
		x: '-5%',
	},
	visible: {
		opacity: 1,
		x: '0%',
		transition: {
			duration: '0.9',
			ease: 'easeOut',
		},
	},
};

const refreshLockSeconds = 40;

export function ModeratorEditor() {
	const { setSidebarState } = useAppStore();
	useEffect(() => {
		setSidebarState(sidebar => ({ layers: [] }));
	}, [setSidebarState]);
	const languages = useAppStore(store => store.moderatorLanguages);
	const nodeTypes = useAppStore(store => store.nodeTypes);
	const [modifiedNodeId, setModifiedNodeId] = useState(undefined);
	const [lastTimeRefreshed, setLastTimeRefreshed] = useState();

	const {
		data: node,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['workspace', ` ${modifiedNodeId ?? -1}`],
		queryFn: () => {
			if (modifiedNodeId !== undefined) {
				return getEntityWithChildren(
					modifiedNodeId,
					languages.map(l => l.langId),
					true
				);
			} else {
				return new Promise(resolve => resolve(0));
			}
		},
		onSuccess: data => {
			if (data !== 0 && data?.isLocked) {
				//setModifiedNodeId(undefined);
				//`	queryClient.invalidateQueries(['workspace']);
			}
		},
		onError: e => {},
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		refetchInterval: false,
	});

	useEffect(() => {
		if (lastTimeRefreshed?.entityId !== undefined && lastTimeRefreshed?.entityId !== modifiedNodeId) {
			refreshEntityLock({ entityId: lastTimeRefreshed.entityId, seconds: 0 }).catch(() => {
				// ignore error
			})
		}
		const timer = setTimeout(
			() => {
				if (modifiedNodeId !== undefined) {
					refreshEntityLock({ entityId: modifiedNodeId, seconds: refreshLockSeconds }).then(() => {
						setLastTimeRefreshed({ entityId: modifiedNodeId, time: Date.now() });
					}).catch(() => {
						//ignore error
					})
				}
			},
			lastTimeRefreshed?.entityId === undefined || lastTimeRefreshed?.entityId !== modifiedNodeId ? 10 : (refreshLockSeconds - 10) * 1000
		);

		return () => clearTimeout(timer);
	}, [lastTimeRefreshed, modifiedNodeId]);

	return (
		<Container fluid className='h-100'>
			<Row className='h-100 overflow-auto'>
				<Col className={`col-lg-4 col-12 px-0 ${modifiedNodeId === undefined ? '' : 'd-none d-lg-block'} bg-background bg-opacity-50`}>
					<TreeEditor modifyNodeWithId={setModifiedNodeId} modifiedNodeId={modifiedNodeId} rootNodeId={3} nodeTypes={nodeTypes} />
				</Col>
				<Col className={`col-lg-8 col-12 px-0  ${modifiedNodeId === undefined ? 'd-none d-lg-block' : ''}`} key={modifiedNodeId}>
					{isLoading ? (
						<div className='m-5 mh-100 align-items-center d-flex justify-content-center'>
							<LoadingComponent />
						</div>
					) : isError ? (
						<ErrorHandler error={error} />
					) : (
						node !== 0 && <NodeEditor setModifiedNodeId={setModifiedNodeId} nodeTypes={nodeTypes} languages={languages} node={node} />
					)}
				</Col>
			</Row>
		</Container>
	);
}

function NodeEditor({ languages, nodeTypes, setModifiedNodeId, node }) {
	const queryClient = useQueryClient();
	const config = useAppStore(store => store.config);
	const [selectedLangauageId, setSelectedLanguageId] = useState(config.native);
	const [showSuccess, setShowSuccess] = useState(false);

	// workspace states
	const [oldWorkspace, setOldWorkspace] = useState({ translation: null, custom: null, useCustom: false });
	const [newWorkspace, setNewWorkspace] = useState({});
	const [injectedWorkspace, setInjectedWorkspace] = useState(undefined);
	const [file, setFile] = useState();
	const [changesExist, setChangesExist] = useState(false);
	const noOldTranslation = useMemo(() => oldWorkspace.translation == null, [oldWorkspace]);

	// Used for AI translation
	const existingTranslations = useMemo(
		() =>
			node?.entityTranslations
				.filter(t => t?.langId !== undefined)
				.map(t => ({ ...t, langValue: languages.find(l => l.langId === t.langId).langValue })) ?? [],
		[node, languages]
	);

	const [baseTranslationId, setBaseTranslationId] = useState();
	useEffect(() => {
		setBaseTranslationId(existingTranslations.at?.(0)?.translationId);
	}, [existingTranslations]);

	const currentNodeType = useMemo(() => {
		return NodeMapper.get(node.typeId);
	}, [node]);
	const [chosenAudioTranslationField, setChosenAudioTranslationField] = useState();
	useEffect(() => {
		setChosenAudioTranslationField(currentNodeType?.textFields?.at(0).name);
	}, [currentNodeType]);

	const {
		mutate: genterateTranslation,
		isLoading: isLoadingAI,
		isError: isTextError,
		error: textError,
		isSuccess: textIsSuccess,
	} = useMutation(generateEntityTranslation, {
		onSuccess: generatedTranslation => {
			const { translationId, ...translation } = generatedTranslation;
			setInjectedWorkspace({ translation, useCustom: false });
		},
		onError: error => {
			alert(JSON.stringify(error));
		},
	});

	const {
		mutate: generateTranslationVoice,
		isLoading: isLoadingTranslationVoice,
		isError: isVoiceError,
		error: voiceError,
		isSuccess: voiceIsSuccess,
	} = useMutation(generateEntityTranslationVoice, {
		onSuccess: () => {
			queryClient.invalidateQueries(['workspace']);
		},
	});

	const { mutate: mutateAddTranslation } = useMutation(postTranslation, {
		onError: error => alert(`Error on adding translation: ${error}`),
		onSettled: () => {
			queryClient.invalidateQueries(['workspace']);
			setShowSuccess(true)
			//queryClient.invalidateQueries(['tree']);
		},
	});
	const { mutate: mutateUpdateTranslation } = useMutation(updateTranslation, {
		onError: error => alert(`Error on updating translation: ${error.message}`),
		onSettled: () => {
			queryClient.invalidateQueries(['workspace']);
			setShowSuccess(true)
			//queryClient.invalidateQueries(['tree']);
		},
	});
	const { mutate: mutateUpdateFile, isLoading: updateFileIsLoading } = useMutation(postTranslationFile, {
		onError: error => alert(`Error on updating translation file: ${error}`),
		onSettled: () => {
			queryClient.invalidateQueries(['workspace']);
		},
	});
	const { mutate: mutateDeleteFile } = useMutation(deleteTranslationFile, {
		onError: error => alert(`Error on deleting translation file: ${error}`),
		onSettled: () => {
			queryClient.invalidateQueries(['workspace']);
		},
	});

	useEffect(() => {
		let isCustomNode = currentNodeType?.textFields.some(tf => tf.name === 'isCustom');
		let currentLanguageTranslation = findTranslation(node, selectedLangauageId);
		if (currentLanguageTranslation === undefined) {
			setOldWorkspace({ translation: undefined, useCustom: false });
			return;
		}

		let { custom: _, ...translation } = currentLanguageTranslation;
		setFile(translation?.files);

		if (!isCustomNode) {
			setOldWorkspace({ translation: translation, useCustom: false });
			return;
		}

		try {
			let custom = JSON.parse(translation.paragrahps);
			setOldWorkspace({ translation, custom, useCustom: true });
		} catch (e) {
			setOldWorkspace({ translation: undefined, useCustom: true });
		}
	}, [selectedLangauageId, node, currentNodeType]);

	const saveChanges = useCallback(() => {
		let data = newWorkspace.useCustom
			? { ...newWorkspace.translation, paragrahps: JSON.stringify(newWorkspace.custom) }
			: { ...newWorkspace.translation };
		data.langId = selectedLangauageId;

		if (noOldTranslation) {
			data.entityId = node.entityId;
			mutateAddTranslation(data);
		} else {
			data.translationId = oldWorkspace.translation.translationId;
			mutateUpdateTranslation(data);
		}
	}, [newWorkspace, oldWorkspace, noOldTranslation, node, selectedLangauageId, mutateAddTranslation, mutateUpdateTranslation]);

	const saveFile = useCallback(
		(fileType, file) => {
			mutateUpdateFile({
				translationId: oldWorkspace.translation.translationId,
				filePriority: 0,
				file: file,
				referredField: fileType,
			});
		},
		[oldWorkspace, mutateUpdateFile]
	);

	const deleteFile = useCallback(
		fileType => {
			mutateDeleteFile(file.find(f => f.fileType === fileType).fileId);
		},
		[file, mutateDeleteFile]
	);

	const getModifiedNode = useCallback(() => {
		let translations = {
			files: file,
			countryCode: languages.find(l => l.langId === selectedLangauageId).langValue,
			langId: selectedLangauageId,
			...newWorkspace.translation,
			paragrahps: newWorkspace.useCustom ? JSON.stringify(newWorkspace.custom) : newWorkspace.translation?.paragrahps,
		};
		let n = {
			...node,
			isPreview: true,
			entityTranslations: [translations, translations],
		};
		return n;
	}, [node, newWorkspace, selectedLangauageId, languages, file]);

	useEffect(() => {
		setChangesExist(
			JSON.stringify(oldWorkspace.translation) !== JSON.stringify(newWorkspace.translation) ||
				JSON.stringify(oldWorkspace.translation?.paragrahps) !== JSON.stringify(newWorkspace.custom)
		);
	}, [oldWorkspace, newWorkspace]);

	const handleTranslate = () => {
		genterateTranslation({ translationId: baseTranslationId, desiredLanguageId: selectedLangauageId });
		setIsAITranslationGenerated(true);
	};

	const handleAISoundGenerate = () => {
		generateTranslationVoice({ translationId: oldWorkspace.translation.translationId, referredField: chosenAudioTranslationField });
		setIsAIVoiceGenerated(true);
	};
	const [IsAIVoiceGenerated, setIsAIVoiceGenerated] = useState(false);
	const [IsAITranslationGenerated, setIsAITranslationGenerated] = useState(false);
	const handleResetAIComunicate = () => {
		setIsAIVoiceGenerated(false);
		setIsAITranslationGenerated(false);
		setIsAiSoundActive(false);
		setIsAiActive(false);
	};

	const [isAIActive, setIsAiActive] = useState(false);
	const [isAISoundActive, setIsAiSoundActive] = useState(false);

	if(config === null){
		return <ErrorHandler error='No language configuration detected' />
	}

	return (
		<div className='h-100 d-flex flex-column'>
			<div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 9999, width:'300px' }}>
				<ToastContainer className='position-static p-3'>
					<Toast show={showSuccess} onClose={() => setShowSuccess(false)} delay={2000} autohide>
						<Toast.Header>
							<strong className='me-auto'>Moderator</strong>
						</Toast.Header>
						<Toast.Body>
							<div className='d-flex align-items-center'>
								Changes saved
							</div>
						</Toast.Body>
					</Toast>
				</ToastContainer>
			</div>
			<div className='btn btn-primary d-lg-none w-100 rounded-0 text-white' onClick={() => setModifiedNodeId(undefined)}>
				<IoMdArrowBack />{' '}
			</div>
			<div className='flex-fill'>
				<div className='default_scroll_trans h-50 overflow-auto position-relative bg-white shadow' key={selectedLangauageId}>
					<motion.div
						className='py-1 bg-background text-white'
						style={{
							gap: '9px',
							gridTemplateColumns: 'repeat(auto-fit, minmax(15em, 1fr))',
							display: 'grid',
							justifyContent: 'stretch',
							justifyItems: 'center',
							alignItems: 'center',
						}}>
						<motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} className='d-flex justify-content-center fw-bold'>
							<div
								onClick={() => {
									setIsAiActive(oldisAIActive => !oldisAIActive);
								}}
								className=' btn fw-semibold btn-background text-white py-1 border border-2 border-secondary'>
								<RiTranslate size={24} className='me-1' />
								Traslation AI
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 1, x: '-100%' }}
							animate={{ opacity: isAIActive ? 1 : 0, x: isAIActive ? '0%' : '-100%' }}
							className={`${isAIActive ? '' : 'd-none'}`}>
							<LabeledSelect
								className='py-0 m-0 pe-1'
								label={'Base on Language:'}
								defaultValue={baseTranslationId}
								valueChanged={value => setBaseTranslationId(parseInt(value))}
								items={existingTranslations}
								valueFactory={item => item.translationId}
								labelFactory={item => item.langValue}
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 1 }}
							animate={{ opacity: isAIActive ? 1 : 0 }}
							className={`${isAIActive ? 'btn py-1 btn-background text-white border border-2 border-secondary' : 'd-none'}`}
							whileTap={{ scale: 0.86 }}
							onClick={() => {
								handleTranslate();
							}}>
							Generate
						</motion.div>

						<motion.div
							initial={{ opacity: 1 }}
							animate={{ opacity: isAIActive ? 1 : 0 }}
							className={`${isAIActive ? 'd-flex justify-content-center fw-bold text-success' : 'd-none'}`}>
							{IsAITranslationGenerated ? (
								isLoadingAI ? (
									<Spinner className='text-primary' />
								) : isTextError ? (
									textError.message
								) : textIsSuccess ? (
									'Generated succcessfuly!'
								) : (
									''
								)
							) : (
								''
							)}
						</motion.div>
					</motion.div>

					<div className='d-flex flex-column w-100 p-4 position-absolute'>
						<div className='fw-semibold'>
							Node type: <span className='fw-bold'>{nodeTypes.find(t => t.typeId === node.typeId).typeValue}</span>
						</div>
						<LabeledSelect
							className='fw-semibold pt-2 mb-3'
							label={'Translation:'}
							defaultValue={selectedLangauageId}
							valueChanged={value => {
								setSelectedLanguageId(parseInt(value));
								handleResetAIComunicate();
							}}
							items={languages}
							valueFactory={item => item.langId}
							labelFactory={item => item.langValue}
						/>

						<NodeFields
							key={`${selectedLangauageId}`}
							node={node}
							oldWorkspace={oldWorkspace}
							newWorkspaceChanged={setNewWorkspace}
							injectedWorkspace={injectedWorkspace}
						/>

						<Button className='mb-3 text-white' variant='primary' onClick={e => saveChanges()} disabled={!changesExist}>
							Save
						</Button>

						{updateFileIsLoading ? (
							<div className='m-5 mh-100 align-items-center d-flex justify-content-center'>
								<LoadingComponent />
							</div>
						) : (
							currentNodeType?.fileFields.includes('voice') &&
							!noOldTranslation && (
								<Form.Group className=' mb-3 bg-light p-2 rounded'>
									<AnimatePresence mode='wait'>
										<div>
											<div key={'b'} className='align-items-center d-flex flex-md-row flex-column m-1 m-sm-0'>
												<span className='fw-semibold'>Audio</span>
												<motion.div
													whileTap={{ scale: 0.93 }}
													whileHover={{ scale: 1.1 }}
													className='btn m-2 py-2 fw-semibold text-white border-2 border-secondary border btn-background'
													onClick={() => {
														setIsAiSoundActive(oldisAIActive => !oldisAIActive);
													}}>
													<GiSoundOn size={25} className='mt-0 text-center p-0 fw-semibold me-1' />
													AUDIO AI
												</motion.div>
												<motion.div
													initial={{ opacity: 1, x: '-100%' }}
													animate={{ opacity: isAISoundActive ? 1 : 0, x: isAISoundActive ? '0%' : '-100%' }}
													exit={{ opacity: 0 }}
													className={`${isAISoundActive ? '' : 'd-none'}`}>
													<LabeledSelect
														className='py-0 m-0'
														label={'Select type:'}
														defaultValue={chosenAudioTranslationField}
														valueChanged={value => setChosenAudioTranslationField(value)}
														items={currentNodeType?.textFields}
														valueFactory={item => item.name}
														labelFactory={item => item.name}
													/>
												</motion.div>
												<motion.div
													initial={{ opacity: 1, x: '-100%' }}
													animate={{ opacity: isAISoundActive ? 1 : 0, x: isAISoundActive ? '0%' : '-100%' }}
													exit={{ opacity: 0 }}
													className={`${
														isAISoundActive
															? 'btn m-1 m-sm-0 py-1 btn-background fw-semibold text-white border border-2 border-secondary'
															: 'd-none'
													}`}
													whileTap={{ scale: 0.86 }}
													onClick={() => {
														handleAISoundGenerate();
													}}>
													GENERATE
												</motion.div>
												<motion.div
													initial={{ opacity: 1 }}
													animate={{ opacity: isAISoundActive ? 1 : 0 }}
													exit={{ opacity: 0 }}
													className='ms-2 fw-semibold '>
													{IsAIVoiceGenerated ? (
														isLoadingTranslationVoice ? (
															<Spinner />
														) : isVoiceError ? (
															voiceError.response.data
														) : voiceIsSuccess ? (
															'Generated succcessfuly!'
														) : (
															''
														)
													) : (
														''
													)}
												</motion.div>
											</div>

											{file?.find(f => f.fileType === 'voice') ? (
												<div className='d-flex flex-column flex-sm-row'>
													<ReactAudioPlayer
														className='m-2 m-sm-0 mw-100 pe-sm-0 pe-2'
														controls
														src={`${baseServerUrl}/Moderator/EntityTranslationFiles/getEntityTranslationFile?fileIdentifier=${
															file?.find(f => f.fileType === 'voice').filePath
														}`}
													/>
													<Button variant='danger' className='ms-2 px-4' onClick={() => deleteFile('voice')}>
														Delete
													</Button>
												</div>
											) : (
												<Form.Control type='file' onChange={e => saveFile('voice', e.target.files[0])} />
											)}
										</div>
									</AnimatePresence>
								</Form.Group>
							)
						)}

						{updateFileIsLoading ? (
							<div className='m-5 mh-100 align-items-center d-flex justify-content-center'>
								<LoadingComponent />
							</div>
						) : (
							currentNodeType?.fileFields.includes('image') &&
							!noOldTranslation && (
								<Form.Group className='mb-3 bg-light p-2 rounded'>
									<Form.Label className='fw-semibold'>Image</Form.Label>
									{file?.find(f => f.fileType === 'image') ? (
										<div className='d-flex align-items-center'>
											<Button variant='danger' className='ms-2 px-4' onClick={() => deleteFile('image')}>
												Delete
											</Button>
										</div>
									) : (
										<Form.Control type='file' onChange={e => saveFile('image', e.target.files[0])} />
									)}
								</Form.Group>
							)
						)}

						{updateFileIsLoading ? (
							<div className='m-5 mh-100 align-items-center d-flex justify-content-center'>
								<LoadingComponent />
							</div>
						) : (
							currentNodeType?.fileFields.includes('video') &&
							!noOldTranslation && (
								<Form.Group className='mb-3 bg-light p-2 rounded'>
									<Form.Label className='fw-semibold'>Video</Form.Label>
									{file?.find(f => f.fileType === 'video') ? (
										<div className='d-flex align-items-center'>
											<Button variant='danger' className='ms-2 px-4' onClick={() => deleteFile('video')}>
												Delete
											</Button>
										</div>
									) : (
										<Form.Control type='file' onChange={e => saveFile('video', e.target.files[0])} />
									)}
								</Form.Group>
							)
						)}
					</div>
				</div>

				<div className='default_scroll_trans position-relative overflow-auto h-50 bg-light bg-gradient border-2 border-top border-dark'>
					<div key={`mapperNode_${node.entityId}_${selectedLangauageId}`} className='position-absolute w-100 p-4'>
						{currentNodeType?.mapper(organizeNode(getModifiedNode(), [selectedLangauageId, selectedLangauageId]), true) ?? (
							<div className='text-center h1'>There is no preview</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function NodeFields({ node, oldWorkspace, newWorkspaceChanged, injectedWorkspace }) {
	const [newWorkspace, setNewWorkspace] = useState({});
	const [mainTitle, setMainTitle] = useState('');
	const [paragrahps, setParagraphs] = useState('');
	const [custom, setCustom] = useState();

	const textFields = NodeMapper.get(node.typeId).textFields ?? [];

	// brzydko ale to jedyny sposób
	useEffect(() => {
		setNewWorkspace(old => ({ ...old, translation: { ...old.translation, mainTitle } }));
	}, [mainTitle]);
	useEffect(() => {
		setNewWorkspace(old => ({ ...old, translation: { ...old.translation, paragrahps } }));
	}, [paragrahps]);
	useEffect(() => {
		setNewWorkspace(old => ({ ...old, translation: { ...old.translation }, custom, useCustom: custom !== undefined }));
		
	}, [custom]);

	useEffect(() => {
		if (injectedWorkspace === undefined) return;
		if (injectedWorkspace.translation?.entityId !== undefined) {
			setNewWorkspace(old => ({ ...old, entityId: injectedWorkspace.translation.entityId }));
		}
		setMainTitle(injectedWorkspace.translation?.mainTitle ?? '');
		setParagraphs(injectedWorkspace.translation?.paragrahps ?? '');
		if (injectedWorkspace.useCustom) {
			setCustom(injectedWorkspace.custom ?? {});
		}
	}, [injectedWorkspace]);

	useEffect(() => {
		if (oldWorkspace.translation?.entityId !== undefined) {
			setNewWorkspace(old => ({ ...old, entityId: oldWorkspace.translation.entityId }));
		}
		setMainTitle(oldWorkspace.translation?.mainTitle ?? '');
		setParagraphs(oldWorkspace.translation?.paragrahps ?? '');
		if (oldWorkspace.useCustom) {
			setCustom(oldWorkspace.custom ?? {});
		} else {
			setCustom(undefined);
		}
	}, [oldWorkspace]);

	useEffect(() => {
		newWorkspaceChanged(newWorkspace);
	}, [newWorkspaceChanged, newWorkspace]);

	return (
		<>
			{textFields.some(tf => tf.name === 'MainTitle' && tf.type === 'f') && (
				<Form.Group className='mb-3 fw-semibold '>
					<LabeledInput
						label='Title'
						value={mainTitle}
						setValue={value => {
							setMainTitle(value);
						}}
					/>
				</Form.Group>
			)}
			{textFields.some(tf => tf.name === 'MainTitle' && tf.type === 'q') && (
				<Form.Group className='mb-3'>
					<ReactQuill
						theme='snow'
						value={mainTitle}
						onChange={value => {
							setMainTitle(value);
						}}
					/>
				</Form.Group>
			)}
			{textFields.some(tf => tf.name === 'Paragraphs' && tf.type === 'f') && (
				<Form.Group className='mb-3'>
					<ReactQuill
						theme='snow'
						value={paragrahps}
						onChange={value => {
							setParagraphs(value);
						}}
					/>
				</Form.Group>
			)}
			{textFields.some(tf => tf.name === 'testQuestion' && tf.type === 'f') && (
				<Form.Group className='mb-3'>
					<LabeledInput
						label='Description'
						value={custom?.description ?? ''}
						setValue={value => {
							setCustom({ ...custom, description: value });
						}}
					/>
					<LabeledInput
						label='Question'
						value={custom?.question ?? ''}
						setValue={value => {
							setCustom({ ...custom, question: value });
						}}
					/>
					<LabeledInput
						label='Answers'
						value={custom?.answers ?? '[]'}
						setValue={value => {
							setCustom({ ...custom, answers: value });
						}}
					/>
				</Form.Group>
			)}
		</>
	);
}

function NodeItem({ index, node, id, moveItem, navigateForward, modifyNodeWithId, removeNode, orderEditEnabled }) {
	const nodeTypes = useAppStore(store => store.nodeTypes);

	const childValidator = NodeMapper.get(node.typeId).isChildValid;
	const ref = useRef(null);
	const [{ handlerId }, drop] = useDrop({
		accept: 'node',
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
			};
		},
		hover(item, monitor) {
			if (!ref.current) {
				return;
			}
			const dragIndex = item.index;
			const hoverIndex = index;
			// Don't replace items with themselves
			if (dragIndex === hoverIndex) {
				return;
			}
			// Determine rectangle on screen
			const hoverBoundingRect = ref.current?.getBoundingClientRect();
			// Get vertical middle
			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
			// Determine mouse position
			const clientOffset = monitor.getClientOffset();
			// Get pixels to the top
			const hoverClientY = clientOffset.y - hoverBoundingRect.top;
			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%
			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}
			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}
			// Time to actually perform the action
			moveItem(dragIndex, hoverIndex);
			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			item.index = hoverIndex;
		},
	});
	const [{ isDragging }, drag] = useDrag({
		type: 'node',
		item: () => {
			return {
				id: id,
				index: index,
			};
		},
		isDragging: monitor => {
			return monitor.getItem().index === index;
		},
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	});

	drag(drop(ref));
	return (
		<ListGroupItem
			as={motion.div}
			ref={ref}
			key={index}
			data-handler-id={handlerId}
			variant='white'
			className={`d-flex flex-row justify-content-between align-items-center p-2 ${orderEditEnabled ? 'list-group-item-action' : ''}`}
			animate={{ opacity: isDragging ? 0 : 1, y: isDragging ? '25%' : '0%' }}>
			<div style={{ overflowX: 'hidden' }}>
				<Sanitized text={node.entityTranslations[0]?.mainTitle} className='quill' />
			</div>

			<div className='ms-auto d-flex flex-row align-items-center'>
				<Button
					disabled={node.isLocked || orderEditEnabled}
					variant='dark'
					className={`ms-2 `}
					onClick={() => modifyNodeWithId(node.entityId)}>
					<MdMode className='text-white' size={iconSize} />
				</Button>

				<Button disabled={node.isLocked || orderEditEnabled} variant='danger' className='ms-2' onClick={() => removeNode(node)}>
					<MdOutlineRemoveCircleOutline className='text-white' size={iconSize} />
				</Button>

				<Button
					variant='primary'
					className={`${!nodeTypes.some(nt => childValidator(nt.typeId)) ? 'bg-light border-light' : ''} ms-2`}
					onClick={e => navigateForward(e, node)}
					disabled={orderEditEnabled || !nodeTypes.some(nt => childValidator(nt.typeId))}>
					<AiOutlineDoubleRight className='text-white' size={iconSize} />
				</Button>
			</div>
		</ListGroupItem>
	);
}

function TreeEditor({ rootNodeId, modifiedNodeId, modifyNodeWithId, nodeTypes }) {
	const config = useAppStore(store => store.config);
	const [showRemove, setShowRemove] = useState(false);
	const [removedNode, setRemovedNode] = useState(undefined);
	const [showAdd, setShowAdd] = useState(false);
	const [nodeTypeId, setNodeTypeId] = useState(nodeTypes[0].typeId);
	const [path, setPath] = useState([rootNodeId]);
	const [orderEditEnabled, setOrderEditEnabled] = useState(false);
	const [currentNode, setCurrentNode] = useState(undefined);
	const [oldOrder, setOldOrder] = useState(undefined);

	const validChilds = useMemo(() => {
		if (currentNode === undefined) return [];
		return nodeTypes.filter(nt => NodeMapper.get(currentNode.typeId)?.isChildValid(nt.typeId));
	}, [nodeTypes, currentNode]);

	useEffect(() => {
		if (validChilds !== undefined && validChilds.length > 0) {
			setNodeTypeId(validChilds[0].typeId);
		}
	}, [validChilds]);

	const queryClient = useQueryClient();
	const { isLoading, isError, error } = useQuery({
		queryKey: ['tree', path],
		queryFn: () => getEntityWithChildren(path.at(-1), [config.native, config.foreign], true),
		enabled: !orderEditEnabled,
		onSettled: data => setCurrentNode(data),
	});
	const { mutate: mutateAddNode } = useMutation(postEntity, {
		onError: error => {
			//alert(`Error on adding node: ${error}`)
		},
		onSettled: () => {
			queryClient.invalidateQueries(['tree']);
		},
	});
	const { mutate: mutateDeleteNode } = useMutation(deleteEntity, {
		onError: () => alert('Error on deleting node'),
		onSettled: () => {
			queryClient.invalidateQueries(['tree']);
			modifyNodeWithId(undefined)
		},
	});
	const { mutate: mutateReorderNodes } = useMutation(updateEntity, {
		onError: () => alert('Error on reordering nodes'),
		onSettled: () => {
			queryClient.invalidateQueries(['tree']);
		},
	});

	const toggleEditOrderEnabled = useCallback(() => {
		if (!orderEditEnabled) {
			modifyNodeWithId(undefined);
			setOldOrder(currentNode.childs.map(child => child.entityId));
		} else {
			const newOrder = currentNode.childs.map(child => child.entityId);
			if (JSON.stringify(oldOrder) !== JSON.stringify(newOrder)) {
				const patchData = currentNode.childs.map((child, index) => ({ entityId: child.entityId, entityOrder: index }));
				mutateReorderNodes(patchData);
			}
		}
		setOrderEditEnabled(!orderEditEnabled);
	}, [orderEditEnabled, currentNode, oldOrder, modifyNodeWithId, mutateReorderNodes]);

	const navigateBackward = useCallback(
		e => {
			setPath(oldPath => [...oldPath.slice(0, oldPath.length - 1)]);
			modifyNodeWithId(undefined);
		},
		[modifyNodeWithId]
	);

	const navigateForward = useCallback(
		(e, node) => {
			const entityId = node.entityId;
			setPath([...path, entityId]);
			modifyNodeWithId(undefined);
			queryClient.invalidateQueries(['tree']);
		},
		[modifyNodeWithId, path, queryClient]
	);

	const handleAddNode = useCallback(
		typeId => {
			const postEntity = { parentId: currentNode.entityId, typeId: typeId, entityOrder: currentNode.childs.length };
			mutateAddNode(postEntity);
		},
		[currentNode, mutateAddNode]
	);

	const handleRemoveNode = useCallback(() => {
		mutateDeleteNode(removedNode.entityId);
		if (modifiedNodeId === removedNode.entityId) modifyNodeWithId(undefined);
	}, [mutateDeleteNode, removedNode, modifiedNodeId, modifyNodeWithId]);

	const moveItem = useCallback(
		(fromIndex, toIndex) => {
			if (orderEditEnabled) {
				const newChilds = [...currentNode.childs];
				newChilds.splice(toIndex, 0, newChilds.splice(fromIndex, 1)[0]);
				setCurrentNode({ ...currentNode, childs: newChilds });
			}
		},
		[orderEditEnabled, currentNode]
	);

	if (isLoading)
		return (
			<div className='m-5 mh-100 align-items-center d-flex justify-content-center'>
				<LoadingComponent />
			</div>
		);

	if (isError) return <ErrorHandler error={error} />;
	if(config === null){
		return <ErrorHandler error='No language configuration detected' />
	}

	return (
		<div className='h-100 w-100 position-relative'>
			<motion.div
				initial='hidden'
				animate='visible'
				variants={slideAnimationY}
				className='h-100 w-100 position-absolute d-flex flex-column p-2 p-lg-3'>
				<Button variant={orderEditEnabled ? 'primary' : 'dark'} className='mb-3 text-white' onClick={() => toggleEditOrderEnabled()}>
					Order Edit Mode
				</Button>
				<ListGroup className='rounded-2 flex-fill overflow-auto'>
					<ListGroupItem variant='secondary' className='d-flex flex-row align-items-center '>
						<Button
							variant={path.length <= 1 ? 'dark' : 'primary'}
							className='shadow me-2 '
							disabled={path.length <= 1 || orderEditEnabled}
							onClick={navigateBackward}>
							<AiOutlineDoubleLeft />
						</Button>
						<Sanitized text={currentNode?.entityTranslations[0]?.mainTitle} className='quill' />
						<Button
							disabled={currentNode?.isLocked || orderEditEnabled}
							variant='dark'
							className={`ms-2 `}
							onClick={() => modifyNodeWithId(currentNode?.entityId)}>
							<MdMode className='text-white' size={iconSize} />
						</Button>
					</ListGroupItem>
					<div className='h-100 position-relative overflow-auto rounded-bottom'>
						<div className='h-100 overflow-auto default_scroll'>
							{currentNode?.childs.map((child, index) => {
								return (
									<NodeItem
										key={index}
										index={index}
										moveItem={moveItem}
										node={child}
										id={child.entityId}
										navigateForward={navigateForward}
										modifyNodeWithId={modifyNodeWithId}
										orderEditEnabled={orderEditEnabled}
										removeNode={() => {
											setRemovedNode(child);
											setShowRemove(true);
										}}
									/>
								);
							})}
							<ListGroupItem
								variant='success'
								style={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }}
								className='shadow d-flex justify-content-center btn rounded-bottom btn-success py-2'
								onClick={() => setShowAdd(true)}
								disabled={orderEditEnabled}>
								<IoMdAddCircleOutline size={iconSize} />
							</ListGroupItem>
						</div>
					</div>
				</ListGroup>

				{/*Remove node modal*/}
				<QuickModal show={showRemove} setShow={setShowRemove}>
					<Modal.Header closeButton>Do you really want to delete this node?</Modal.Header>
					<Modal.Body>{removedNode?.translations?.native.mainTitle}</Modal.Body>
					<Modal.Footer>
						<Button
							variant='light'
							onClick={e => {
								setShowRemove(false);
								setRemovedNode(undefined);
							}}>
							No
						</Button>
						<Button
							variant='danger'
							onClick={e => {
								handleRemoveNode();
								setShowRemove(false);
							}}>
							Yes
						</Button>
					</Modal.Footer>
				</QuickModal>

				{/*Add node modal*/}
				<QuickModal show={showAdd} setShow={setShowAdd}>
					<Modal.Header closeButton>Add Node</Modal.Header>
					<Modal.Body>
						<LabeledSelect
							label='Node type:'
							className='py-2'
							defaultValue={nodeTypeId}
							valueChanged={value => setNodeTypeId(parseInt(value))}
							items={validChilds}
							valueFactory={nodeType => nodeType?.typeId}
							labelFactory={nodeType => nodeType?.typeValue}
						/>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant='light'
							onClick={e => {
								setNodeTypeId(nodeTypes[0].typeId);
								setShowAdd(false);
							}}>
							Cancel
						</Button>
						<Button
							variant='success'
							onClick={e => {
								handleAddNode(nodeTypeId);
								setNodeTypeId(nodeTypes[0].typeId);
								setShowAdd(false);
							}}>
							Confirm
						</Button>
					</Modal.Footer>
				</QuickModal>
			</motion.div>
		</div>
	);
}