//import the installed module of express
const express = require("express");
// import mongoose module
const mongoose = require("mongoose");
// import path module for static files
const path = require("path");
const fs = require("fs");
const multer = require("multer");
// provide name for the server
const server = express();
// Declare server port
const port = process.env.PORT || 3000;

// Trigger connection to mongoDB thru mongoose
// mongoose.connect("mongodb://localhost:27017/");
mongoose.connect(process.env.MONGODB_URI || "mongodb://GlobalTechnoLMS:qwerty12345@ac-yppcca4-shard-00-00.n40fbrp.mongodb.net:27017,ac-yppcca4-shard-00-01.n40fbrp.mongodb.net:27017,ac-yppcca4-shard-00-02.n40fbrp.mongodb.net:27017/?ssl=true&replicaSet=atlas-lwiuiu-shard-0&authSource=admin&appName=LMS")
  .catch((err) => {
    console.error("Cannot connect to MongoDB.", err.message);
  });

let db = mongoose.connection;

const uploadDir = path.join(__dirname, "uploads", "assignments");
fs.mkdirSync(uploadDir, { recursive: true });

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = String(file.originalname || "file").replace(/[^\w.-]+/g, "-");
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 20 * 1024 * 1024 }
});

// Check if connection has error
db.on("error", console.error.bind(console, "Cannot connect to MongoDB."));

// Check if connection is okay
db.once("open", () => console.log("MongoDB Atlas Connection Success!"));

// =============================================
// SCHEMAS
// =============================================

// Task Schema
const taskSchema = new mongoose.Schema({
  name: String,
  description: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  dateCompleted: Date,
  status: {
    type: String,
    default: "pending",
  },
});

// User Schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["admin", "user"],
  },
  enrolledCourses: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  dateRegistered: {
    type: Date,
    default: Date.now,
  },
});

// Course Schema
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  invitationCode: String,
  status: {
    type: String,
    default: "live",
    enum: ["live", "draft"],
  },
  nextUpTitle: {
    type: String,
    default: "",
  },
  nextUpMessage: {
    type: String,
    default: "",
  },
  nextUpUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// Quiz Schema
const quizSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  dueAt: String,
  type: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  sections: {
    type: Array,
    default: [],
  },
  questions: {
    type: Array,
    default: [],
  },
  question: String,
  options: {
    type: Array,
    default: [],
  },
  correctAnswer: String,
  correction: String,
});

// Quiz Submission Schema
const quizSubmissionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  quizId: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  studentName: String,
  answer: mongoose.Schema.Types.Mixed,
  answers: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  correction: String,
  corrections: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  manualScores: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  gradedAt: Date,
});

// Quiz Extra Chance Schema
const quizExtraChanceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  quizId: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  studentName: String,
  grantedAt: {
    type: Date,
    default: Date.now,
  },
  usedAt: Date,
});

