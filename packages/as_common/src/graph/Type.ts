export type ID = string;

export type Date = number;

export type Color = { h: number; s: number; v: number, a: number };

export type Vec2 = { x: number; y: number }

export const Schema = `
	scalar Date

	type Color {
		h: Float!
		s: Float!
		v: Float!
		a: Float
	}

	type Vec2 {
		x: Float!
		y: Float!
	}
`;

export const ColorQuery = '{ h, s, v, a }';

export const Vec2Query = '{ x, y }';
