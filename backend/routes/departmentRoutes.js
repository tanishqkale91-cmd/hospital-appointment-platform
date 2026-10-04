const router = require('express').Router();
const c = require('../controllers/departmentController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Public so the registration form can list departments
router.get('/', c.listDepartments);
router.get('/all', protect, authorize('admin'), c.listAllDepartments);
router.get('/:id', c.getDepartment);

router.post('/', protect, authorize('admin'), c.createDepartment);
router.put('/:id', protect, authorize('admin'), c.updateDepartment);
router.delete('/:id', protect, authorize('admin'), c.deactivateDepartment);

module.exports = router;
