export const lede = (text: string, sentences: number) => text.split(/(?<=\.)\s+(?=[A-Z])/).slice(0, sentences).join(' ');
