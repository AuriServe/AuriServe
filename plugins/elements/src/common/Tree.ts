export interface Node {
	element: string;
	props?: Record<string, any>;
	children?: Node[];
}

export default Node;
