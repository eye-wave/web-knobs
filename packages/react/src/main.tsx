import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

declare const root: HTMLDivElement;

function App() {
	return (
		<>
			<h1>Welcome to React</h1>
			<p>
				Visit <a href="https://react.dev/learn">https://react.dev/learn</a> to read the
				documentation
			</p>
		</>
	);
}

createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>
);
