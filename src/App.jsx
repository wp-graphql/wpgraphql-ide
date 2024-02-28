import { useEffect } from '@wordpress/element';
import { doAction } from '@wordpress/hooks';
import {useDispatch, useSelect} from "@wordpress/data";
import { EditorDrawer } from './components/EditorDrawer';
import { Editor } from './components/Editor';
import { parse, print } from 'graphql'
const { screenId } = window.WPGRAPHQL_IDE_DATA;

const url = new URL(window.location.href);
const params = url.searchParams;

const setInitialState = () => {

	const {
		setDrawerOpen,
		setQuery,
		setShouldRenderStandalone,
		setInitialStateLoaded
	} = useDispatch('wpgraphql-ide');

	console.log( {
		WPGRAPHQL_IDE_DATA_YO: window?.WPGRAPHQL_IDE_DATA ?? null
	})

	if ( 'graphql_page_graphql-ide' === screenId ) {
		console.log( {
			setShouldRenderStandalone: true,
		})
		setShouldRenderStandalone(true)
	}

	if ( params.has( 'wpgql_query' ) ) {

		let queryString = params.get('wpgql_query');
		let parsedQuery;
		let printedQuery = null;

		// convert the query from a string to an AST
		// console errors if there are any
		try {
			parsedQuery = parse(queryString);
		} catch(error) {
			console.error(`Error parsing the query "${queryString}"`, error.message);
			parsedQuery = null;
		}

		// Convert the AST back to a formatted printed document
		// console errors if there are any
		if ( null !== parsedQuery) {
			try {
				printedQuery = print(parsedQuery);
			} catch (error) {
				console.error(`Error printing the query "${queryString}"`, error.message);
				printedQuery = null;
			}
		}

		if ( null !== printedQuery ) {
			setDrawerOpen(true);
			setQuery(printedQuery);
			params.delete('wpgql_query');
			history.pushState({}, '', url.toString());
		}
	}

	setInitialStateLoaded();

}

/**
 * The main application component.
 *
 * @returns {JSX.Element} The application component.
 */
export function App() {

	setInitialState();

    useEffect(() => {

        /**
         * Perform actions on component mount.
         *
         * Triggers a custom action 'wpgraphqlide_rendered' when the App component mounts,
         * allowing plugins or themes to hook into this event. The action passes
         * the current state of `drawerOpen` to any listeners, providing context
         * about the application's UI state.
         */
        doAction('wpgraphqlide_rendered' );

        /**
         * Cleanup action on component unmount.
         *
         * Returns a cleanup function that triggers the 'wpgraphqlide_destroyed' action,
         * signaling that the App component is about to unmount. This allows for
         * any necessary cleanup or teardown operations in response to the App
         * component's lifecycle.
         */
        return () => doAction('wpgraphqlide_destroyed' );
    }, []);

	return <RenderApp />
}

export function RenderApp() {

	const isInitialStateLoaded = useSelect( (select) => {
		return select( 'wpgraphql-ide' ).isInitialStateLoaded();
	});

	const shouldRenderStandalone = useSelect( (select) => {
		return select('wpgraphql-ide' ).shouldRenderStandalone();
	})

	if ( ! isInitialStateLoaded ) {
		return null;
	}

	if ( shouldRenderStandalone ) {
		return (
			<div className="AppRoot">
				<Editor />
			</div>
		)
	}

	return (
		<div className="AppRoot">
			<EditorDrawer  >
				<Editor />
			</EditorDrawer>
		</div>
	);
}
