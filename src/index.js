import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import reportWebVitals from './lib/reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MultiBackend, DndProvider } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch';
import { MotionConfig } from 'framer-motion';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // na czas dewelopmentu przynajmniej
      refetchOnMount: true,
      refetchInterval: 0,
      refetchOnWindowFocus: false
    }
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MotionConfig reducedMotion='user'>
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </DndProvider>
  </MotionConfig>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
