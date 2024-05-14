import {useCopyToClipboard} from "../hooks/useCopyToClipboard";
import {CopyIcon} from "@graphiql/react";
import { useSelect } from "@wordpress/data";

export const copyQueryButton = () => {
	const [ copyToClipboard ] = useCopyToClipboard();
	const query = useSelect( ( select ) => select( 'wpgraphql-ide/app' ).getQuery() );

	return {
		label: 'Copy query (Shift-Ctrl-C)',
		children: (
			<CopyIcon className="graphiql-toolbar-icon" aria-hidden="true" />
		),
		onClick: () => {
			copyToClipboard(query)
		}
	}
}
