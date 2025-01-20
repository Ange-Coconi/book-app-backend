export interface Page {
    id: number,
    name: string,
    index: number, 
    content: string,
    bookId: number
}

export function isPageArray(pages: any[]): pages is Page[] { 
    return pages.every(page => 
        typeof page.id === 'number' &&
        typeof page.name === 'string' && 
        typeof page.index === 'number' && 
        typeof page.content === 'string' && 
        typeof page.bookId === 'number'
    );
};