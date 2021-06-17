import * as Preact from 'preact';
// @ts-ignore
import { GraphQLProvider } from 'graphql-react';

import App from './App';
import { graphql } from './Graph';

Preact.render(Preact.h(GraphQLProvider, { graphql }, Preact.h(App, null)), document.getElementById('root')!);

export * as Components from './export/Components';
export * as Hooks from './export/Hooks';
