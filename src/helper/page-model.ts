export interface Page {
    id: number,
    index: number, 
    content: string,
    bookId: number
}

export function isPageArray(pages: any[]): pages is Page[] { 
    console.log(pages)
    return pages.every(page => 
        typeof page.id === 'number' &&
        typeof page.index === 'number' && 
        typeof page.content === 'string' && 
        typeof page.bookId === 'number'
    );
};