// Announcement Schema
const announcementSchema = new mongoose.Schema({
  classroom: {
    type: String,
    default: "all",
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Video Schema
const videoSchema = new mongoose.Schema({
  classroom: {
    type: String,
    default: "all",
  },
  title: {
    type: String,
    required: true,
  },
  videoUrl: String,
  videoFile: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
  classroom: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    default: null,
  },
  sender: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "student",
    enum: ["admin", "student"],
  },
  text: String,
  attachments: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Private Message Schema
const privateMessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  senderRole: {
    type: String,
    default: "student",
    enum: ["admin", "student"],
  },
  text: String,
  attachments: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Invitation / Live Session Schema
const invitationSchema = new mongoose.Schema({
  classroom: {
    type: String,
    default: "all",
  },
  title: {
    type: String,
    required: true,
  },
  meetingLink: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Grade Schema
const gradeSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  classroom: String,
  prelim: {
    type: Number,
    default: 0,
  },
  midterm: {
    type: Number,
    default: 0,
  },
  finals: {
    type: Number,
    default: 0,
  },
  finalGrade: {
    type: Number,
    default: 0,
  },
  dateUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Assignment Schema
const assignmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  courseId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  instructions: { type: String, required: true },
  attachments: {
    type: Array,
    default: []
  },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// =============================================
// MODELS
// =============================================

const Task = mongoose.model("Task", taskSchema);
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);
const Quiz = mongoose.model("Quiz", quizSchema);
const QuizSubmission = mongoose.model("QuizSubmission", quizSubmissionSchema);
const QuizExtraChance = mongoose.model("QuizExtraChance", quizExtraChanceSchema);
const Announcement = mongoose.model("Announcement", announcementSchema);
const Video = mongoose.model("Video", videoSchema);
const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
const PrivateMessage = mongoose.model("PrivateMessage", privateMessageSchema);
const Invitation = mongoose.model("Invitation", invitationSchema);
const Grade = mongoose.model("Grade", gradeSchema);
const Assignment = mongoose.model("Assignment", assignmentSchema);

// Manual summary schema to track pending / checked counts and quiz status
const manualSummarySchema = new mongoose.Schema({
  courseId: { type: String, required: true, index: true },
  quizId: { type: String, required: false, index: true },
  pending: { type: Number, default: 0 },
  checked: { type: Number, default: 0 },
  openCount: { type: Number, default: 0 },
  closedCount: { type: Number, default: 0 },
  missedCount: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

const ManualSummary = mongoose.model("ManualSummary", manualSummarySchema);

// Enrolled learner summary schema for course progress tracking
const enrolledLearnerSummarySchema = new mongoose.Schema({
  courseId: { type: String, required: true, index: true },
  learnerId: { type: String, required: true, index: true },
  learnerName: { type: String, default: "" },
  email: { type: String, default: "" },
  quizTotal: { type: Number, default: 0 },
  quizAnswered: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

const EnrolledLearnerSummary = mongoose.model("EnrolledLearnerSummary", enrolledLearnerSummarySchema);

// Helper: recalculate and persist manual summary for a course (used internally)
async function recalcManualSummary(courseId) {
  const quizzes = await Quiz.find({ courseId });
  const submissions = await QuizSubmission.find({ courseId });

  const interpretStatus = (quiz) => {
    if (!quiz || !quiz.dueAt) return "open";
    const d = new Date(quiz.dueAt);
    if (isNaN(d)) return "open";
    const now = new Date();
    return d < now ? "closed" : "open";
  };

  const perQuiz = [];
  for (const quiz of quizzes) {
    const quizSubs = submissions.filter((s) => String(s.quizId) === String(quiz.id));
    let pending = 0;
    let checked = 0;
    for (const sub of quizSubs) {
      const ms = sub.manualScores || {};
      const gradedCount = Object.keys(ms).filter((k) => ms[k] !== null && ms[k] !== undefined && ms[k] !== "").length;
      if (gradedCount > 0) checked += 1; else pending += 1;
    }

    const status = interpretStatus(quiz);
    const missed = 0;

    perQuiz.push({ quizId: quiz.id, pending, checked, open: status === "open", closed: status === "closed", missed });

    await ManualSummary.findOneAndUpdate(
      { courseId, quizId: quiz.id },
      {
        courseId,
        quizId: quiz.id,
        pending,
        checked,
        openCount: status === "open" ? 1 : 0,
        closedCount: status === "closed" ? 1 : 0,
        missedCount: missed,
        updatedAt: new Date(),
      },
      { upsert: true }
    );
  }

  const totals = perQuiz.reduce(
    (acc, p) => {
      acc.pending += p.pending;
      acc.checked += p.checked;
      acc.open += p.open ? 1 : 0;
      acc.closed += p.closed ? 1 : 0;
      acc.missed += p.missed || 0;
      return acc;
    },
    { pending: 0, checked: 0, open: 0, closed: 0, missed: 0 }
  );

  await ManualSummary.findOneAndUpdate(
    { courseId, quizId: null },
    {
      courseId,
      quizId: null,
      pending: totals.pending,
      checked: totals.checked,
      openCount: totals.open,
      closedCount: totals.closed,
      missedCount: totals.missed,
      updatedAt: new Date(),
    },
    { upsert: true }
  );
}

async function recalcEnrolledLearnerSummary(courseId, learnerId = null) {
  const courseIdString = String(courseId);
  const quizzes = await Quiz.find({ courseId: courseIdString }).select("id");
  const quizIds = quizzes.map((quiz) => String(quiz.id));
  const quizTotal = quizIds.length;

  const updateLearner = async (learner) => {
    const studentId = String(learner._id);
    const submissions = await QuizSubmission.find({ courseId: courseIdString, studentId, quizId: { $in: quizIds } }).select("quizId");
    const quizAnswered = new Set(submissions.map((submission) => String(submission.quizId))).size;

    await EnrolledLearnerSummary.findOneAndUpdate(
      { courseId: courseIdString, learnerId: studentId },
      {
        courseId: courseIdString,
        learnerId: studentId,
        learnerName: learner.username || learner.fullName || "Student",
        email: learner.email || "",
        quizTotal,
        quizAnswered,
        updatedAt: new Date(),
      },
      { upsert: true }
    );
  };

  if (learnerId) {
    const learner = await User.findById(learnerId).select("username fullName email enrolledCourses");
    if (!learner) return;
    const enrolledCourses = Array.isArray(learner.enrolledCourses) ? learner.enrolledCourses : [];
    if (!enrolledCourses.some((entry) => String(entry) === courseIdString)) {
      await EnrolledLearnerSummary.deleteOne({ courseId: courseIdString, learnerId: String(learnerId) });
      return;
    }
    await updateLearner(learner);
    return;
  }

  const enrollmentCourseId = mongoose.Types.ObjectId.isValid(courseIdString) ? new mongoose.Types.ObjectId(courseIdString) : courseIdString;
  const learners = await User.find({
    isActive: { $ne: false },
    role: { $ne: "admin" },
    enrolledCourses: enrollmentCourseId,
  }).select("username fullName email enrolledCourses");

  const bulkOps = learners.map((learner) => {
    const studentId = String(learner._id);
    const learnerName = learner.username || learner.fullName || "Student";
    const email = learner.email || "";
    return {
      updateOne: {
        filter: { courseId, learnerId: studentId },
        update: {
          courseId,
          learnerId: studentId,
          learnerName,
          email,
          quizTotal,
          quizAnswered: 0,
          updatedAt: new Date(),
        },
        upsert: true,
      },
    };
  });

  if (bulkOps.length) {
    await EnrolledLearnerSummary.bulkWrite(bulkOps);
    await Promise.all(learners.map(updateLearner));
  }
}

const escapeRegExp = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const generateInvitationCode = (title = "") => {
  const base = String(title || "COURSE")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 6);
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  return `${base || "COURSE"}${suffix}`;
};

const generateUniqueInvitationCode = async (title = "") => {
  let invitationCode = generateInvitationCode(title);
  let existingCourse = await Course.findOne({ invitationCode });

  while (existingCourse != null) {
    invitationCode = generateInvitationCode(title);
    existingCourse = await Course.findOne({ invitationCode });
  }

  return invitationCode;
};

const ensureDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ username: "Administrator" });

    if (existingAdmin != null) {
      existingAdmin.fullName = "Administrator";
      existingAdmin.email = "globaltechnoadmin@gmail.com";
      existingAdmin.password = "Gl0b@l4dmin!123";
      existingAdmin.role = "admin";
      existingAdmin.isActive = true;
      if (!Array.isArray(existingAdmin.enrolledCourses)) {
        existingAdmin.enrolledCourses = [];
      }
      await existingAdmin.save();
      console.log("Default admin account updated successfully.");
      return;
    }

    const adminUser = new User({
      fullName: "Administrator",
      email: "globaltechnoadmin@gmail.com",
      username: "Administrator",
      password: "Gl0b@l4dmin!123",
      role: "admin",
      enrolledCourses: [],
    });

    await adminUser.save();
    console.log("Default admin account created successfully.");
  } catch (error) {
    console.error("Cannot create default admin account.", error.message);
  }
};

const ensureUserEnrollmentDefaults = async () => {
  try {
    const result = await User.updateMany(
      {
        $or: [
          { enrolledCourses: { $exists: false } },
          { enrolledCourses: null },
          { enrolledCourses: undefined },
        ],
      },
      { $set: { enrolledCourses: [] } }
    );

    if (result.modifiedCount || result.matchedCount) {
      console.log(`Backfilled enrollment arrays for ${result.modifiedCount || result.matchedCount} user record(s).`);
    }
  } catch (error) {
    console.error("Cannot normalize user enrollments.", error.message);
  }
};

const ensureEnrollmentIntegrity = async () => {
  try {
    const result = await User.updateMany(
      {
        $or: [
          { enrolledCourses: { $exists: false } },
          { enrolledCourses: null },
          { enrolledCourses: undefined },
        ],
      },
      { $set: { enrolledCourses: [] } }
    );

    if (result.modifiedCount || result.matchedCount) {
      console.log(`Normalized enrollment arrays for ${result.modifiedCount || result.matchedCount} user record(s).`);
    }
  } catch (error) {
    console.error("Cannot normalize user enrollments.", error.message);
  }
};

if (db.readyState === 1) {
  ensureDefaultAdmin();
  ensureEnrollmentIntegrity();
} else {
  db.once("open", async () => {
    await ensureDefaultAdmin();
    await ensureEnrollmentIntegrity();
  });
}

// =============================================
// MIDDLEWARES
// =============================================

server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ extended: true, limit: "50mb" }));

const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;")
  .replace(/'/g, "&#39;");

const getSafeUploadFilePath = (requestedFile = "") => {
  const decodedName = decodeURIComponent(String(requestedFile || ""));
  const safeName = path.basename(decodedName);
  if (!safeName) return "";
  return path.join(uploadDir, safeName);
};

const getUploadMimeType = (filePath = "") => {
  const extension = path.extname(filePath).toLowerCase();
  return {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".txt": "text/plain; charset=utf-8",
    ".csv": "text/csv; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".log": "text/plain; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".htm": "text/html; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".yaml": "text/yaml; charset=utf-8",
    ".yml": "text/yaml; charset=utf-8",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  }[extension] || "application/octet-stream";
};

const isTextPreviewable = (filePath = "") => {
  const extension = path.extname(filePath).toLowerCase();
  return [".txt", ".md", ".csv", ".json", ".log", ".html", ".htm", ".xml", ".js", ".css", ".yaml", ".yml"].includes(extension);
};

// Serve static files (HTML, CSS, JS, assets)
server.get("/uploads/assignments/preview/:filename", (req, res) => {
  const filePath = getSafeUploadFilePath(req.params.filename);

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).send({ code: 404, message: "File not found." });
  }

  if (!isTextPreviewable(filePath)) {
    return res.status(400).send({ code: 400, message: "This file type cannot be previewed as text." });
  }

  try {
    const content = fs.readFileSync(filePath, "utf8");
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(path.basename(filePath))}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 1.25rem; background: #f8fbfc; color: #12333b; }
      pre { white-space: pre-wrap; word-break: break-word; background: #fff; border: 1px solid #d8e7ec; border-radius: 0.6rem; padding: 1rem; overflow-x: auto; }
      h1 { font-size: 1rem; margin-bottom: 0.75rem; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(path.basename(filePath))}</h1>
    <pre>${escapeHtml(content)}</pre>
  </body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.send(html);
  } catch (error) {
    res.status(500).send({ code: 500, message: "Unable to read file for preview." });
  }
});

