import { writable } from 'svelte/store';
import { Role } from './Cell';

export const visualizeAlgorithmStore = writable('');

export const lockStore = writable(false);

export const debugStore = writable(false);

export const gridMouseDownStore = writable(false);

export const startCellStore = writable([0, 0]);

export const desCellStore = writable([0, 0]);

export const selectedCellRoleStore = writable(Role.Block);