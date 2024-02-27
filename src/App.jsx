import { useState, useEffect } from '@wordpress/element';
import { doAction } from '@wordpress/hooks';

import { EditorDrawer } from './components/EditorDrawer';
import { Editor } from './components/Editor';

/**
 * The main application component.
 *
 * @returns {JSX.Element} The application component.
 */
export function App() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        /**
         * Perform actions on component mount.
         *
         * Triggers a custom action 'wpgraphqlide_rendered' when the App component mounts,
         * allowing plugins or themes to hook into this event. The action passes
         * the current state of `drawerOpen` to any listeners, providing context
         * about the application's UI state.
         */
        doAction('wpgraphqlide_rendered', drawerOpen);

        /**
         * Cleanup action on component unmount.
         *
         * Returns a cleanup function that triggers the 'wpgraphqlide_destroyed' action,
         * signaling that the App component is about to unmount. This allows for
         * any necessary cleanup or teardown operations in response to the App
         * component's lifecycle.
         */
        return () => doAction('wpgraphqlide_destroyed');
    }, [drawerOpen]);

    return (
        <div className="AppRoot">
            <EditorDrawer open={ drawerOpen } setDrawerOpen={ setDrawerOpen }>
                <Editor setDrawerOpen={setDrawerOpen} />
            </EditorDrawer>
        </div>
    );
}
