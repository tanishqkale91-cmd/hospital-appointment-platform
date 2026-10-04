const router = require('express').Router();
const c = require('../controllers/waitingListController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.post('/', authorize('patient'), c.joinWaitingList);
router.get('/my', authorize('patient'), c.getMyWaitingList);
router.get('/', authorize('doctor', 'admin'), c.getWaitingList);
router.delete('/:id', authorize('patient', 'admin'), c.cancelWaitingEntry);

module.exports = router;
