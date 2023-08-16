import { useState, useEffect } from 'react';
import { InputGroup } from 'react-bootstrap';
import { ImSearch } from 'react-icons/im';
import { Input } from '../common/Input';
import { SoundButton } from './SoundButton';
import { motion } from 'framer-motion';
import { getFirstFileWithType } from '../../lib/utility';

const container = {
	visible: {
		opacity: 1,
		y: '0%',
		transition: {
			duration: 0.65,
			delayChildren: 0.2,
			staggerChildren: 0.15,
			ease: 'easeOut',
		},
	},
	hidden: { opacity: 0, y: '-5%' },
};
const item = {
	hidden: { y: 10, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
	},
};

export function Glossary({ node, moderator }) {
	const [searchQuery, setSearchQuery] = useState('');
	const [queryResult, setQueryResult] = useState(node.childs);

	useEffect(() => {
		const lowercaseSearchQuery = searchQuery.toLocaleLowerCase();
		setQueryResult(
			node.childs?.filter(
				child =>
					child.entityTranslations.at(0)?.mainTitle?.toLocaleLowerCase().includes(lowercaseSearchQuery) ||
					child.entityTranslations.at(1)?.mainTitle?.toLocaleLowerCase().includes(lowercaseSearchQuery)
			)
		);
	}, [node, searchQuery]);



	if (node === undefined) return <></>;

	return (
		<motion.div initial='hidden' animate='visible' variants={container}>
			<div className='d-flex pt-1 pb-1 p-1'>
				<InputGroup className='flex-fill '>
					<InputGroup.Text id='basic-addon1' className='p-3 bg-primary bg-gradient border-0'>
						<ImSearch size={24} />
					</InputGroup.Text>
					<Input value={searchQuery} setValue={setSearchQuery} placeholder='Search terms...' />
				</InputGroup>
			</div>
			<div className='overflow-auto rounded-4 select_option_scroll'>
				<motion.div variants={container} className='d-flex flex-column align-items-start p-1'>
					{queryResult?.map((term, index) => {
						return <GlossaryEntry key={index} node={term} moderator={moderator} />;
					})}
				</motion.div>
			</div>
		</motion.div>
	);
}

export function GlossaryEntry({ node, moderator }) {
	//TO DO
	// Do sprawdzenia ten filepath bo nie ma finda i nie okreslony typ
	const foreignSoundPath = getFirstFileWithType(node.entityTranslations.at(1), 'voice');
	return (
		<motion.div
			variants={item}
			className='my-2 px-1 px-lg-3 rounded-2 bg-light bg-gradient border-2 border border-dark w-100' /*style={{ background: '#ec66b7' }}*/
		>
			<div className='d-flex'>
				<SoundButton
					filePath={foreignSoundPath}
					className={`align-self-center btn m-2 p-2 my-3 ${foreignSoundPath ? 'btn-primary pointer ' : 'btn-dark'}`}
					moderator={moderator}
				/>
				<div className='px-2 py-1 lh-lg text-black'>
					<span className='fw-bold'>{node.entityTranslations.at(1)?.mainTitle}</span>
					<div>{node.entityTranslations.at(0)?.mainTitle}</div>
				</div>
			</div>
		</motion.div>
	);
}