server.get("/uploads/assignments/:filename", (req, res) => {
  const filePath = getSafeUploadFilePath(req.params.filename);

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).send({ code: 404, message: "File not found." });
  }

  const mimeType = getUploadMimeType(filePath);

  res.setHeader("Content-Type", mimeType);
  res.setHeader("Content-Disposition", `inline; filename="${path.basename(filePath)}"`);
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  res.sendFile(filePath);
});

server.use(express.static(path.join(__dirname)));

// =============================================
// PAGE ROUTES — Serve all HTML files
// =============================================

// Root route — serve the landing page
server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Login page
server.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Register page
server.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

// Admin dashboard page
server.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Client / Student portal page
server.get("/client", (req, res) => {
  res.sendFile(path.join(__dirname, "client.html"));
});

// Classrooms page
server.get("/classrooms", (req, res) => {
  res.sendFile(path.join(__dirname, "classrooms.html"));
});

server.get("/home", (req, res) => {
  res.send("Hello from the home endpoint!");
});

server.get("/error", (req, res) => {
  res.status(404).send({
    code: 404,
    message: "Sorry the page cannot be found.",
  });
});

// =============================================
// USER ROUTES — Register & Login
// =============================================

// Register a new user
server.post("/users/register", (req, res) => {
  User.findOne({ username: req.body.username })
    .then((existingUser) => {
      if (existingUser != null) {
        return res.status(409).send({
          code: 409,
          message: "Username already exists. Please choose another.",
        });
      }

      let newUser = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        role: req.body.role || "user",
        enrolledCourses: [],
      });

      newUser
        .save()
        .then((savedUser) => {
          res.status(201).send({
            code: 201,
            message: "Registration successful!",
            data: {
              ...savedUser.toObject(),
              enrolledCourses: savedUser.enrolledCourses || [],
            },
          });
        })
        .catch((saveErr) => {
          res.status(500).send({
            code: 500,
            message: "There is an error saving the user.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error checking for existing user.",
      });
    });
});

