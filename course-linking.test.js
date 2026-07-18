const assert = require('assert');
const { findCourseByReference, getCourseIdByReference, getCourseTitleByReference } = require('./course-linking');

const courses = [
  { _id: 'CSE101', title: 'Introduction to Programming' },
  { _id: 'CSE102', title: 'Introduction to Programming' },
  { _id: 'MTH201', title: 'Calculus I' }
];

const byId = findCourseByReference('CSE101', courses);
assert.strictEqual(byId?._id, 'CSE101');
assert.strictEqual(getCourseIdByReference('Introduction to Programming', courses), 'CSE101');
assert.strictEqual(getCourseTitleByReference('CSE102', courses), 'Introduction to Programming');
assert.strictEqual(getCourseTitleByReference('MTH201', courses), 'Calculus I');
console.log('course-linking regression checks passed');
