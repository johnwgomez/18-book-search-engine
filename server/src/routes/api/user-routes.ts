import { Router, Request, Response, NextFunction } from 'express';
import {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} from '../../controllers/user-controller.js';
import { authMiddleware } from '../../services/auth.js';

const router = Router();

// Public routes
router.post('/', createUser);
router.post('/login', login);

const ensureAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { user } = await authMiddleware({ req: req as Request });
  if (!user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  (req as any).user = user.data;
  next();
};

router.get('/me', ensureAuth, getSingleUser);
router.put('/books', ensureAuth, saveBook);
router.delete('/books/:bookId', ensureAuth, deleteBook);

export default router;
