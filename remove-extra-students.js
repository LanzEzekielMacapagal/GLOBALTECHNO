const mongoose = require('mongoose');

(async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://GlobalTechnoLMS:qwerty12345@ac-yppcca4-shard-00-00.n40fbrp.mongodb.net:27017,ac-yppcca4-shard-00-01.n40fbrp.mongodb.net:27017,ac-yppcca4-shard-00-02.n40fbrp.mongodb.net:27017/?ssl=true&replicaSet=atlas-lwiuiu-shard-0&authSource=admin&appName=LMS';
    await mongoose.connect(uri);

    const userSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.model('User', userSchema, 'users');

    const result = await User.deleteMany({
      username: { $nin: ['testacc1', 'testacc2'] },
      role: { $ne: 'admin' },
    });

    console.log('Deleted:', result.deletedCount);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error removing students:', error);
    process.exit(1);
  }
})();
