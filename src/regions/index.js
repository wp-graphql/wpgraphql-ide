import { init as initApp } from './app/app';
import { init as initDocumentEditor } from './document-editor/document-editor';

/**
 * Initialize applicaiton regions.
 */
export function init() {
	initApp();
	initDocumentEditor();
}
