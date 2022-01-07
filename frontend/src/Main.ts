import { h, render } from 'preact';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { GraphQLProvider } from 'graphql-react';

import App from './App';
import { graphql } from './Graph';

render(h(GraphQLProvider, { graphql }, h(App, null)), document.getElementById('root')!);

export * as Components from './export/Components';
export * as Hooks from './export/Hooks';
export * as Graph from './Graph';
