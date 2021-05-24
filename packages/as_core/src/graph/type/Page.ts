export default `
	type Page implements Resource & TrackModifications {
		id: ID!
		user: ID
		created: Date!

		lastModified: Int
		lastModifier: User

		name: String!
		description: String!
		layout: Layout
	}
`;
