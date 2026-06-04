export function parseNumber(value: number) {
    return parseFloat(Number(value).toFixed(2))
}

export function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function firstToUpperCase(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
