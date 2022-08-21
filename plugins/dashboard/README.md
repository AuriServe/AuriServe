# Dashboard

Exposes a frontend dashboard to manage Auriserve. Has built-in functionality to manage users and routes, and plugins can add their own functionality to the Dashboard as well. The dashboard is available, by default, at the `/dashboard` path. A valid user account with the `view_dashboard` permission must be used to access the dashboard, and more granular control can be managed using other permissions.

## Server API

Additional GraphQL endpoints can be added to the dashboard schema by using the `extendGQLSchema` method and `extend`ing the `Query` or `Mutation` types. Resolvers can be added by augmenting the `gqlResolver` object, and `gqlContext` is the context object passed to the resolvers.

## Dashboard API

Plugins exposing a `dashboard` entry in their manifest will be loaded when the dashboard is accessed. The dashboard uses Preact to render its interface. It exposes a number of API methods for augmenting the dashboard.

The dashboard also exposes several Preact components and hooks, which can be seen in the Type definitions.

### registerPage / unregisterPage

Registers and unregisters a new page in the dashboard.

### registerShortcut / unregisterShortcut

Registers and unregisters a shortcut to the shortcuts registry. Shortcuts are actions that are presented in many different contexts, including the dashboard sidebar and the shortcut palette.

### registerSettings / unregisterSettings

Registers and unregisters a settings page in the dashboard.
