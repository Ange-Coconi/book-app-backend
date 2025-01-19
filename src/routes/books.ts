import { Router, Request, Response } from 'express';
import isLoggedIn from '@/middleware/ensure-authentification';
import prisma from '@/db/index';

const router = Router();

// for dashboard
router.get('/books/dashboard', isLoggedIn, async (req: Request, res: Response) => { 
  const userId = req.session.userId;
  try { 
    const books = await prisma.$queryRaw` 
    SELECT "Book".*, COUNT("Page"."id") as "pageCount" 
    FROM "Book" 
    LEFT JOIN "Page" ON "Book"."id" = "Page"."bookId" 
    WHERE "Book"."userId" = ${userId}
    GROUP BY "Book"."id" 
    ORDER BY "pageCount" DESC LIMIT 6; `; 
    res.status(200).json(books); 
  } catch (error) { 
    console.error(error); 
    res.status(500).json({ message: 'Internal server error' }); 
  } 
});

// getting bibliothek for visualize page
router.get('/bibliothek', isLoggedIn, async (req: Request, res: Response) => { 
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

// fetch one book and its pages
router.get('/books/:id', isLoggedIn, async (req: Request, res: Response) => { 
  const bookId = Number(req.params.id)
  try { 
    const book = await prisma.book.findMany({ 
      where: { 
        id: bookId 
      }, 
      include: { 
        pages: true 
      }
    });
    res.status(200).json(book);
  } catch (error) { 
    console.error(error); 
    res.status(500).json({ message: 'Internal server error' }); 
  } 
});

// getting a folder and its sub-item
router.get('/folders/:id', isLoggedIn, async (req: Request, res: Response) => { 
  const userId = req.session.userId;
  const folderId = Number(req.params.id);
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

// create a folder
router.post('/folders', isLoggedIn, async (req: Request, res: Response): Promise<any> => { 
  const userId = req.session.userId;
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

// create a book
router.post('/books', isLoggedIn, async (req: Request, res: Response): Promise<any> => { 
  const userId = req.session.userId;
  const { title, folderId } = req.body;

  if (!userId || !title || !folderId) {
    return res.status(403).json({ message: 'information missing' });
  }

  try { 
    const book = await prisma.book.create({ 
      data: {
        title: title,
        folderId: folderId,
        userId: userId
      }
      });
    for (let i = 0; i < 5 ; i++) {
      const newPages = await prisma.page.create({
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

// delete a folder
router.post('/folders', isLoggedIn, async (req: Request, res: Response): Promise<any> => { 
  const userId = req.session.userId;
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



export default router;
