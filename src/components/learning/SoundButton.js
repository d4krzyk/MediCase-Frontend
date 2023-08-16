import { BiVolumeFull } from 'react-icons/bi';
import { baseServerUrl } from '../../network/axiosClient';
import { useState } from 'react';

export function SoundButton({ filePath, className, size = 30, moderator }) {
	const [isClicked, setClicked] = useState(false);
	const [isPlaying, setPlaying] = useState(false);

	const styleShadow = {
		boxShadow: isClicked ? '0px 0px 6px 6px #84f4f6' : '0px 0px 0px 0px #84f4f6',
		transition: 'all 0.16s ease-in-out',
	};

	async function handlePlayAudio(audioElement) {
		if (isPlaying) {
			setPlaying(false);

			if (audioElement) {
				audioElement.pause();
				audioElement.currentTime = 0;
				setClicked(false);
			}
		} else {
			try {
				await audioElement.play();
				setPlaying(true);
			} catch (e) {
				
			}
		}
	}

	function handlePlay() {
		setClicked(true);
	}
	function handleEnd() {
		setClicked(false);
	}

	return (
		<>
			{filePath !== undefined && (
				<audio
					onPlay={handlePlay}
					onEnded={handleEnd}
					id={`audio_${filePath}`}
					preload='metadata'
					src={`${baseServerUrl}/${
						moderator ? 'Moderator' : 'Main'
					}/EntityTranslationFiles/getEntityTranslationFile?fileIdentifier=${filePath}`}
				/>
			)}
			<button
				style={styleShadow}
				onClick={() => {
					const audioElement = document.getElementById(`audio_${filePath}`);
					handlePlayAudio(audioElement);
				}}
				className={`btn rounded-circle ${className}`}
				disabled={filePath === undefined}>
				<BiVolumeFull className={``} size={size} />
			</button>
		</>
	);
}
