export const QUERY_GET_ALL_MEDIA_OF_TYPE = `
	query GetAllMediaOfType($type: String!) {
		media {
			media(type: $type) {
				id,
				name,
				description,
				type,
				canonicalVariant { id, path, size, type, prop, width, height },
				variants { id, path, size, type, prop, width, height }
			}
		}
	}
`;

export const QUERY_GET_MEDIA_BY_ID = `
	query GetAllMediaOfType($id: Int!) {
		media {
			mediaById(id: $id) {
				id,
				name,
				description,
				type,
				canonicalVariant { id, path, size, type, prop, width, height },
				variants { id, path, size, type, prop, width, height }
			}
		}
	}
`;
