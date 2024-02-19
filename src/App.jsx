import { useState } from '@wordpress/element';
import { EditorDrawer } from './components/EditorDrawer';
import { Editor } from './components/Editor';

export function App() {
	const [ drawerOpen, setDrawerOpen ] = useState( false );

	return (
		<div className="AppRoot">
			<EditorDrawer open={ drawerOpen } setDrawerOpen={ setDrawerOpen }>
				<Editor setDrawerOpen={ setDrawerOpen } />
			</EditorDrawer>
		</div>
	);
}
