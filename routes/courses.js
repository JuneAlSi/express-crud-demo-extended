const express = require('express')
const router = express.Router();

const courses = [{
    id: 1,
    name: 'React'
  },
  {
    id: 2,
    name: 'Angular'
  },
  {
    id: 3,
    name: 'Vue'
  }
];

router.get('/', (req, res) => {
  res.send(courses);
});

router.get('/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send(`Not found. 404`);
  res.send(course);
});

// app.get('/api/posts/:year/:month', (req, res) => {
//   res.send(req.params)
// })

router.get('/:year/:month', (req, res) => {
  res.send(req.query);
});

//------------------------------------------------------
router.post('/', (req, res) => {
  // input validation with Joi
  // const schema = {
  //   name: Joi.string()
  //     .min(3)
  //     .required()
  // };
  // const result = Joi.validate(req.body, schema);
  // if (result.error) {
  //   res.status(400).send(result.error.details[0].message);
  //   return;
  // }

  const {
    error
  } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // manual input validation (old way)
  // if (!req.body.name || req.body.name.length < 3) {
  // 400 Bad Request
  //   res.status(400).send('Name is required and sholud be minimum 3 characters');
  //   return;
  // }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };

  courses.push(course);
  res.send(course);
});

//------------------------------------------------------------------------
router.put('/:id', (req, res) => {
  // Look up the course
  // If not existing, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send('The course with the given ID was not found.');

  // Validate
  // If invalid, return 400 - Bad Request
  const result = validateCourse(req.body);
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  //const result = Joi.validate(req.body, schema);
  const {
    error
  } = validateCourse(req.body); // get result.error
  if (error) return res.status(400).send(result.error.details[0].message);

  // Update course
  course.name = req.body.name;
  // Return the updated course
  res.send(course);
});

//-----------------------------------------------------------------------
router.delete('/:id', (req, res) => {
  // Look up the course
  // Not existing, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send('The course with the given ID was not found.');

  // Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // Return the same course
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(course, schema);
}

module.exports = router;
