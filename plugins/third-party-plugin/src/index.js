/* global WPGRAPHQL_IDE_DATA */
import { select, dispatch, useSelect, useDispatch } from '@wordpress/data';
import { MergeIcon } from '@graphiql/react';
import styles from './components/ToggleAuthenticationButton/ToggleAuthenticationButton.module.css';
import clsx from 'clsx';
import { PrettifyIcon } from '@graphiql/react';
import React from 'react';
import { useCopyToClipboard } from '../../../src/hooks/useCopyToClipboard';
import LZString from 'lz-string';
import { Icon, external } from '@wordpress/icons';
import { CopyIcon } from '@graphiql/react';

window.addEventListener( 'WPGraphQLIDEReady', () => {} );
