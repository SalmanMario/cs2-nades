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

export function initials(name: string) {
    const words = name.trim().split(/\s+/).filter(Boolean);
    const letters = words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? "").slice(0, 2);
    return letters.toUpperCase();
}

export function pageTitle(title?: string, admin = false) {
    const site = admin ? "CS2 Nades Admin" : "CS2 Nades";
    return title ? `${title} | ${site}` : site;
}
