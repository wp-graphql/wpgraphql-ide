import { EditorDrawer } from './components/EditorDrawer';
import { Editor } from './components/Editor';

export function App() {
	return (
		<div className="AppRoot">
			<EditorDrawer>
				<Editor />
			</EditorDrawer>
		</div>
	);
}
