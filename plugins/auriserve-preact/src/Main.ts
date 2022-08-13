export * from 'preact';

import 'preact/compat';

export type { CreateHandle, EffectCallback, Inputs, MutableRef, Reducer, Ref, StateUpdater } from 'preact/hooks';

export { useCallback, useContext, useDebugValue, useEffect, useErrorBoundary,
	useImperativeHandle, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'preact/hooks';

export { renderToString } from 'preact-render-to-string';

import { h } from 'preact';

// eslint-disable-next-line
// @ts-ignore
globalThis.__AURISERVE = { h };
