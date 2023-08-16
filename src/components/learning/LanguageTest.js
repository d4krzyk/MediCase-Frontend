import { useCallback, useRef, useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useDrag, useDrop } from 'react-dnd';
import { motion } from 'framer-motion';

const slideAnimationX = {
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

const containerSlideY = {
	visible: {
		opacity: 1,
		y: '0%',
		transition: {
			duration: 0.7,
			delayChildren: 0.3,
			staggerChildren: 0.15,
			ease: 'easeOut',
		},
	},
	hidden: { opacity: 0, y: '15%' },
};
const containerOpacity = {
	visible: {
		opacity: 1,
		y: '0%',
		transition: {
			duration: 0.7,
			delayChildren: 0.3,
			staggerChildren: 0.15,
			ease: 'easeOut',
		},
	},
	hidden: { opacity: 0, y: '0%' },
};
const itemslideY = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
	},
};

export function Test({ node, moderator }) {
	const [currentQuestion, setCurrentQuestion] = useState(-1);
	const [answers, setAnswers] = useState(Array(node.childs?.length).fill(undefined));

	const answered = useCallback(
		answer => {
			const newAnswers = answers;
			newAnswers.splice(currentQuestion, 1, answer);
			setAnswers(newAnswers);
			let nextQuestion = currentQuestion + 1;
			while (node.childs?.at(nextQuestion)?.entityTranslations?.at(0).custom === undefined && nextQuestion < node.childs?.length)
				nextQuestion++;
			setCurrentQuestion(nextQuestion);
		},
		[answers, currentQuestion, node]
	);

	if (node.childs === undefined || node.childs?.length === 0) {
		return <>Ten test nie ma zdefiniowanych żadnych zadań.</>;
	}

	if (currentQuestion === -1) {
		return (
			<>
				<motion.div
					initial='hidden'
					animate='visible'
					variants={containerOpacity}
					className='d-flex text-white flex-column align-items-center justify-content-center h-100 border border-2 border-primary rounded bg-background bg-gradient'>
					<motion.div variants={itemslideY} className='p-3 fs-1 '>
						{node.entityTranslations.at(0)?.mainTitle}
					</motion.div>
					<motion.div
						variants={itemslideY}
						className='fs-4 btn btn-background border border-2 border-primary rounded-pill py-3 px-5 fw-semibold text-white'
						onClick={() => setCurrentQuestion(0)}>
						Start
					</motion.div>
				</motion.div>
			</>
		);
	}

	if (node.childs.length === currentQuestion) {
		const testScore =
			answers.reduce((partial, item) => partial + (item === true), 0) / answers.reduce((partial, item) => partial + (item !== undefined), 0);
		return (
			<h1 className='d-flex h-100 justify-content-center align-items-center border border-2 border-primary rounded bg-background text-white'>
				Koniec testu, wynik: {(testScore * 100).toFixed(0)}%
			</h1>
		);
	}

	return (
		<>
			{
				<TestQuestion
					node={node.childs[currentQuestion]}
					answered={answered}
					key={currentQuestion}
					currentQuestionNumber={answers.reduce((partial, item) => partial + (item !== undefined), 0)}
					questionCount={node.childs?.reduce((partial, child) => partial + (child.entityTranslations?.at(0).custom !== undefined), 0)}
				/>
			}
		</>
	);
}

export function ProgressBar({ value = 0, max = 1 }) {
	return (
		<motion.div initial={{ opacity: 0, x: '-10%' }} animate={{ opacity: 1, x: '0%' }} className='d-flex align-items-center'>
			<div className='flex-fill rounded-pill' style={{ height: '25px' }}>
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: `${100 * ((value + 1) / max)}%` }}
					className='bg-success bg-gradient rounded-pill'
					style={{ height: '25px' }}
				/>
			</div>
			<span className='px-2 fs-2'>
				{value + 1}/{max}
			</span>
		</motion.div>
	);
}

