const mongoose = require('mongoose');

const MONGO = process.env.MONGODB_URI || "mongodb://GlobalTechnoLMS:qwerty12345@ac-yppcca4-shard-00-00.n40fbrp.mongodb.net:27017,ac-yppcca4-shard-00-01.n40fbrp.mongodb.net:27017,ac-yppcca4-shard-00-02.n40fbrp.mongodb.net:27017/?ssl=true&replicaSet=atlas-lwiuiu-shard-0&authSource=admin&appName=LMS";

async function run() {
  await mongoose.connect(MONGO, { strictQuery: false });
  const db = mongoose.connection;
  db.on('error', (e) => console.error('Mongo error', e));

  // Minimal schemas for cleanup
  const courseSchema = new mongoose.Schema({ title: String, invitationCode: String, isActive: Boolean }, { strict: false });
  const announcementSchema = new mongoose.Schema({ classroom: String }, { strict: false });
  const announcementCommentSchema = new mongoose.Schema({ announcementId: String }, { strict: false });
  const invitationSchema = new mongoose.Schema({ classroom: String }, { strict: false });
  const videoSchema = new mongoose.Schema({ classroom: String, courseId: String }, { strict: false });

  const Course = mongoose.model('Course', courseSchema);
  const Announcement = mongoose.model('Announcement', announcementSchema);
  const AnnouncementComment = mongoose.model('AnnouncementComment', announcementCommentSchema);
  const Invitation = mongoose.model('Invitation', invitationSchema);
  const Video = mongoose.model('Video', videoSchema);

  try {
    const courses = await Course.find({}).lean();
    const activeCourses = courses.filter(c => c && c.isActive !== false);
    const courseIds = new Set(activeCourses.map(c => String(c._id)));
    const activeClassrooms = new Set();
    activeCourses.forEach((c) => {
      if (c._id) activeClassrooms.add(String(c._id));
      if (c.title) activeClassrooms.add(String(c.title));
      if (c.invitationCode) activeClassrooms.add(String(c.invitationCode));
    });

    // Helper to treat 'all' as global and keep
    const isOrphanClassroom = (value) => {
      if (!value) return true;
      const s = String(value).trim();
      if (!s) return true;
      if (s === 'all') return false;
      return !activeClassrooms.has(s);
    };

    // Announcements
    const announcements = await Announcement.find({}).lean();
    const orphanAnnouncements = announcements.filter(a => isOrphanClassroom(a.classroom));
    console.log('Found', orphanAnnouncements.length, 'orphan announcements');
    const orphanAnnouncementIds = orphanAnnouncements.map(a => String(a._id));
    if (orphanAnnouncementIds.length) {
      const delComments = await AnnouncementComment.deleteMany({ announcementId: { $in: orphanAnnouncementIds } });
      const delAnns = await Announcement.deleteMany({ _id: { $in: orphanAnnouncementIds } });
      console.log('Deleted announcement comments:', delComments.deletedCount, 'and announcements:', delAnns.deletedCount);
    }

    // Invitations
    const invitations = await Invitation.find({}).lean();
    const orphanInvitations = invitations.filter(i => isOrphanClassroom(i.classroom));
    console.log('Found', orphanInvitations.length, 'orphan invitations');
    if (orphanInvitations.length) {
      const ids = orphanInvitations.map(i => i._id);
      const delInv = await Invitation.deleteMany({ _id: { $in: ids } });
      console.log('Deleted invitations:', delInv.deletedCount);
    }

    // Videos
    const videos = await Video.find({}).lean();
    const orphanVideos = videos.filter(v => {
      const hasCourseId = v.courseId && String(v.courseId).trim();
      if (hasCourseId && !courseIds.has(String(v.courseId))) return true;
      return isOrphanClassroom(v.classroom);
    });
    console.log('Found', orphanVideos.length, 'orphan videos');
    if (orphanVideos.length) {
      const ids = orphanVideos.map(v => v._id);
      const delV = await Video.deleteMany({ _id: { $in: ids } });
      console.log('Deleted videos:', delV.deletedCount);
    }

    console.log('Cleanup completed.');
  } catch (err) {
    console.error('Cleanup failed:', err && err.message);
  } finally {
    mongoose.disconnect();
  }
}

run();
