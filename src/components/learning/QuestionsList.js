import { useState } from 'react';
import { ListGroup, Button} from 'react-bootstrap';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight, AiOutlineRight } from 'react-icons/ai';
import { motion } from 'framer-motion';
import sass_variables from '../../preferences.scss';
import { useAppStore } from '../../lib/store';
import { useQuery } from '@tanstack/react-query';
import { /*getEntityWithChildren,*/ getEntityWithChildrenConfig } from '../../network/lib/entity';
import { SoundButton } from './SoundButton';
import styles from '../common/common.module.scss';
import Flag from 'react-flagkit';
import { Sanitized } from '../common/Sanitized';
import { getFirstFileWithType } from '../../lib/utility';
import { ErrorHandler } from '../common/ErrorHandler';
import { ContentNavigationItem } from './ContentNavigation';
import { LoadingComponent } from '../common/LoadingComponent';

const nativeVariants = {
	native: {
		rotateY: 0,
		scale: 1,
	},
	foreign: {
		rotateY: 180,
		scale: 0,
		color: 'rgba(0,0,0,0)',
	},
};
const foreignVariants = {
	foreign: {
		rotateY: 0,
		scale: 1,
	},
	native: {
		rotateY: 180,
		scale: 0,
	},
};

const transition = {
	type: 'spring',
	bounce: 0,
	duration: 0.1,
};

export function QuestionsList({ node, moderator, isRoot }) {
	const config = useAppStore(store => (moderator ? store.moderatorConfig : store.config));
	const [currentNodeId, setCurrentNodeId] = useState(node.entityId);
	const [path, setPath] = useState([node]);
	const [selctedIndex, setSelectedIndex] = useState(-1);

	const isPreview = node.isPreview;


	const { isLoading, isError, error } = useQuery({
		queryKey: ['question', `question_${currentNodeId}_${JSON.stringify(config)}`],
		queryFn: () => getEntityWithChildrenConfig(currentNodeId, config, moderator),
		onSettled: data => {
			if(moderator && isPreview) return;
			if (path.at(-1).entityId !== data.entityId) {
				setPath(prevPath => [...prevPath, data]);
			} else {
				setPath(prevPath => {
					prevPath[prevPath.length - 1] = data;
					return prevPath;
				});
			}
		},
		disabled: (moderator&&isPreview) ?? false
	});

	const handleNavigateQuestionBack = event => {
		setCurrentNodeId(path.at(-2).entityId);
		const newPath = path.slice(0, -1);
		setPath(newPath);
		setSelectedIndex(-2);
	};

	const handleNavigateToQuestionNode = (event, questionNode) => {
		setCurrentNodeId(questionNode.entityId);
		setSelectedIndex(-2);
	};

	const getNavigationBackListItem = path => {
		return (
			<>
				<div className='d-flex w-100 h-100 align-items-stretch justify-content-start'>
					<Button
						className={`btn rounded m-1 px-3 ${styles.item1} ${path.length === 1 ? ' ' : 'bg-primary'} `}
						onClick={e => handleNavigateQuestionBack(e)}
						disabled={path.length === 1}>
						<AiOutlineDoubleLeft size={24} />
					</Button>
					<div className='flex-fill d-flex w-100 align-items-center justify-content-start py-3'>
						{path.map((item, index) => {
							if (index === 0)
								return (
									<div key={index}>
										<AiOutlineRight size={24} />
									</div>
								);
							if (item?.native === null) return <span key={index}></span>;

							return (
								<motion.div
									initial={{ x: '-5%', opacity: 0 }}
									animate={{ x: '0%', opacity: 1 }}
									key={index}
									className='d-flex flex-wrap align-items-center text-center'>
									<Sanitized text={item.entityTranslations[0]?.mainTitle} className='quill flex-fill p-0 m-0' />
									<AiOutlineRight size={24} />
								</motion.div>
							);
						})}
					</div>
				</div>
			</>
		);
	};

	const handleSelect = index => {
		if (selctedIndex === index) {
			setSelectedIndex(-2);
		} else {
			setSelectedIndex(index);
		}
	};

	if(isPreview && isRoot){
		return <ContentNavigationItem node={node} moderator={true} />
	}

	const moderatorCountryCode = node.entityTranslations.at(0)?.countryCode;
	const nativeCode = moderatorCountryCode ?? config.nativeCode;
	const foreignCode = moderatorCountryCode ?? config.foreignCode;

	if (isLoading)
		return (
			<div className='m-5 mh-100 align-items-center d-flex justify-content-center'>
				<LoadingComponent />
			</div>
		);

		
	if (isError) return <ErrorHandler error={error}/>
	if(config === null){
		return <ErrorHandler error='No language configuration detected' />
	}


	return (
		<>
			<div className=''>
				<motion.div className='list-group'>
					{<ListGroup.Item className='p-0 my-2 rounded-top rounded-bottom'>{getNavigationBackListItem(path)}</ListGroup.Item>}
					{((moderator&&isPreview) ? [node] : path.at(-1).childs)?.map((child, index) => {
						const params = {
							isForward: child.hasChilds,
							nativeText: child.entityTranslations[0]?.mainTitle,
							foreignText: child.entityTranslations[1]?.mainTitle,
							nativeAudioPath: getFirstFileWithType(child.entityTranslations.at(0), 'voice'),
							foreignAudioPath: getFirstFileWithType(child.entityTranslations.at(1), 'voice'),
							nativeLangCode: nativeCode,
							foreignLangCode: foreignCode,
							isSelected: selctedIndex === index,
						};
						return (
							<motion.li
								key={index}
								className='list-group-item rounded my-1 border-0 p-0'
								initial={'native'}
								animate={params.isSelected ? 'foreign' : 'native'}
								variants={{
									native: {
										backgroundColor: '#fff',
										color: sass_variables.textLight,
										transition: {
											duration: 0.3,
										},
									},
									foreign: {
										backgroundColor: '#aaa',
										color: sass_variables.textLight,
										transition: {
											duration: 0.1,
										},
									},
								}}>
								{true ? (
									<NavigationForwardListItem
										{...params}
										click={e => handleNavigateToQuestionNode(e, child)}
										buttonClassName={`${index % 2 ? styles.item1 : styles.item2}`}
										textClick={() => handleSelect(index)}
										moderator={moderator}
										isPreview={node.isPreview}
									/>
								) : (
									<TranslatedText {...params} textClick={() => handleSelect(index)} moderator={moderator} />
								)}
							</motion.li>
						);
					})}
				</motion.div>
			</div>
		</>
	);
}