// Login user
server.post("/users/login", (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");

  if (!username || !password) {
    return res.status(400).send({
      code: 400,
      message: "Username and password are required.",
    });
  }

  User.findOne({ username: { $regex: new RegExp(`^${username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } })
    .then((user) => {
      if (user == null) {
        return res.status(404).send({
          code: 404,
          message: "User not found.",
        });
      }

      if (user.password !== password) {
        return res.status(401).send({
          code: 401,
          message: "Invalid username or password.",
        });
      }

      if (!Array.isArray(user.enrolledCourses)) {
        user.enrolledCourses = [];
        user.save().catch(() => {});
      }

      res.status(200).send({
        code: 200,
        message: "Login successful!",
        data: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          username: user.username,
          role: user.role,
          enrolledCourses: Array.isArray(user.enrolledCourses) ? user.enrolledCourses : [],
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error during login.",
      });
    });
});

// Get user profile by ID
server.get("/users/:userId/profile", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("_id fullName email username role enrolledCourses dateRegistered");
    if (!user) {
      return res.status(404).send({
        code: 404,
        message: "User not found.",
      });
    }

    res.status(200).send({
      code: 200,
      message: "User profile loaded successfully.",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        role: user.role,
        enrolledCourses: Array.isArray(user.enrolledCourses) ? user.enrolledCourses : [],
        dateRegistered: user.dateRegistered,
      },
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: "There is an error fetching the user profile.",
    });
  }
});

// Get all users
server.get("/users/all", (req, res) => {
  User.find({})
    .then((result) => {
      res.status(200).send({
        code: 200,
        message: "Here are all users.",
        count: result.length,
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error fetching all users.",
      });
    });
});

// =============================================
// TASK ROUTES — CRUD
// =============================================

// Add a new task
server.post("/tasks/add", (req, res) => {
  Task.findOne({ name: req.body.name })
    .then((result) => {
      if (result != null && result.name == req.body.name) {
        res.send("Duplicate found. This task cannot be added!");
      } else {
        let newTask = new Task({
          name: req.body.name,
          description: req.body.description,
        });

        newTask
          .save()
          .then((savedTask) => {
            res.status(201).send({
              code: 201,
              message: "Task is now added!",
              data: savedTask,
            });
          })
          .catch((saveErr) => {
            res.status(500).send("There is an error saving the task.");
          });
      }
    })
    .catch((err) => {
      res.status(500).send("There is an error finding the task.");
    });
});

// Edit a task
server.put("/tasks/edit/:taskId", (req, res) => {
  Task.findOne({ _id: req.params.taskId })
    .then((result) => {
      if (result == null) {
        res.status(404).send("Task not found. Cannot edit!");
      } else {
        result.name = req.body.name;
        result.description = req.body.description;

        result
          .save()
          .then((updatedTask) => {
            res.status(200).send({
              code: 200,
              message: "Task is now updated!",
              data: updatedTask,
            });
          })
          .catch((updateErr) => {
            res.status(500).send("There is an error updating the task.");
          });
      }
    })
    .catch((err) => {
      res.status(500).send("There is an error finding the task.");
    });
});

// Get all tasks
server.get("/tasks/all", (req, res) => {
  Task.find({})
    .then((result) => {
      res.status(200).send({
        code: 200,
        message: "Here are all tasks.",
        count: result.length,
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send("There is an error fetching all tasks.");
    });
});

// Get all completed tasks
server.get("/tasks/all/completed", (req, res) => {
  Task.find({ status: "complete" })
    .then((result) => {
      res.status(200).send({
        code: 200,
        message: "Here are all completed tasks.",
        count: result.length,
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send("There is an error fetching completed tasks.");
    });
});

// Get all pending tasks
server.get("/tasks/all/pending", (req, res) => {
  Task.find({ status: "pending" })
    .then((result) => {
      res.status(200).send({
        code: 200,
        message: "Here are all pending tasks.",
        count: result.length,
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send("There is an error fetching pending tasks.");
    });
});

// Toggle task active status
server.patch("/tasks/active/:taskId", (req, res) => {
  Task.findOne({ _id: req.params.taskId })
    .then((result) => {
      if (result == null) {
        res.status(404).send("Task not found. Cannot update active status!");
      } else {
        if (result.isActive == false) {
          result.isActive = true;
        } else {
          result.isActive = false;
        }

        result
          .save()
          .then((updatedTask) => {
            res.status(200).send({
              code: 200,
              message: "Task active status is now updated!",
              data: updatedTask,
            });
          })
          .catch((updateErr) => {
            res
              .status(500)
              .send("There is an error updating task active status.");
          });
      }
    })
    .catch((err) => {
      res.status(500).send("There is an error finding the task.");
    });
});

// Delete a task
server.delete("/tasks/delete/:taskId", (req, res) => {
  Task.deleteOne({ _id: req.params.taskId })
    .then((result) => {
      if (result.deletedCount === 0) {
        res.status(404).send("Task not found. Cannot delete!");
      } else {
        res.status(200).send({
          code: 200,
          message: "Task is now permanently deleted!",
          data: result,
        });
      }
    })
    .catch((err) => {
      res.status(500).send("There is an error deleting the task.");
    });
});

// Mark task as complete
server.post("/tasks/:taskId/mark-complete", (req, res) => {
  Task.findOne({ _id: req.params.taskId })
    .then((result) => {
      if (result == null) {
        res.status(404).send("Task not found. Cannot mark as complete!");
      } else {
        result.status = "complete";
        result.dateCompleted = new Date();

        result
          .save()
          .then((updatedTask) => {
            res.status(200).send({
              code: 200,
              message: "Task is now marked as complete!",
              data: updatedTask,
            });
          })
          .catch((updateErr) => {
            res.status(500).send("There is an error completing the task.");
          });
      }
    })
    .catch((err) => {
      res.status(500).send("There is an error finding the task.");
    });
});

// =============================================
// COURSE ROUTES — CRUD
// =============================================

// Add a new course
server.post("/courses/add", async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();

    if (!title) {
      return res.status(400).send({
        code: 400,
        message: "Course title is required.",
      });
    }

    const invitationCode = req.body.invitationCode || await generateUniqueInvitationCode(req.body.title);

    const newCourse = new Course({
      title,
      description,
      invitationCode,
      status: req.body.status || "live",
      nextUpTitle: req.body.nextUpTitle || "",
      nextUpMessage: req.body.nextUpMessage || "",
    });

    const savedCourse = await newCourse.save();
    res.status(201).send({
      code: 201,
      message: "Course created successfully!",
      data: savedCourse,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: "There is an error creating the course.",
    });
  }
});

// Join a course via subject code
server.post("/courses/join", async (req, res) => {
  try {
    const userId = req.body.userId;
    const invitationCode = String(req.body.invitationCode || "").trim().toUpperCase();

    if (!userId || !invitationCode) {
      return res.status(400).send({
        code: 400,
        message: "User id and subject code are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        code: 404,
        message: "User not found.",
      });
    }

    const course = await Course.findOne({
      invitationCode: { $regex: new RegExp(`^${escapeRegExp(invitationCode)}$`, "i") },
      isActive: { $ne: false },
    });
    if (!course) {
      return res.status(404).send({
        code: 404,
        message: "Subject code not found.",
      });
    }

    if (!Array.isArray(user.enrolledCourses)) {
      user.enrolledCourses = [];
    }

    const alreadyJoined = user.enrolledCourses.some((item) => String(item) === String(course._id));
    if (!alreadyJoined) {
      user.enrolledCourses.push(course._id);
      await user.save();
      await recalcEnrolledLearnerSummary(course._id, user._id);
    }

    res.status(200).send({
      code: 200,
      message: "Course joined successfully!",
      data: {
        course,
        user: {
          ...user.toObject(),
          enrolledCourses: user.enrolledCourses || [],
        },
      },
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: "There is an error joining the course.",
    });
  }
});

// Get enrolled learners for a course
server.get("/courses/:courseId/enrolled-students", async (req, res) => {
  try {
    const courseIdString = String(req.params.courseId);
    const course = await Course.findById(courseIdString);
    if (!course) {
      return res.status(404).send({
        code: 404,
        message: "Course not found.",
      });
    }

    const quizzes = await Quiz.find({ courseId: courseIdString }).select("id");
    const quizIds = quizzes.map((quiz) => String(quiz.id));
    const totalQuizzes = quizIds.length;

    const submissions = await QuizSubmission.find({ courseId: courseIdString }).select("studentId quizId");
    const answeredPerStudent = submissions.reduce((map, submission) => {
      const studentKey = String(submission.studentId);
      if (!map[studentKey]) {
        map[studentKey] = new Set();
      }
      if (submission.quizId && quizIds.includes(String(submission.quizId))) {
        map[studentKey].add(String(submission.quizId));
      }
      return map;
    }, {});

    const enrollmentCourseId = mongoose.Types.ObjectId.isValid(courseIdString) ? new mongoose.Types.ObjectId(courseIdString) : courseIdString;
    const learners = await User.find({
      isActive: { $ne: false },
      role: { $ne: "admin" },
      enrolledCourses: enrollmentCourseId,
    })
      .select("username fullName email role dateRegistered enrolledCourses")
      .sort({ username: 1, fullName: 1 });

    const bulkOps = learners.map((learner) => {
      const studentKey = String(learner._id);
      const learnerName = learner.username || learner.fullName || "Student";
      const email = learner.email || "";
      const answeredSet = answeredPerStudent[studentKey] || new Set();
      return {
        updateOne: {
          filter: { courseId: courseIdString, learnerId: studentKey },
          update: {
            courseId: courseIdString,
            learnerId: studentKey,
            learnerName,
            email,
            quizTotal: totalQuizzes,
            quizAnswered: answeredSet.size,
            updatedAt: new Date(),
          },
          upsert: true,
        },
      };
    });

    if (bulkOps.length) {
      await EnrolledLearnerSummary.bulkWrite(bulkOps);
    }

    const payload = learners.map((learner) => {
      const studentKey = String(learner._id);
      const answeredSet = answeredPerStudent[studentKey] || new Set();
      return {
        id: studentKey,
        _id: learner._id,
        username: learner.username || learner.fullName || "Student",
        fullName: learner.fullName || "",
        email: learner.email || "",
        role: learner.role || "user",
        dateRegistered: learner.dateRegistered,
        quizAnswered: answeredSet.size,
        quizTotal: totalQuizzes,
      };
    });

    res.status(200).send({
      code: 200,
      message: "Enrolled learners loaded successfully.",
      data: payload,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      code: 500,
      message: "There is an error fetching enrolled learners.",
    });
  }
});

// Get all courses
server.get("/courses/all", async (req, res) => {
  try {
    const userId = req.query.userId;
    const activeCoursesQuery = { isActive: { $ne: false } };

    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({
          code: 404,
          message: "User not found.",
        });
      }

      const enrolledCourseIds = (user.enrolledCourses || []).filter(Boolean);
      const result = await Course.find({
        _id: { $in: enrolledCourseIds },
        ...activeCoursesQuery,
      }).sort({ dateCreated: -1 });

      return res.status(200).send({
        code: 200,
        message: "Here are the student's active courses.",
        count: result.length,
        data: result,
      });
    }

    const result = await Course.find(activeCoursesQuery).sort({ dateCreated: -1 });
    res.status(200).send({
      code: 200,
      message: "Here are all active courses.",
      count: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: "There is an error fetching all courses.",
    });
  }
});

// Edit a course
server.put("/courses/edit/:courseId", async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const result = await Course.findOne({ _id: req.params.courseId });

    if (result == null) {
      return res.status(404).send({
        code: 404,
        message: "Course not found. Cannot edit!",
      });
    }

    result.title = title || result.title;
    result.description = description || result.description;
    result.status = req.body.status || result.status;
    result.cover = req.body.cover || result.cover;

    const updatedCourse = await result.save();
    res.status(200).send({
      code: 200,
      message: "Course updated successfully!",
      data: updatedCourse,
    });
  } catch (err) {
    res.status(500).send({
      code: 500,
      message: "There is an error updating the course.",
    });
  }
});

// Delete a course
server.post("/courses/:courseId/next-up", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).send({
        code: 404,
        message: "Course not found.",
      });
    }

    const title = String(req.body?.title || "").trim();
    const message = String(req.body?.message || "").trim();

    if (!title || !message) {
      return res.status(400).send({
        code: 400,
        message: "Title and message are required.",
      });
    }

    course.nextUpTitle = title;
    course.nextUpMessage = message;
    course.nextUpUpdatedAt = new Date();
    await course.save();

    res.status(200).send({
      code: 200,
      message: "Course update saved successfully.",
      data: course,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: "There is an error saving the course update.",
    });
  }
});

server.get("/courses/:courseId/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find({ courseId: req.params.courseId }).sort({ createdAt: -1 });
    res.status(200).send({
      code: 200,
      data: quizzes,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: "There is an error fetching quizzes.",
    });
  }
});

server.post("/courses/:courseId/quizzes", async (req, res) => {
  try {
    const quizData = req.body;
    const quiz = new Quiz({
      ...quizData,
      courseId: req.params.courseId,
      id: quizData.id || `course-quiz-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await quiz.save();
    await recalcEnrolledLearnerSummary(req.params.courseId);
    res.status(201).send({
      code: 201,
      message: "Quiz saved successfully.",
      data: quiz,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: "There is an error saving the quiz.",
    });
  }
});

server.put("/courses/:courseId/quizzes/:quizId", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ id: req.params.quizId, courseId: req.params.courseId });
    if (!quiz) {
      return res.status(404).send({ code: 404, message: "Quiz not found." });
    }

    Object.assign(quiz, { ...req.body, updatedAt: new Date() });
    await quiz.save();
    await recalcEnrolledLearnerSummary(req.params.courseId);
    res.status(200).send({ code: 200, message: "Quiz updated successfully.", data: quiz });
  } catch (error) {
    res.status(500).send({ code: 500, message: "There is an error updating the quiz." });
  }
});

