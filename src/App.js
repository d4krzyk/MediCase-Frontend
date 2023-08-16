import './App.scss';
import 'react-quill/dist/quill.snow.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Home } from './components/home/Home';
import { Navbar } from './components/Navbar';
import { Login } from './components/user/Login';
import { Register } from './components/user/Register';
import { UserRoutes } from './components/user/UserRoutes';
import { useAppStore } from './lib/store';
import { useEffect, useCallback } from 'react';
import { LoggedOutInfo } from './components/user/LoggedOutInfo';
import { Welcome } from './components/home/Welcome';
import { getLanguages } from './network/lib/language';
import { getTypes } from './network/lib/type';
import { useNavigate } from 'react-router-dom';
import { ErrorPage } from './components/ErrorPage';
import { AnimatePresence } from 'framer-motion';

export function App() {
	const user = useAppStore(store => store.user);
	const { updateLanguages, updateModeratorLanguages, updateNodeTypes, setSidebarState, updateConfig, updateModeratorConfig } = useAppStore();
	const config = useAppStore(store => store.config);
	const moderatorConfig = useAppStore(store => store.moderatorConfig);
	const navigate = useNavigate();

	const cacheLangaugagesAndTypes = useCallback(() => {
		getLanguages()
			.then(languages => {
				updateLanguages(languages);
				if (config == null) {
					if (languages.length >= 1) {
						updateConfig({
							native: languages[0].langId,
							nativeCode: languages[0].langValue,
							foreign: languages[languages.length >= 1 ? 1 : 0].langId,
							foreignCode: languages[languages.length >= 1 ? 1 : 0].langValue,
						});
					}
				}
			})
			.catch(() => {
				//navigate('/error');
			});

		getLanguages(true)
			.then(languages => {
				updateModeratorLanguages(languages);
				if (moderatorConfig == null) {
					if (languages.length >= 1) {
						updateModeratorConfig({
							native: languages[0].langId,
							nativeCode: languages[0].langValue,
							foreign: languages[languages.length >= 1 ? 1 : 0].langId,
							foreignCode: languages[languages.length >= 1 ? 1 : 0].langValue,
						});
					}
				}
			})
			.catch(() => {
				//navigate('/error');
			});
		getTypes()
			.then(types => updateNodeTypes(types))
			.catch(() => {
				//navigate('/error');
			});

		setSidebarState(sidebar => ({ layers: [] }));
	}, [config, moderatorConfig, navigate, setSidebarState, updateConfig, updateLanguages, updateModeratorConfig, updateModeratorLanguages, updateNodeTypes]);

	useEffect(() => {
		cacheLangaugagesAndTypes()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className='d-flex flex-column' style={{ height: '100svh', overflowX: 'hidden' }}>
				<AnimatePresence mode='wait'>
					<Routes>
						<Route exact index path='/' element={<Welcome />} />
						<Route exact path='/error' element={<ErrorPage />} />
						<Route
							exact
							path='/site/*'
							element={
								<>
									<Navbar className='sticky-top' />
									<div className='flex-fill'>
										<Routes>
											<Route path='' element={<Home />} />
											<Route path='login' element={user == null ? <Login /> : <Navigate to='/site/user' />} />
											<Route path='register' element={user == null ? <Register /> : <Navigate to='/site/user' />} />
											<Route path='logoutinfo' element={<LoggedOutInfo />} />
											<Route path='user/*' element={user != null ? <UserRoutes /> : <Navigate to='/site/logoutinfo' />} />
										</Routes>
									</div>
								</>
							}
						/>
					</Routes>
				</AnimatePresence>
			</div>
		</>
	);
}
