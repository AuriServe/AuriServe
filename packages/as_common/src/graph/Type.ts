export type ID = string;

export type Date = number;

export type Color = { h: number; s: number; v: number };

export type Vec2 = { x: number; y: number }

export const Schema = `
	scalar Date

	type Color {
		h: Float!
		s: Float!
		v: Float!
	}

	type Vec2 {
		x: Float!
		y: Float!
	}
`;

export const ColorQuery = '{ h, s, v }';

export const Vec2Query = '{ x, y }';
