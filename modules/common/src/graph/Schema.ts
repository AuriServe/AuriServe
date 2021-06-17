import { Schema as Root } from './Root';
import { Schema as Info } from './Info';
import { Schema as Layout } from './Layout';
import { Schema as Media } from './Media';
import { Schema as Page } from './Page';
import { Schema as Include } from './Include';
import { Schema as Plugin } from './Plugin';
import { Schema as Quotas } from './Quotas';
import { Schema as Role } from './Role';
import { Schema as Theme } from './Theme';
import { Schema as User } from './User';

import { Schema as Basic } from './Basic';
import { Schema as Resource } from './Resource';
import { Schema as TrackModifications } from './TrackModifications';

export { Schema as Root } from './Root';
export { Schema as Info } from './Info';
export { Schema as Layout } from './Layout';
export { Schema as Media } from './Media';
export { Schema as Page } from './Page';
export { Schema as Include } from './Include';
export { Schema as Plugin } from './Plugin';
export { Schema as Quotas } from './Quotas';
export { Schema as Role } from './Role';
export { Schema as Theme } from './Theme';
export { Schema as User } from './User';

export { Schema as Basic } from './Basic';
export { Schema as Resource } from './Resource';
export { Schema as TrackModifications } from './TrackModifications';

export const SCHEMA = [ Basic, Resource, TrackModifications,
	Info, Quotas, Layout, Theme, Plugin, User, Role, Media, Page, Include, Root ].join('\n');