server.delete("/courses/:courseId/quizzes/:quizId", async (req, res) => {
  try {
    await Quiz.deleteOne({ id: req.params.quizId, courseId: req.params.courseId });
    await QuizSubmission.deleteMany({ quizId: req.params.quizId, courseId: req.params.courseId });
    await QuizExtraChance.deleteMany({ quizId: req.params.quizId, courseId: req.params.courseId });
    await recalcEnrolledLearnerSummary(req.params.courseId);
    res.status(200).send({ code: 200, message: "Quiz deleted successfully." });
  } catch (error) {
    res.status(500).send({ code: 500, message: "There is an error deleting the quiz." });
  }
});

server.get("/courses/:courseId/quiz-extra-chances", async (req, res) => {
  try {
    const chances = await QuizExtraChance.find({ courseId: req.params.courseId }).sort({ grantedAt: -1 });
    res.status(200).send({ code: 200, data: chances });
  } catch (error) {
    res.status(500).send({ code: 500, message: "There is an error fetching extra quiz attempts." });
  }
});

server.post("/courses/:courseId/quiz-extra-chances", async (req, res) => {
  try {
    const { quizId, studentId, studentName } = req.body;
    if (!quizId || !studentId) {
      return res.status(400).send({ code: 400, message: "Quiz and student are required." });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).send({ code: 404, message: "Course not found." });
    }

    const studentQuery = mongoose.Types.ObjectId.isValid(studentId)
      ? { _id: new mongoose.Types.ObjectId(studentId) }
      : { _id: studentId };

    const student = await User.findOne({
      ...studentQuery,
      isActive: { $ne: false },
      role: { $ne: "admin" },
    }).select("_id enrolledCourses username fullName");

    if (!student) {
      return res.status(400).send({ code: 400, message: "Only students currently enrolled in this course can receive an extra attempt." });
    }

    const enrolledCourses = Array.isArray(student.enrolledCourses) ? student.enrolledCourses : [];
    const isEnrolled = enrolledCourses.some((entry) => String(entry) === String(course._id));
    if (!isEnrolled) {
      return res.status(400).send({ code: 400, message: "Only students currently enrolled in this course can receive an extra attempt." });
    }

    const existing = await QuizExtraChance.findOne({
      courseId: req.params.courseId,
      quizId,
      studentId,
      usedAt: { $exists: false },
    });

    if (existing) {
      return res.status(200).send({ code: 200, message: "Extra attempt already granted.", data: existing });
    }

    const chance = new QuizExtraChance({
      id: `quiz-extra-chance-${Date.now()}`,
      courseId: req.params.courseId,
      quizId,
      studentId,
      studentName: studentName || student.fullName || student.username || "Student",
      grantedAt: new Date(),
    });

    await chance.save();
    res.status(201).send({ code: 201, message: "Extra attempt granted.", data: chance });
  } catch (error) {
    res.status(500).send({ code: 500, message: "There is an error granting the extra attempt." });
  }
});

server.put("/courses/:courseId/quiz-extra-chances/:chanceId", async (req, res) => {
  try {
    const chance = await QuizExtraChance.findOne({ id: req.params.chanceId, courseId: req.params.courseId });
    if (!chance) {
      return res.status(404).send({ code: 404, message: "Extra attempt not found." });
    }

    chance.usedAt = req.body?.usedAt ? new Date(req.body.usedAt) : new Date();
    await chance.save();
    res.status(200).send({ code: 200, message: "Extra attempt consumed.", data: chance });
  } catch (error) {
    res.status(500).send({ code: 500, message: "There is an error updating the extra attempt." });
  }
});

// Recalculate and persist manual grading summary for a course (and per-quiz)
server.post("/courses/:courseId/manual-summary/recalculate", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const quizzes = await Quiz.find({ courseId });
    const submissions = await QuizSubmission.find({ courseId });

    // Helper to interpret quiz status from dueAt string
    const interpretStatus = (quiz) => {
      if (!quiz || !quiz.dueAt) return "open";
      const d = new Date(quiz.dueAt);
      if (isNaN(d)) return "open";
      const now = new Date();
      return d < now ? "closed" : "open";
    };

    // Aggregate per-quiz
    const perQuiz = [];
    for (const quiz of quizzes) {
      const quizSubs = submissions.filter((s) => String(s.quizId) === String(quiz.id));
      // determine manual-graded questions count per submission by looking for manualScores keys
      let pending = 0;
      let checked = 0;
      for (const sub of quizSubs) {
        // count manual score entries: assume manualScores has questionId keys with numeric scores when graded
        const ms = sub.manualScores || {};
        const gradedCount = Object.keys(ms).filter((k) => ms[k] !== null && ms[k] !== undefined && ms[k] !== "").length;
        const totalManual = 0; // we don't have question schema here; treat submission-level: graded vs ungraded
        if (gradedCount > 0) checked += 1; else pending += 1;
      }

      const status = interpretStatus(quiz);
      const missed = 0; // missed concept not derivable here without business rules

      perQuiz.push({ quizId: quiz.id, pending, checked, open: status === "open", closed: status === "closed", missed });

      // upsert summary for this quiz
      await ManualSummary.findOneAndUpdate(
        { courseId, quizId: quiz.id },
        {
          courseId,
          quizId: quiz.id,
          pending,
          checked,
          openCount: status === "open" ? 1 : 0,
          closedCount: status === "closed" ? 1 : 0,
          missedCount: missed,
          updatedAt: new Date(),
        },
        { upsert: true }
      );
    }

    // Aggregate course-level totals
    const totals = perQuiz.reduce(
      (acc, p) => {
        acc.pending += p.pending;
        acc.checked += p.checked;
        acc.open += p.open ? 1 : 0;
        acc.closed += p.closed ? 1 : 0;
        acc.missed += p.missed || 0;
        return acc;
      },
      { pending: 0, checked: 0, open: 0, closed: 0, missed: 0 }
    );

    await ManualSummary.findOneAndUpdate(
      { courseId, quizId: null },
      {
        courseId,
        quizId: null,
        pending: totals.pending,
        checked: totals.checked,
        openCount: totals.open,
        closedCount: totals.closed,
        missedCount: totals.missed,
        updatedAt: new Date(),
      },
      { upsert: true }
    );

    res.status(200).send({ code: 200, message: "Manual summary recalculated.", data: { perQuiz, totals } });
  } catch (error) {
    console.error(error);
    res.status(500).send({ code: 500, message: "Error recalculating manual summary." });
  }
});

