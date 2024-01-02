import { useState } from '@wordpress/element';
import { Drawer as VaulDrawer } from 'vaul';

export function EditorDrawer({ shouldScaleBackground = false, children }) {
	const buttonLabel = 'GraphQL IDE';

    return (
		<div className="EditorDrawerRoot">
			<VaulDrawer.Root
				dismissible={false}
				closeThreshold={1}
				shouldScaleBackground={shouldScaleBackground}
			>
				<VaulDrawer.Trigger className="EditorDrawerButton">
					<span className="ab-icon" aria-hidden="true"></span>{buttonLabel}
				</VaulDrawer.Trigger>
				<VaulDrawer.Portal>
					<VaulDrawer.Content>
						{children}
					</VaulDrawer.Content>
					<VaulDrawer.Overlay />
				</VaulDrawer.Portal>
			</VaulDrawer.Root>
		</div>
    );
};
