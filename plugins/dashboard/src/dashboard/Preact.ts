import 'preact/compat';
import * as Preact from 'preact';
import * as PreactHooks from 'preact/hooks';

// eslint-disable-next-line
// @ts-ignore
global.__AS_PREACT_HOOKS = PreactHooks;

// eslint-disable-next-line
// @ts-ignore
global.__AS_PREACT = Preact;

// eslint-disable-next-line
// @ts-ignore
global.__AURISERVE = { h: Preact.h };