export function TestQuestion({ node, moderator, answered, currentQuestionNumber, questionCount }) {
	const custom = node.entityTranslations[0].custom;

	const [answers, setAnswers] = useState(custom?.isError ? undefined : Array(custom.places.count).fill(undefined));
	const [Answered, setAnswered] = useState({ done: false, correct: false });

	const setAnswer = useCallback(
		(index, id) => {
			const oldIndex = answers.indexOf(id);
			const newAnswers = [...answers];
			if (oldIndex !== -1) {
				newAnswers[oldIndex] = answers[index];
			} else {
				newAnswers[oldIndex] = undefined;
			}
			newAnswers[index] = id;
			setAnswers(newAnswers);
		},
		[answers]
	);

	useEffect(() => {
		setAnswers(custom?.isError ? undefined : Array(custom.places.count).fill(undefined));
	}, [custom, setAnswers]);

	const prepareTask = useCallback(() => {
		if (answers === undefined) return [];
		var placeCounter = 0;
		const components = [];
		for (let i = 0; i < custom.tokens.length; i++) {
			const tok = custom.tokens[i];
			const isEmptyPlace = tok.at(0) === '#';

			if (isEmptyPlace) {
				components.push(
					<AnswerPlace
						key={i}
						id={answers[placeCounter]}
						index={placeCounter}
						setAnswer={setAnswer}
						answer={custom.allAnswers[answers[placeCounter]]}
						disabled={Answered.done}
					/>
				);
			} else {
				components.push(
					<div key={i} id={i}>
						{tok}
					</div>
				);
			}
			if (isEmptyPlace) placeCounter++;
		}
		return components;
	}, [Answered, answers, custom, setAnswer]);

	const prepareAnswer = useCallback(() => {
		if (answers === undefined) return [];
		var placeCounter = 0;
		const real = [];
		for (let i = 0; i < custom.tokens.length; i++) {
			const tok = custom.tokens[i];
			const isEmptyPlace = tok.at(0) === '#';

			if (isEmptyPlace) {
				real.push(
					<span key={placeCounter} className={`${answers[placeCounter] === custom.places[placeCounter] ? 'text-success' : 'text-pink'}`}>
						{custom.allAnswers[custom.places[placeCounter]]}
					</span>
				);
			} else {
				real.push(tok);
			}
			if (isEmptyPlace) placeCounter++;
		}
		return real;
	}, [custom, answers]);

	const checkAnswer = useCallback(() => {
		const correct = JSON.stringify(answers) === JSON.stringify(custom.places);
		if (Answered.done) {
			if (correct) {
				answered(true);
			} else {
				answered(false);
			}
		}
		setAnswered({ done: true, correct: correct });
	}, [Answered, answered, answers, custom]);

	if (custom === undefined) return <div className='m-2 rounded-4 p-3 bg-white text-dark'>Error</div>;
	if(custom.isError) return <></>
	//if (custom.isError) return <div className='m-2 rounded-4 p-3 bg-white text-dark'>Error: {custom.error.message}</div>;

	return (
		<>
			<div
				className={`d-flex align-items-stretch text-white border border-2 border-secondary rounded bg-background bg-gradient`}
				style={{ minHeight: '100%', wordBreak: 'break-word' }}>
				<div className='flex-fill d-flex flex-column justify-content-between p-lg-4 p-3'>
					<ProgressBar value={currentQuestionNumber} max={questionCount} />
					<div className='border-bottom border-2 p-2 border-white pb-1 '>
						<h2>{custom.description}</h2>
					</div>

					<div className='py-2 container-fluid'>
						<motion.div
							initial='hidden'
							animate='visible'
							variants={slideAnimationX}
							className='fs-3 d-flex flex-wrap align-items-center p-2 py-lg-3'>
							{prepareTask()}
						</motion.div>
						<div className='row justify-content-center'>
							<motion.div
								initial={'hidden'}
								animate={'visible'}
								variants={containerSlideY}
								className='d-flex flex-wrap bg-background rounded-5 p-lg-3 p-2'>
								{custom.allAnswers.map((item, index) => {
									return (
										<motion.div key={index} variants={itemslideY}>
											<AnswerItem id={index} disabled={answers?.includes(index) || Answered.done}>
												{item}
											</AnswerItem>
										</motion.div>
									);
								})}
							</motion.div>
						</div>
					</div>
					<motion.div
						animate={{ x: Answered.done ? '0%' : '-20%' }}
						className='fs-3 my-2'
						style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: !Answered.done ? 0 : Answered.correct ? 1 : 0 }}
							style={{ gridRowStart: 1, gridColumnStart: 1 }}
							className='border border-success bg-background align-self-start rounded p-2'>
							<div className='text-success'>Poprawna odpowiedź</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: !Answered.done ? 0 : Answered.correct ? 0 : 1 }}
							style={{ gridRowStart: 1, gridColumnStart: 1, minHeight: 0 }}
							className='border border-danger bg-background align-self-start rounded p-2'>
							{prepareAnswer()}
						</motion.div>
					</motion.div>
					<Button variant='success' onClick={checkAnswer}>
						{Answered.done ? 'Dalej' : 'Sprawdź'}
					</Button>
				</div>
			</div>
		</>
	);
}

function AnswerPlace({ id, index, answer, setAnswer, disabled }) {
	const ref = useRef(null);
	const hasContent = answer !== undefined;

	const [, drop] = useDrop({
		accept: 'answer',
		drop(item, monitor) {
			setAnswer(index, item.id);
		},
	});

	const [, drag] = useDrag({
		type: 'answer',
		item: () => {
			return {
				id: id,
			};
		},
		canDrag(monitor) {
			return hasContent && !disabled;
		},
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	});

	drag(drop(ref));

	return (
		<motion.div
			ref={ref}
			className={`border-3 border-primary p-2 rounded-2 mx-2 my-2
        d-flex justify-content-center  align-items-center border
        ${hasContent ? '' : ''}`}
			animate={{
				backgroundColor: hasContent ? 'rgb(10, 132, 136)' : '#323232',
				y: hasContent ? '0%' : '12.5%',
			}}
			style={{ minWidth: '80px', height: '40px' }}>
			<span className='px-1'>{answer}</span>
		</motion.div>
	);
}

function AnswerItem({ id, children, disabled }) {
	const [{ isDragging }, drag] = useDrag({
		type: 'answer',
		item: () => {
			return {
				id: id,
			};
		},
		canDrag(monitor) {
			return !disabled;
		},
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	});

	return (
		<motion.div
			ref={drag}
			animate={{
				backgroundColor: disabled || isDragging ? '#323232' : 'rgb(10, 132, 136)',
				color: disabled || isDragging ? '#000' : '#000',
				fontWeight: disabled || isDragging ? 400 : 500,
				scale: disabled || isDragging ? 0.9 : 1,
				y: disabled || isDragging ? '10%' : '0%',
			}}
			className={`text-white border border-0 rounded-2 py-1 px-2 m-1 py-lg-2 px-lg-3 m-lg-2
            `}>
			{/*${(disabled || isDragging) ? 'bg-dark text-black-50 border-dark ' : 'bg-primary bg-gradient border-primary'}*/}
			{children}
		</motion.div>
	);
}
