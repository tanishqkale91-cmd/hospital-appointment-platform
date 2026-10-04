const router = require('express').Router();
const c = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect, authorize('admin'));

router.get('/stats', c.getStats);
router.get('/', c.listUsers);
router.get('/:id', c.getUser);
router.put('/:id', c.updateUser);
router.delete('/:id', c.deactivateUser);

module.exports = router;
