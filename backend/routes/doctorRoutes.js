const router = require('express').Router();
const c = require('../controllers/doctorController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.get('/', c.listDoctors);
router.post('/', authorize('admin'), c.createDoctor);

// "me" routes must be declared before "/:id"
router.get('/me/profile', authorize('doctor'), c.getMyProfile);
router.put('/me/profile', authorize('doctor'), c.updateMyProfile);
router.get('/me/appointments', authorize('doctor'), c.getMyAppointments);

router.get('/:id', c.getDoctor);
router.put('/:id', authorize('admin'), c.updateDoctor);
router.delete('/:id', authorize('admin'), c.deactivateDoctor);

module.exports = router;
