import { buildSchema } from 'graphql';

import { SCHEMA } from 'as_common/graph';

// import Type from './type/Type';
// import Resource from './type/Resource';
// import TrackModifications from './type/TrackModifications';

// import { Schema as User } from './type/User';
// import { Schema as Info } from './type/Info';


// import { Schema as Role } from './type/Role';
// import Page from './type/Page';
// import { Schema as Theme } from './type/Theme';
// // import { Schema as Media } from './type/Media';
// import { Schema as Query } from './type/Query';
// import { Schema as Quotas } from './type/Quotas';
// import { Schema as Plugin } from './type/Plugin';
// import { Schema as Layout } from './type/Layout';

export default buildSchema(SCHEMA);