function TranslatedText({
	nativeText,
	foreignText,
	nativeAudioPath,
	foreignAudioPath,
	nativeLangCode,
	foreignLangCode,
	isSelected,
	textClick,
	moderator,
}) {
	return (
		<div className='p-2 ps-3 flex-fill d-flex align-items-center'>
			<button className={`btn btn-white border-0 p-0 m-0 me-2 ${isSelected ? 'd-none' : ''}`} onClick={() => textClick()}>
				<Flag country={nativeLangCode} size={34} />
			</button>
			<button className={`btn btn-white border-0 p-0 m-0 me-2 ${isSelected ? '' : 'd-none'}`} onClick={() => textClick()}>
				<Flag country={foreignLangCode} size={34} />
			</button>
			<div className='flex-fill text-start'>
				<motion.div
					className={`h-100 d-flex align-items-center ${isSelected ? 'd-none' : ''}`}
					variants={nativeVariants}
					transition={transition}>
					<Sanitized text={nativeText} className='quill' />
				</motion.div>
				<motion.div
					className={`h-100 d-flex align-items-center ${isSelected ? '' : 'd-none'}`}
					variants={foreignVariants}
					transition={transition}>
					<Sanitized text={foreignText} className='quill' />
				</motion.div>
			</div>
			<div className='ms-auto'>
				<SoundButton
					filePath={nativeAudioPath}
					className={`border-0 p-2 m-1 ${nativeAudioPath ? 'btn-primary pointer ' : 'btn-dark'}    ${isSelected ? 'd-none' : ''}`}
					moderator={moderator}
				/>
				<SoundButton
					filePath={foreignAudioPath}
					className={`border-0 p-2 m-1 ${foreignAudioPath ? 'btn-primary pointer ' : 'btn-dark'} ${isSelected ? '' : 'd-none'}`}
					moderator={moderator}
				/>
			</div>
		</div>
	);
}

function NavigationForwardListItem({ click, textClick, buttonClassName, isForward, moderator, isPreview, ...params }) {
	return (
		//Do zrobienia tak zeby gdy wchodzi sie to z lewej zsuwa sie na srodek a gdy kliknie sie to leci w prawo i znika
		//(plus ogarnac te tlo zeby nie wchodzilo tak dziwnie sam tekst)
		//<AnimatePresence>
		<motion.div /*initial={{x: "-10%"}} animate={{x: "0%"}} exit={{ x: isShifted ? "10%" : "0%"}}*/ className='d-flex w-100'>
			<TranslatedText {...params} textClick={textClick} moderator={moderator} />
			
			<motion.button
				style={{ borderRadius: '0px 5px 5px 0px' }}
				className={` bg-secondary px-3 ${buttonClassName}`}
				disabled={!isForward || (moderator && isPreview)}
				onClick={e => {
					click(e);
				}}>
				<AiOutlineDoubleRight size={24} className={` ${isForward ? '' : 'opacity-0 '}`} />
			</motion.button>
		</motion.div>
		//</AnimatePresence>
	);
}