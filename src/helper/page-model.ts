export interface Page {
    name: string,
    index: number, 
    content: string,
    bookId: number
}

export function isPageArray(pages: any[]): pages is Page[] { 
    return pages.every(page => 
        typeof page.name === 'string' && 
        typeof page.index === 'number' && 
        typeof page.content === 'string' && 
        typeof page.bookId === 'number'
    );
};