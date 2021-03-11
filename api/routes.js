const controllers = require('./controllers.js');
const express = require('express');

const router = express.Router();

router.get('/', controllers.hello);


// write your routes
router.get('/courses', controllers.getAllCourses);
router.get('/courses/:id', controllers.getCourseId);
router.post('/courses', controllers.saveCourse);
router.put('/courses/:id', controllers.editCourse);
router.get('/courses', controllers.listCourses);
router.delete("/courses/:id", controllers.deleteCourse);

module.exports = router;