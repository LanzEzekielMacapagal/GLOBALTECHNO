const mongoose = require('mongoose');

(async () => {
  await mongoose.connect('mongodb://GlobalTechnoLMS:qwerty12345@ac-yppcca4-shard-00-00.n40fbrp.mongodb.net:27017,ac-yppcca4-shard-00-01.n40fbrp.mongodb.net:27017,ac-yppcca4-shard-00-02.n40fbrp.mongodb.net:27017/?ssl=true&replicaSet=atlas-lwiuiu-shard-0&authSource=admin&appName=LMS');

  const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['admin', 'teacher', 'user'] },
    enrolledCourses: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    isActive: { type: Boolean, default: true },
    dateRegistered: { type: Date, default: Date.now }
  });

  const User = mongoose.model('User', userSchema, 'users');

  const username = 'teacherone';
  const email = 'teacherone@example.com';
  const password = 'teacher123';

  const existing = await User.findOne({ username }).lean();
  if (existing) {
    console.log(JSON.stringify({ status: 'exists', username, role: existing.role, id: existing._id.toString() }));
    await mongoose.disconnect();
    return;
  }

  const created = await User.create({
    fullName: 'Teacher One',
    email,
    username,
    password,
    role: 'teacher',
    enrolledCourses: []
  });

  console.log(JSON.stringify({ status: 'created', username, role: created.role, id: created._id.toString(), email }));
  await mongoose.disconnect();
})();
