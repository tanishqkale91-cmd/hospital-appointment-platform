const router = require('express').Router();
const c = require('../controllers/patientController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

// Patient self-service
router.get('/profile', authorize('patient'), c.getProfile);
router.put('/profile', authorize('patient'), c.updateProfile);
router.get('/appointments', authorize('patient'), c.getAppointments);
router.get('/history', authorize('patient'), c.getHistory);

// Admin management
router.get('/', authorize('admin'), c.listPatients);
router.get('/:id', authorize('admin'), c.getPatient);

module.exports = router;
