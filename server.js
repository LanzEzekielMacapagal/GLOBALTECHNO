//import the installed module of express
const express = require("express");
// import mongoose module
const mongoose = require("mongoose");
// import path module for static files
const path = require("path");
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

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, assets)
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
    const existingCourse = await Course.findOne({ title: req.body.title });

    if (existingCourse != null) {
      return res.status(409).send({
        code: 409,
        message: "A course with this title already exists!",
      });
    }

    const invitationCode = req.body.invitationCode || await generateUniqueInvitationCode(req.body.title);

    const newCourse = new Course({
      title: req.body.title,
      description: req.body.description,
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
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).send({
        code: 404,
        message: "Course not found.",
      });
    }

    const learners = await User.find({
      isActive: { $ne: false },
      role: { $ne: "admin" },
    })
      .select("username fullName email role dateRegistered enrolledCourses")
      .sort({ username: 1, fullName: 1 });

    const payload = learners
      .filter((learner) => {
        const enrolledCourses = Array.isArray(learner.enrolledCourses) ? learner.enrolledCourses : [];
        return enrolledCourses.some((entry) => String(entry) === String(course._id));
      })
      .map((learner) => ({
        id: String(learner._id),
        _id: learner._id,
        username: learner.username || learner.fullName || "Student",
        fullName: learner.fullName || "",
        email: learner.email || "",
        role: learner.role || "user",
        dateRegistered: learner.dateRegistered,
      }));

    res.status(200).send({
      code: 200,
      message: "Enrolled learners loaded successfully.",
      data: payload,
    });
  } catch (error) {
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
server.put("/courses/edit/:courseId", (req, res) => {
  Course.findOne({ _id: req.params.courseId })
    .then((result) => {
      if (result == null) {
        return res.status(404).send({
          code: 404,
          message: "Course not found. Cannot edit!",
        });
      }

      result.title = req.body.title || result.title;
      result.description = req.body.description || result.description;
      result.status = req.body.status || result.status;
      result.cover = req.body.cover || result.cover;

      result
        .save()
        .then((updatedCourse) => {
          res.status(200).send({
            code: 200,
            message: "Course updated successfully!",
            data: updatedCourse,
          });
        })
        .catch((updateErr) => {
          res.status(500).send({
            code: 500,
            message: "There is an error updating the course.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "There is an error finding the course.",
      });
    });
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
server.post("/chat/send", (req, res) => {
  let newMessage = new ChatMessage({
    classroom: req.body.classroom,
    sender: req.body.sender,
    role: req.body.role || "student",
    text: req.body.text,
    attachments: req.body.attachments || [],
  });

  newMessage
    .save()
    .then((savedMessage) => {
      res.status(201).send({
        code: 201,
        message: "Chat message sent!",
        data: savedMessage,
      });
    })
    .catch((saveErr) => {
      res.status(500).send({
        code: 500,
        message: "There is an error sending the chat message.",
      });
    });
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
  let newInvitation = new Invitation({
    classroom: req.body.classroom || "all",
    title: req.body.title,
    meetingLink: req.body.meetingLink,
  });

  newInvitation
    .save()
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
  Invitation.find({}).sort({ createdAt: -1 })
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

server.listen(port, () =>
  console.log(`Server is now running at port ${port}.`),
);