import { Command } from '@streamdota/shared-types';
import { createReducer } from './util/Reducer';
import { schema } from 'normalizr';
import { ActionDispatcher, CALL_API } from '../middleware/NetworkMiddlewareTypes';
import NetworkError from '../middleware/NetworkError';
import {
	LOAD_COMMANDS_REQUEST,
	LOAD_COMMANDS_SUCCESS,
	LOAD_COMMANDS_FAILURE,
	CREATE_COMMAND_REQUEST,
	CREATE_COMMAND_SUCCESS,
	CREATE_COMMAND_FAILURE,
	UPDATE_COMMAND_REQUEST,
	UPDATE_COMMAND_FAILURE,
	UPDATE_COMMAND_SUCCESS,
	DELETE_COMMAND_REQUEST,
	DELETE_COMMAND_FAILURE,
	DELETE_COMMAND_SUCCESS,
} from './Actions';
import { commandEntitiesSelector } from '../selector/BotCommands';
import pick from 'lodash/pick';

export interface BotCommandState {
	[x: number]: Command;
}

interface DeleteCommandAction {
	options: {
		urlParams: {
			commandId: number;
		};
	};
	type: typeof DELETE_COMMAND_SUCCESS;
}

export const command = new schema.Entity(
	'botCommands',
	{},
	{
		processStrategy: (command: Command) => ({
			...command,
			noResponse: Boolean(command.noResponse),
			deleteAble: Boolean(command.deleteAble),
		}),
	}
);

const { addReducer, combinedReducer } = createReducer<BotCommandState>();

addReducer<DeleteCommandAction>(DELETE_COMMAND_SUCCESS, (state, { options: { urlParams: { commandId } } }) => {
	const newState = { ...state };
	delete newState[commandId];
	return newState;
});

export const botCommandReducer = combinedReducer;

export function loadUserCommands(): ActionDispatcher<Promise<void>> {
	return async (dispatch) => {
		await dispatch<Promise<Response | NetworkError>>({
			[CALL_API]: {
				endpoint: `${process.env.API_URL}/command/list`,
				schema: [ command ],
				types: {
					requestType: LOAD_COMMANDS_REQUEST,
					successType: LOAD_COMMANDS_SUCCESS,
					failureType: LOAD_COMMANDS_FAILURE,
				},
			},
		});
	};
}

export function createCommand(
	data: Pick<Command, 'active' | 'type' | 'message' | 'command'>
): ActionDispatcher<Promise<void>> {
	return async (dispatch) => {
		await dispatch<Promise<Response | NetworkError>>({
			[CALL_API]: {
				endpoint: `${process.env.API_URL}/command/create`,
				method: 'post',
				types: {
					requestType: CREATE_COMMAND_REQUEST,
					successType: CREATE_COMMAND_SUCCESS,
					failureType: CREATE_COMMAND_FAILURE,
				},
				options: {
					data,
				},
			},
		});
		await dispatch(loadUserCommands());
	};
}

export function updateCommand(
	commandId: number,
	data: Partial<Pick<Command, 'active' | 'message' | 'command'>>
): ActionDispatcher<Promise<void>> {
	return async (dispatch, getState) => {
		const userCommand = pick<Command>(commandEntitiesSelector(getState())[commandId], [
			'active',
			'command',
			'message',
		]);
		await dispatch<Promise<Response | NetworkError>>({
			[CALL_API]: {
				endpoint: `${process.env.API_URL}/command/:commandId`,
				method: 'patch',
				types: {
					requestType: UPDATE_COMMAND_REQUEST,
					successType: UPDATE_COMMAND_SUCCESS,
					failureType: UPDATE_COMMAND_FAILURE,
				},
				options: {
					urlParams: {
						commandId,
					},
					data: {
						...userCommand,
						...data,
					},
				},
			},
		});
		await dispatch(loadUserCommands());
	};
}

export function deleteCommand(commandId: number): ActionDispatcher<Promise<void>> {
	return async (dispatch) => {
		await dispatch<Promise<Response | NetworkError>>({
			[CALL_API]: {
				endpoint: `${process.env.API_URL}/command/:commandId`,
				method: 'del',
				types: {
					requestType: DELETE_COMMAND_REQUEST,
					successType: DELETE_COMMAND_SUCCESS,
					failureType: DELETE_COMMAND_FAILURE,
				},
				options: {
					urlParams: {
						commandId,
					},
				},
			},
		});
		await dispatch(loadUserCommands());
	};
}