// Get manual summary for a course
server.get("/courses/:courseId/manual-summary", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const courseTotals = await ManualSummary.findOne({ courseId, quizId: null }).lean();
    const perQuiz = await ManualSummary.find({ courseId, quizId: { $ne: null } }).lean();
    res.status(200).send({ code: 200, data: { courseTotals, perQuiz } });
  } catch (error) {
    res.status(500).send({ code: 500, message: "Error fetching manual summary." });
  }
});

// Duplicate endpoints at top-level for compatibility
server.post("/manual-summary/:courseId/recalculate", async (req, res) => {
  // Delegate to existing route logic by calling the internal handler
  try {
    req.params.courseId = req.params.courseId;
    // reuse the same logic as /courses/:courseId/manual-summary/recalculate
    const courseId = req.params.courseId;
    const quizzes = await Quiz.find({ courseId });
    const submissions = await QuizSubmission.find({ courseId });

    const interpretStatus = (quiz) => {
      if (!quiz || !quiz.dueAt) return "open";
      const d = new Date(quiz.dueAt);
      if (isNaN(d)) return "open";
      const now = new Date();
      return d < now ? "closed" : "open";
    };

    const perQuiz = [];
    for (const quiz of quizzes) {
      const quizSubs = submissions.filter((s) => String(s.quizId) === String(quiz.id));
      let pending = 0;
      let checked = 0;
      for (const sub of quizSubs) {
        const ms = sub.manualScores || {};
        const gradedCount = Object.keys(ms).filter((k) => ms[k] !== null && ms[k] !== undefined && ms[k] !== "").length;
        if (gradedCount > 0) checked += 1; else pending += 1;
      }

      const status = interpretStatus(quiz);
      const missed = 0;

      perQuiz.push({ quizId: quiz.id, pending, checked, open: status === "open", closed: status === "closed", missed });

      await ManualSummary.findOneAndUpdate(
        { courseId, quizId: quiz.id },
        {
          courseId,
          quizId: quiz.id,
          pending,
          checked,
          openCount: status === "open" ? 1 : 0,
          closedCount: status === "closed" ? 1 : 0,
          missedCount: missed,
          updatedAt: new Date(),
        },
        { upsert: true }
      );
    }

    const totals = perQuiz.reduce(
      (acc, p) => {
        acc.pending += p.pending;
        acc.checked += p.checked;
        acc.open += p.open ? 1 : 0;
        acc.closed += p.closed ? 1 : 0;
        acc.missed += p.missed || 0;
        return acc;
      },
      { pending: 0, checked: 0, open: 0, closed: 0, missed: 0 }
    );

    await ManualSummary.findOneAndUpdate(
      { courseId, quizId: null },
      {
        courseId,
        quizId: null,
        pending: totals.pending,
        checked: totals.checked,
        openCount: totals.open,
        closedCount: totals.closed,
        missedCount: totals.missed,
        updatedAt: new Date(),
      },
      { upsert: true }
    );

    res.status(200).send({ code: 200, message: "Manual summary recalculated.", data: { perQuiz, totals } });
  } catch (error) {
    console.error(error);
    res.status(500).send({ code: 500, message: "Error recalculating manual summary." });
  }
});

server.get("/manual-summary/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const courseTotals = await ManualSummary.findOne({ courseId, quizId: null }).lean();
    const perQuiz = await ManualSummary.find({ courseId, quizId: { $ne: null } }).lean();
    res.status(200).send({ code: 200, data: { courseTotals, perQuiz } });
  } catch (error) {
    res.status(500).send({ code: 500, message: "Error fetching manual summary." });
  }
});

server.get("/courses/:courseId/quiz-submissions", async (req, res) => {
  try {
    const submissions = await QuizSubmission.find({ courseId: req.params.courseId }).sort({ submittedAt: -1 });
    res.status(200).send({ code: 200, data: submissions });
  } catch (error) {
    res.status(500).send({ code: 500, message: "There is an error fetching quiz submissions." });
  }
});

server.post("/courses/:courseId/quiz-submissions", async (req, res) => {
  try {
    const submissionData = req.body;
    const submission = new QuizSubmission({
      ...submissionData,
      courseId: req.params.courseId,
      id: submissionData.id || `course-quiz-submission-${Date.now()}`,
      submittedAt: new Date(),
    });

    await submission.save();
    // Recalculate manual summary for this course so counts stay in DB
    try {
      await recalcManualSummary(req.params.courseId);
      await recalcEnrolledLearnerSummary(req.params.courseId, String(submission.studentId));
    } catch (err) {
      console.warn('Failed to recalc summaries after submission save', err && err.message);
    }
    res.status(201).send({ code: 201, message: "Submission saved successfully.", data: submission });
  } catch (error) {
    res.status(500).send({ code: 500, message: "There is an error saving the submission." });
  }
});

server.put("/courses/:courseId/quiz-submissions/:submissionId", async (req, res) => {
  try {
    const submission = await QuizSubmission.findOne({ id: req.params.submissionId, courseId: req.params.courseId });
    if (!submission) {
      return res.status(404).send({ code: 404, message: "Submission not found." });
    }

    Object.assign(submission, { ...req.body, submittedAt: submission.submittedAt });
    await submission.save();
    // Recalculate manual summary after grading/update
    try {
      await recalcManualSummary(req.params.courseId);
      await recalcEnrolledLearnerSummary(req.params.courseId, String(submission.studentId));
    } catch (err) {
      console.warn('Failed to recalc summaries after submission update', err && err.message);
    }
    res.status(200).send({ code: 200, message: "Submission updated successfully.", data: submission });
  } catch (error) {
    res.status(500).send({ code: 500, message: "There is an error updating the submission." });
  }
});

server.delete("/courses/delete/:courseId", async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId });

    if (course == null) {
      return res.status(404).send({
        code: 404,
        message: "Course not found. Cannot delete!",
      });
    }

    await Course.updateOne({ _id: req.params.courseId }, { $set: { isActive: false } });
    await User.updateMany(
      { enrolledCourses: course._id },
      { $pull: { enrolledCourses: course._id } }
    );
    await Quiz.deleteMany({ courseId: req.params.courseId });
    await QuizSubmission.deleteMany({ courseId: req.params.courseId });

    res.status(200).send({
      code: 200,
      message: "Course is now permanently deleted!",
      data: {
        deletedCourseId: String(course._id),
      },
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: "There is an error deleting the course.",
    });
  }
});

// =============================================
// ASSIGNMENT ROUTES — CRUD
// =============================================

// Get assignments for a course
server.get("/courses/:courseId/assignments", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const assignments = await Assignment.find({ courseId }).lean();
    res.status(200).send({ code: 200, data: assignments });
  } catch (error) {
    res.status(500).send({ code: 500, message: "Error fetching assignments." });
  }
});

