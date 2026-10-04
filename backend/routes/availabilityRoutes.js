const router = require('express').Router();
const c = require('../controllers/availabilityController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

// Doctor management of own availability
router.post('/', authorize('doctor'), c.createAvailability);
router.get('/me', authorize('doctor'), c.getMyAvailability);
router.put('/:id', authorize('doctor'), c.updateAvailability);
router.delete('/:id', authorize('doctor'), c.removeAvailability);

// Viewing a doctor's availability / slots (any authenticated user)
router.get('/doctor/:doctorId', c.getDoctorAvailability);
router.get('/doctor/:doctorId/slots', c.getDoctorSlots);

module.exports = router;
