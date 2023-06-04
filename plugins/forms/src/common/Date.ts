export function formatDate(date: number) {
	return new Date(date).toLocaleDateString('en-US',
		{ month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(time: number) {
	return new Date(time).toLocaleTimeString('en-US',
		{ hour12: true, hour: 'numeric', minute: 'numeric' });
}
