import { Router, Request, Response } from 'express';
import prisma from '../db/index';
import { isPageArray } from '../helper/page-model';

const router = Router();

// for dashboard (ok)
router.get('/books/dashboard', async (req: Request, res: Response) => { 
  const userId = req.session.userId;
  try { 
    const books = await prisma.$queryRaw` 
    SELECT "Book".*
    FROM "Book" 
    LEFT JOIN "Page" ON "Book"."id" = "Page"."bookId" 
    WHERE "Book"."userId" = ${userId}
    GROUP BY "Book"."id" 
    ORDER BY COUNT("Page"."id") DESC LIMIT 6; `; 
    res.status(200).json(books); 
  } catch (error) { 
    console.error(error); 
    res.status(500).json({ message: 'Internal server error' }); 
  } 
});

// getting bibliothek for visualize page (ok)
router.get('/bibliothek', async (req: Request, res: Response) => { 
  const userId = req.session.userId;
  try { 
    const bibliothek = await prisma.folder.findMany({ 
      where: { 
        userId: userId,
        root: true, 
      }, 
        include: { 
          subfolders: true, 
          books: true, 
        }, 
      });
    res.status(200).json(bibliothek);
  } catch (error) { 
    console.error(error); 
    res.status(500).json({ message: 'Internal server error' }); 
  } 
});

// fetch one book and its pages (ok)
router.get('/books/:id', async (req: Request, res: Response) => { 
  const bookId = parseInt(req.params.id)
  try { 
    const book = await prisma.book.findMany({ 
      where: { 
        id: bookId 
      }, 
      include: { 
        pages: { 
          orderBy: { 
            index: 'asc' 
          } 
        } 
      }
    });
    res.status(200).json(book);
  } catch (error) { 
    console.error(error); 
    res.status(500).json({ message: 'Internal server error' }); 
  } 
});

// getting a folder and its sub-item (ok)
router.get('/folders/:id', async (req: Request, res: Response) => { 
  const userId = req.session.userId;
  const folderId = parseInt(req.params.id);
  try { 
    const folder = await prisma.folder.findMany({ 
      where: { 
        id: folderId,
      }, 
        include: { 
          subfolders: true, 
          books: true, 
        }, 
      });
    res.status(200).json(folder);
  } catch (error) { 
    console.error(error); 
    res.status(500).json({ message: 'Internal server error' }); 
  } 
});

// create a folder (ok)
router.post('/folders', async (req: Request, res: Response): Promise<any> => { 
  const userId = req.session.userId;
  if (userId === 1) return res.status(401).json({ message: 'user is not login' })

  const { name, parentFolderId } = req.body;

  if (!userId || !name || !parentFolderId) {
    return res.status(403).json({ message: 'information missing' });
  }

  try { 
    const folder = await prisma.folder.create({ 
      data: {
        name: name,
        parentFolderId: parentFolderId,
        userId: userId
      }
      });

    res.status(201).json(folder);
  } catch (error) { 
    console.error(error); 
    res.status(500).json({ message: 'Internal server error' }); 
  } 
});

// create a book (ok)
router.post('/books', async (req: Request, res: Response): Promise<any> => { 
  const userId = req.session.userId;
  if (userId === 1) return res.status(401).json({ message: 'user is not login' })
  const { title, format, padding, folderId } = req.body;

  if (!userId || !title || !folderId || !padding) {
    return res.status(403).json({ message: 'information missing' });
  }

  try { 
    const book = await prisma.book.create({ 
      data: {
        title: title,
        format: format,
        padding: padding,
        folderId: folderId,
        userId: userId
      }
      });
    for (let i = 0; i < 5 ; i++) {
      await prisma.page.create({
        data: {
          bookId: book.id,
          index: i,
        }
      })
    }
    res.status(201).json(book);
  } catch (error) { 
    console.error(error); 
    res.status(500).json({ message: 'Internal server error' }); 
  } 
});

// create a book uploaded (ok)
router.post('/books/upload', async (req: Request, res: Response): Promise<any> => { 
  const userId = req.session.userId;
  if (userId === 1) return res.status(401).json({ message: 'user is not login' })
  const { dataUpload, format, padding, folderId } = req.body;

  if (!userId || !dataUpload || !folderId || !padding) {
    return res.status(403).json({ message: 'information missing' });
  }

  try { 
    const book = await prisma.book.create({ 
      data: {
        title: dataUpload[0],
        format: format,
        padding: padding,
        folderId: folderId,
        userId: userId
      }
      });
    for (let i = 1; i < dataUpload.length ; i++) {
      await prisma.page.create({
        data: {
          bookId: book.id,
          index: i - 1,
          content: dataUpload[i]
        }
      })
    };
    
    res.status(201).json(book);
  } catch (error) { 
    console.error(error); 
    res.status(500).json({ message: 'Internal server error' }); 
  } 
});

// delete a folder (ok)
router.delete('/folders/:id', async (req: Request, res: Response): Promise<any> => { 
  const userId = req.session.userId;
  if (userId === 1) return res.status(401).json({ message: 'user is not login' })
  const folderId = parseInt(req.params.id);

  try { 
    const booksInFolder = await prisma.book.findMany({ 
      where: { 
        folderId: folderId, 
      }, 
      select: { 
        id: true, 
      }, 
    }); 
    const bookIds = booksInFolder.map(book => book.id); 
    await prisma.page.deleteMany({ 
      where: { 
        bookId: { 
          in: bookIds, 
        }, 
      }, 
    });

    await prisma.book.deleteMany({ 
      where: {
        folderId: folderId
      }
    });

    await prisma.folder.deleteMany({ 
      where: {
        parentFolderId: folderId
      }
    });

    await prisma.folder.delete({ 
      where: {
        id: folderId
      }
      });

    res.status(204).json();
  } catch (error) { 
    console.error(error); 
    res.status(500).json({ message: 'Internal server error' }); 
  } 
});

// delete a book (ok)
router.delete('/books/:id', async (req: Request, res: Response): Promise<any> => { 
  const userId = req.session.userId;
  if (userId === 1) return res.status(401).json({ message: 'user is not login' })
  const bookId = parseInt(req.params.id);
  console.log(bookId)
  try { 
    await prisma.page.deleteMany({
      where: {
          bookId: bookId
      }
    });
    await prisma.book.delete({
      where: {
          id: bookId
      }
    });

    res.status(204).json();
  } catch (error) { 
    console.error(error); 
    res.status(500).json({ message: 'Internal server error' }); 
  } 
});

// update a book (ok)
router.put('/books/:id', async (req: Request, res: Response): Promise<any> => { 
  const userId = req.session.userId;
  if (userId === 1) return res.status(401).json({ message: 'user is not login' })
  const bookId = parseInt(req.params.id);
  const { pages } = req.body; 
  console.log(pages);
  console.log(Array.isArray(pages))
  
  if (!pages || !Array.isArray(pages) || !isPageArray(pages)) { 
    return res.status(400).json({ message: 'Invalid pages data' }); 
  } 
  
  try { 
    await Promise.all(pages.map(async (page) => { 
      return prisma.page.upsert({ 
        where: { 
          id: page.id,
          bookId: bookId, 
          index: page.index, 
        }, 
        update: { 
          content: page.content, 
        }, 
        create: { 
          index: page.index, 
          content: page.content, 
          bookId: bookId,
        }, 
      }); 
    }) 
  );
    res.status(204).json();
  } catch (error) { 
    console.error(error); 
    res.status(500).json({ message: 'Internal server error' }); 
  } 
});



export default router;
