// import 'preact/compat';
import * as Preact from 'preact';
import * as PreactHooks from 'preact/hooks';
import * as PreactCompat from 'preact/compat';

// eslint-disable-next-line
// @ts-ignore
global.__AS_PREACT_HOOKS = PreactHooks;

// eslint-disable-next-line
// @ts-ignore
global.__AS_PREACT = { ...Preact, ...PreactCompat };

// eslint-disable-next-line
// @ts-ignore
global.__AURISERVE = { h: Preact.h };
