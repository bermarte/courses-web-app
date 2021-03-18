'use strict'

const fs = require('fs');
const path = require('path');
const tv4 = require('tv4');

const config = require('../config');
const DATA_DIR = path.join(__dirname, '..', 'data', 'courses.json');
const COURSES_SCHEMA = require(path.join(__dirname, '..', 'data', 'courses-schema.js'));

const controllers = {
    hello: (req, res) => {
        res.json({ api: 'courses!' });
    },

    //GET all courses
    getAllCourses: (req, res, next) => {
        fs.readFile(DATA_DIR, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            res.send(JSON.parse(data));
        });
    },

    //GET course by ID 

    getCourseId: (req, res, next) => {
        fs.readFile(DATA_DIR, 'utf8', (err, data) => {
            const courses = JSON.parse(data);
            const course = courses.courses.find(c => c.id === parseInt(req.params.id));
            if (!course) res.status(404).send('The course with the given ID was not found.')
            res.send(course);
            if (err)
                next(err);
            return;
        });
    },

    // SAVE course 
    saveCourse: (req, res) => {
        fs.readFile(DATA_DIR, 'utf-8', (err, data) => {
            if (err) return res.status(500).send(err.message);
            const courses = JSON.parse(data);

            const newCourse = req.body;
            newCourse.id = courses.nextId;
            courses.nextId++;

            const isValid = tv4.validate(newCourse, COURSES_SCHEMA)
            console.log('tv4', isValid);

            if (!isValid) {
                const error = tv4.error;
                console.error(error);

                res.status(400).json({
                    error: {
                        message: error.message,
                        dataPath: error.dataPath
                    }
                });
                return;
            }

            courses.courses.push(newCourse);
            res.send(newCourse);

            const newData = JSON.stringify(courses, null, 2);

            fs.writeFile(DATA_DIR, newData, (err) => {
                if (err) return res.status(500).send(err.message);
                console.log('Data written to file');
                res.send();
            });

        });
    },

    //PUT edit course

    editCourse: (req, res, next) => {
        console.log('edit course');
        fs.readFile(DATA_DIR, 'utf-8', (err, data) => {
            if (err) return res.status(500).send(err.message);
            const courses = JSON.parse(data);
            const course = courses.courses.find(c => c.id === parseInt(req.params.id));

            if (!course) res.status(404).send('The course with the given ID was not found!');
            course.name = req.body.name;
            course.place = req.body.place;
            course.details = req.body.details;

            const isValid = tv4.validate(course, COURSES_SCHEMA)
            console.log(isValid);

            if (!isValid) {
                const error = tv4.error;
                console.error(error);

                res.status(400).json({
                    error: {
                        message: error.message,
                        dataPath: error.dataPath
                    }
                })
                return;
            }

            res.send(course);

            const updatedData = JSON.stringify(courses, null, 2);

            fs.writeFile(DATA_DIR, updatedData, (err) => {
                if (err) {
                    next(err);
                    return;
                }
                console.log('File is updated');
            });
        })
    },
    //GET list of courses

    listCourses: (req, res, next) => {
        console.log('get courses')
        fs.readFile(DATA_DIR, 'utf8', (err, data) => {
            console.log('list of courses');
            if (err)
                next(err);
            return;
        });
        res.send(JSON.parse(data));
    },

    //Delete Course 

    deleteCourse: (req, res, next) => {

        fs.readFile(DATA_DIR, "UTF-8", (err, data) => {
            if (err) {
                console.error("Error: ", err);
                return;
            }
            const parsedData = JSON.parse(data);
            console.log("read from file: ", parsedData);

            const course = parsedData.courses.find(function(c) {
                console.log(`c.id is: ${c.id}, req.params.id is: ${req.params.id}`);
                return c.id === parseInt(req.params.id);
            });

            if (!course) {
                console.log("incorrect id ");
                return res.status(404).send("The course with the given ID was not found!");
            }

            const index = parsedData.courses.indexOf(course);

            parsedData.courses.splice(index, 1);
            const toWrite = JSON.stringify(parsedData, null, " ");

            fs.writeFile(DATA_DIR, toWrite, "UTF-8", (err) => {
                if (err) {
                    console.log("changes not saved");
                    process.exit();
                }

                console.log("changes saved");
            });
            res.send(course);
        });
    },
};


module.exports = controllers;