// Create a new assignment
server.post("/courses/:courseId/assignments", upload.fields([{ name: "attachments", maxCount: 10 }]), async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const body = req.body || {};
    const payload = typeof body === "object" && body !== null ? body : {};
    const title = String(payload.title || body.title || "").trim();
    const instructions = String(payload.instructions || body.instructions || "").trim();
    const dueDate = String(payload.dueDate || body.dueDate || "").trim();
    const uploadedFiles = Array.isArray(req.files?.attachments)
      ? req.files.attachments.map((file) => {
          const normalized = {
            name: String(file.originalname || ""),
            filename: String(file.filename || ""),
            originalname: String(file.originalname || ""),
            mimetype: String(file.mimetype || ""),
            type: String(file.mimetype || ""),
            size: Number(file.size || 0),
            path: `/uploads/assignments/${String(file.filename || "")}`,
            url: `/uploads/assignments/${String(file.filename || "")}`
          };
          return normalized;
        })
      : [];
    
    // Validation
    if (!courseId) {
      return res.status(400).send({ code: 400, message: "Course ID is required." });
    }
    if (!title || title.trim() === "") {
      return res.status(400).send({ code: 400, message: "Assignment title is required." });
    }
    if (!instructions || instructions.trim() === "") {
      return res.status(400).send({ code: 400, message: "Assignment instructions are required." });
    }
    if (!dueDate) {
      return res.status(400).send({ code: 400, message: "Due date is required." });
    }
    
    const id = `assignment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const assignment = await Assignment.create({
      id,
      courseId,
      title,
      instructions,
      dueDate: new Date(dueDate),
      attachments: Array.isArray(uploadedFiles) ? uploadedFiles.map((item) => ({ ...item })) : []
    });
    
    res.status(201).send({ code: 201, message: "Assignment created successfully.", data: assignment });
  } catch (error) {
    console.error("Assignment creation error:", error.message);
    res.status(500).send({ code: 500, message: `Error creating assignment: ${error.message}` });
  }
});

// Update an assignment
server.put(
  "/courses/:courseId/assignments/:assignmentId",
  upload.fields([{ name: "attachments", maxCount: 10 }]),
  async (req, res) => {
    try {
      const { courseId, assignmentId } = req.params;
      const body = req.body || {};
      const title = String(body.title || "").trim();
      const instructions = String(body.instructions || "").trim();
      const dueDate = String(body.dueDate || "").trim();
      const existingAttachments = typeof body.existingAttachments === "string"
        ? JSON.parse(body.existingAttachments || "[]")
        : Array.isArray(body.existingAttachments)
          ? body.existingAttachments
          : [];

      const uploadedFiles = Array.isArray(req.files?.attachments)
        ? req.files.attachments.map((file) => ({
            name: String(file.originalname || ""),
            filename: String(file.filename || ""),
            originalname: String(file.originalname || ""),
            mimetype: String(file.mimetype || ""),
            type: String(file.mimetype || ""),
            size: Number(file.size || 0),
            path: `/uploads/assignments/${String(file.filename || "")}`,
            url: `/uploads/assignments/${String(file.filename || "")}`
          }))
        : [];

      const attachments = Array.isArray(existingAttachments)
        ? [...existingAttachments, ...uploadedFiles]
        : uploadedFiles;

      const assignment = await Assignment.findOneAndUpdate(
        { courseId, id: assignmentId },
        {
          title,
          instructions,
          dueDate: new Date(dueDate),
          attachments,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!assignment) {
        return res.status(404).send({ code: 404, message: "Assignment not found." });
      }

      res.status(200).send({ code: 200, message: "Assignment updated successfully.", data: assignment });
    } catch (error) {
      console.error("Assignment update error:", error.message);
      res.status(500).send({ code: 500, message: "Error updating assignment." });
    }
  }
);

// Delete an assignment
server.delete("/courses/:courseId/assignments/:assignmentId", async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;
    
    const assignment = await Assignment.findOneAndDelete({ courseId, id: assignmentId });
    
    if (!assignment) {
      return res.status(404).send({ code: 404, message: "Assignment not found." });
    }
    
    res.status(200).send({ code: 200, message: "Assignment deleted successfully." });
  } catch (error) {
    res.status(500).send({ code: 500, message: "Error deleting assignment." });
  }
});

// =============================================
// ANNOUNCEMENT ROUTES — CRUD
// =============================================

// Post an announcement
server.post("/announcements/add", (req, res) => {
  let newAnnouncement = new Announcement({
    classroom: req.body.classroom || "all",
    subject: req.body.subject,
    message: req.body.message,
    pinned: req.body.pinned || false,
  });

  newAnnouncement
    .save()
    .then((savedAnnouncement) => {
      res.status(201).send({
        code: 201,
        message: "Announcement posted successfully!",
        data: savedAnnouncement,
      });
    })
    .catch((saveErr) => {
      res.status(500).send({
        code: 500,
        message: "There is an error posting the announcement.",
      });
    });
});

// Get all announcements
server.get("/announcements/all", (req, res) => {
  Announcement.find({}).sort({ pinned: -1, createdAt: -1 })
    .then((result) => {
      res.status(200).send({
        code: 200,
        message: "Here are all announcements.",
        count: result.length,
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error fetching announcements.",
      });
    });
});

// Delete an announcement
server.delete("/announcements/delete/:announcementId", (req, res) => {
  Announcement.deleteOne({ _id: req.params.announcementId })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).send({
          code: 404,
          message: "Announcement not found. Cannot delete!",
        });
      }

      res.status(200).send({
        code: 200,
        message: "Announcement is now deleted!",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error deleting the announcement.",
      });
    });
});

// Toggle announcement pin status
server.patch("/announcements/pin/:announcementId", (req, res) => {
  Announcement.findOne({ _id: req.params.announcementId })
    .then((result) => {
      if (result == null) {
        return res.status(404).send({
          code: 404,
          message: "Announcement not found!",
        });
      }

      result.pinned = !result.pinned;

      result
        .save()
        .then((updated) => {
          res.status(200).send({
            code: 200,
            message: "Announcement pin status updated!",
            data: updated,
          });
        })
        .catch((updateErr) => {
          res.status(500).send({
            code: 500,
            message: "There is an error updating the announcement.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error finding the announcement.",
      });
    });
});

// =============================================
// VIDEO ROUTES — CRUD
// =============================================

// Post a video
server.post("/videos/add", (req, res) => {
  let newVideo = new Video({
    classroom: req.body.classroom || "all",
    title: req.body.title,
    videoUrl: req.body.videoUrl,
    videoFile: req.body.videoFile,
  });

  newVideo
    .save()
    .then((savedVideo) => {
      res.status(201).send({
        code: 201,
        message: "Video posted successfully!",
        data: savedVideo,
      });
    })
    .catch((saveErr) => {
      res.status(500).send({
        code: 500,
        message: "There is an error posting the video.",
      });
    });
});

// Get all videos
server.get("/videos/all", (req, res) => {
  Video.find({}).sort({ createdAt: -1 })
    .then((result) => {
      res.status(200).send({
        code: 200,
        message: "Here are all videos.",
        count: result.length,
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error fetching videos.",
      });
    });
});

// Delete a video
server.delete("/videos/delete/:videoId", (req, res) => {
  Video.deleteOne({ _id: req.params.videoId })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).send({
          code: 404,
          message: "Video not found. Cannot delete!",
        });
      }

      res.status(200).send({
        code: 200,
        message: "Video is now deleted!",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error deleting the video.",
      });
    });
});

// =============================================
// CHAT MESSAGE ROUTES — CRUD
// =============================================

// Send a chat message
server.post("/chat/send", async (req, res) => {
  const classroom = String(req.body.classroom || "").trim();
  const sender = String(req.body.sender || "").trim();
  const role = String(req.body.role || "student").trim();
  const userId = req.body.userId ? String(req.body.userId).trim() : null;
  const text = req.body.text || "";
  const attachments = Array.isArray(req.body.attachments) ? req.body.attachments : [];

  if (!classroom || !sender || !role) {
    return res.status(400).send({
      code: 400,
      message: "Chat message classroom, sender, and role are required.",
    });
  }

  try {
    const course = await Course.findOne({ _id: classroom });
    if (!course) {
      return res.status(404).send({
        code: 404,
        message: "Course not found for class chat.",
      });
    }

    if (role === "student") {
      if (!userId) {
        return res.status(400).send({
          code: 400,
          message: "Student userId is required to send class chat messages.",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({
          code: 404,
          message: "User not found.",
        });
      }

      const enrolledCourseIds = (user.enrolledCourses || []).map(String);
      if (!enrolledCourseIds.includes(String(classroom))) {
        return res.status(403).send({
          code: 403,
          message: "You are not enrolled in this course and cannot post to this class chat.",
        });
      }
    }

    const newMessage = new ChatMessage({
      classroom,
      userId,
      sender,
      role,
      text,
      attachments,
    });

    const savedMessage = await newMessage.save();
    res.status(201).send({
      code: 201,
      message: "Chat message sent!",
      data: savedMessage,
    });
  } catch (saveErr) {
    res.status(500).send({
      code: 500,
      message: "There is an error sending the chat message.",
    });
  }
});

// Get all chat messages (optionally filter by classroom)
server.get("/chat/all", (req, res) => {
  let filter = {};
  if (req.query.classroom) {
    filter.classroom = req.query.classroom;
  }

  ChatMessage.find(filter).sort({ createdAt: 1 })
    .then((result) => {
      res.status(200).send({
        code: 200,
        message: "Here are all chat messages.",
        count: result.length,
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error fetching chat messages.",
      });
    });
});

// Delete a chat message
server.delete("/chat/delete/:messageId", (req, res) => {
  ChatMessage.deleteOne({ _id: req.params.messageId })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).send({
          code: 404,
          message: "Chat message not found. Cannot delete!",
        });
      }

      res.status(200).send({
        code: 200,
        message: "Chat message deleted!",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error deleting the chat message.",
      });
    });
});

// =============================================
// PRIVATE MESSAGE ROUTES — CRUD
// =============================================

// Send a private message
server.post("/private-messages/send", (req, res) => {
  let newMessage = new PrivateMessage({
    sender: req.body.sender,
    receiver: req.body.receiver,
    senderRole: req.body.senderRole || "student",
    text: req.body.text,
    attachments: req.body.attachments || [],
  });

  newMessage
    .save()
    .then((savedMessage) => {
      res.status(201).send({
        code: 201,
        message: "Private message sent!",
        data: savedMessage,
      });
    })
    .catch((saveErr) => {
      res.status(500).send({
        code: 500,
        message: "There is an error sending the private message.",
      });
    });
});

// Get all private messages (optionally filter by sender or receiver)
server.get("/private-messages/all", (req, res) => {
  let filter = {};
  if (req.query.sender) {
    filter.sender = req.query.sender;
  }
  if (req.query.receiver) {
    filter.receiver = req.query.receiver;
  }

  PrivateMessage.find(filter).sort({ createdAt: 1 })
    .then((result) => {
      res.status(200).send({
        code: 200,
        message: "Here are all private messages.",
        count: result.length,
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error fetching private messages.",
      });
    });
});

// Delete a private message
server.delete("/private-messages/delete/:messageId", (req, res) => {
  PrivateMessage.deleteOne({ _id: req.params.messageId })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).send({
          code: 404,
          message: "Private message not found. Cannot delete!",
        });
      }

      res.status(200).send({
        code: 200,
        message: "Private message deleted!",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error deleting the private message.",
      });
    });
});

// =============================================
// INVITATION / LIVE SESSION ROUTES — CRUD
// =============================================

// Schedule a live session
server.post("/invitations/add", (req, res) => {
  const title = String(req.body.title || "").trim();
  const meetingLink = String(req.body.meetingLink || req.body.link || "").trim();
  const classroom = String(req.body.classroom || "all").trim() || "all";

  if (!title || !meetingLink) {
    return res.status(400).send({
      code: 400,
      message: "Title and meeting link are required.",
    });
  }

  Invitation.findOneAndUpdate(
    { classroom },
    { title, meetingLink, createdAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
    .then((savedInvitation) => {
      res.status(201).send({
        code: 201,
        message: "Live session scheduled successfully!",
        data: savedInvitation,
      });
    })
    .catch((saveErr) => {
      res.status(500).send({
        code: 500,
        message: "There is an error scheduling the live session.",
      });
    });
});

// Get all invitations / live sessions
server.get("/invitations/all", (req, res) => {
  const classroom = String(req.query.classroom || "").trim();
  const query = classroom
    ? { $or: [{ classroom }, { classroom: "all" }] }
    : {};

  Invitation.find(query).sort({ createdAt: -1 })
    .then((result) => {
      res.status(200).send({
        code: 200,
        message: "Here are all live sessions.",
        count: result.length,
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error fetching live sessions.",
      });
    });
});

// Delete an invitation / live session
server.delete("/invitations/delete/:invitationId", (req, res) => {
  Invitation.deleteOne({ _id: req.params.invitationId })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).send({
          code: 404,
          message: "Live session not found. Cannot delete!",
        });
      }

      res.status(200).send({
        code: 200,
        message: "Live session is now deleted!",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error deleting the live session.",
      });
    });
});

// =============================================
// GRADE ROUTES — CRUD
// =============================================

// Add or update a grade
server.post("/grades/add", (req, res) => {
  let newGrade = new Grade({
    studentName: req.body.studentName,
    classroom: req.body.classroom,
    prelim: req.body.prelim || 0,
    midterm: req.body.midterm || 0,
    finals: req.body.finals || 0,
    finalGrade: req.body.finalGrade || 0,
  });

  newGrade
    .save()
    .then((savedGrade) => {
      res.status(201).send({
        code: 201,
        message: "Grade added successfully!",
        data: savedGrade,
      });
    })
    .catch((saveErr) => {
      res.status(500).send({
        code: 500,
        message: "There is an error adding the grade.",
      });
    });
});

// Get all grades
server.get("/grades/all", (req, res) => {
  Grade.find({})
    .then((result) => {
      res.status(200).send({
        code: 200,
        message: "Here are all grades.",
        count: result.length,
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error fetching grades.",
      });
    });
});

// Edit a grade
server.put("/grades/edit/:gradeId", (req, res) => {
  Grade.findOne({ _id: req.params.gradeId })
    .then((result) => {
      if (result == null) {
        return res.status(404).send({
          code: 404,
          message: "Grade not found. Cannot edit!",
        });
      }

      result.prelim = req.body.prelim ?? result.prelim;
      result.midterm = req.body.midterm ?? result.midterm;
      result.finals = req.body.finals ?? result.finals;
      result.finalGrade = req.body.finalGrade ?? result.finalGrade;
      result.dateUpdated = new Date();

      result
        .save()
        .then((updatedGrade) => {
          res.status(200).send({
            code: 200,
            message: "Grade updated successfully!",
            data: updatedGrade,
          });
        })
        .catch((updateErr) => {
          res.status(500).send({
            code: 500,
            message: "There is an error updating the grade.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error finding the grade.",
      });
    });
});

// Delete a grade
server.delete("/grades/delete/:gradeId", (req, res) => {
  Grade.deleteOne({ _id: req.params.gradeId })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).send({
          code: 404,
          message: "Grade not found. Cannot delete!",
        });
      }

      res.status(200).send({
        code: 200,
        message: "Grade is now deleted!",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error deleting the grade.",
      });
    });
});

// =============================================
// START THE SERVER
// =============================================

// Log registered routes for debugging
server.listen(port, () => {
  console.log(`Server is now running at port ${port}.`);
  try {
    const routes = [];
    if (server && server._router && server._router.stack) {
      server._router.stack.forEach((middleware) => {
        if (middleware.route) {
          const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
          routes.push(`${methods} ${middleware.route.path}`);
        } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
          middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
              const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
              routes.push(`${methods} ${handler.route.path}`);
            }
          });
        }
      });
      console.log('Registered routes:\n' + routes.join('\n'));
    } else {
      console.warn('No router stack available to enumerate routes.');
    }
  } catch (e) {
    console.warn('Unable to enumerate routes', e && e.message);
  }
});