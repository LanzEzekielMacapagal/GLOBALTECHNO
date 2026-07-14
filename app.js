const filterButtons = document.querySelectorAll("[data-filter]");
const courseCards = document.querySelectorAll(".course-card");
const adminApp = document.querySelector("#adminApp");
const adminLogout = document.querySelector("#adminLogout");
const portalLoginForm = document.querySelector("#portalLoginForm");
const portalLoginError = document.querySelector("#portalLoginError");
const clientLogout = document.querySelector("#clientLogout");
const classroomName = document.querySelector("#classroomName");
const classroomLabel = document.querySelector("#classroomLabel");
const courseSearchForms = document.querySelectorAll(".course-search");
const dashboardJumps = document.querySelectorAll("[data-open-section]");
const announcementForm = document.querySelector("#announcementForm");
const announcementSubject = document.querySelector("#announcementSubject");
const adminAnnouncements = document.querySelector("#adminAnnouncements");
const studentAnnouncements = document.querySelector("#studentAnnouncements");
const studentAnnouncementClass = document.querySelector("#studentAnnouncementClass");
const chatbox = document.querySelector("#chatbox");
const chatForm = document.querySelector("#chatForm");
const chatMessage = document.querySelector("#chatMessage");
const chatAttachment = document.querySelector("#chatAttachment");
const chatMessages = document.querySelector("#chatMessages");
const chatClassroom = document.querySelector("#chatClassroom");
const chatRecentList = document.querySelector("#chatRecentList");
const chatThreadTitle = document.querySelector("#chatThreadTitle");
const chatInfoTitle = document.querySelector("#chatInfoTitle");
const chatToggles = document.querySelectorAll(".chat-toggle");
const courseForm = document.querySelector("#courseForm");
const courseTitle = document.querySelector("#courseTitle");
const courseDescription = document.querySelector("#courseDescription");
const studentImportForm = document.querySelector("#studentImportForm");
const studentImportCode = document.querySelector("#studentImportCode");
const studentImportMessage = document.querySelector("#studentImportMessage");
const privateMessagePanel = document.querySelector(".private-message-panel");
const privateMessageStudent = document.querySelector("#privateMessageStudent");
const privateMessageStudentName = document.querySelector("#privateMessageStudentName");
const privateRecentList = document.querySelector("#privateRecentList");
const privateInfoTitle = document.querySelector("#privateInfoTitle");
const privateMessages = document.querySelector("#privateMessages");
const privateMessageForm = document.querySelector("#privateMessageForm");
const privateMessageText = document.querySelector("#privateMessageText");
const privateMessageAttachment = document.querySelector("#privateMessageAttachment");
const videoForm = document.querySelector("#videoForm");
const videoError = document.querySelector("#videoError");
const adminVideos = document.querySelector("#adminVideos");
const assignmentForm = document.querySelector("#assignmentForm");
const assignmentSubject = document.querySelector("#assignmentSubject");
const assignmentClassroom = document.querySelector("#assignmentClassroom");
const assignmentType = document.querySelector("#assignmentType");
const assignmentAttachment = document.querySelector("#assignmentAttachment");
const adminAssignments = document.querySelector("#adminAssignments");
const adminGrades = document.querySelector("#adminGrades");
const studentAssignments = document.querySelector("#studentAssignments");
const studentAssignmentClass = document.querySelector("#studentAssignmentClass");
const videoModal = document.querySelector("#videoModal");
const videoModalFrame = document.querySelector("#videoModalFrame");
const videoModalPlayer = document.querySelector("#videoModalPlayer");
const videoModalLabel = document.querySelector("#videoModalLabel");
const invitationForm = document.querySelector("#invitationForm");
const enrollmentRequests = document.querySelector("#enrollmentRequests");
const studentSectionLinks = document.querySelectorAll("[data-student-section-link]");
const studentSections = document.querySelectorAll("[data-student-section]");
const sectionMenuToggle = document.querySelector("#sectionMenuToggle");
const sectionMenuBackdrop = document.querySelector("#sectionMenuBackdrop");
const sectionNav = document.querySelector("#sectionNav");
const notificationCenter = document.querySelector("[data-notification-center]");
const notificationToggle = document.querySelector("[data-notification-toggle]");
const notificationPanel = document.querySelector("[data-notification-panel]");
const notificationList = document.querySelector("[data-notification-list]");
const notificationCount = document.querySelector("[data-notification-count]");
const notificationClear = document.querySelector("[data-notification-clear]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobileSectionQuery = window.matchMedia("(max-width: 991.98px)");
const apiBaseUrl = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && window.location.port !== "3000"
  ? "http://localhost:3000"
  : "";
let serverCourses = [];

function getApiUrl(path) {
  return `${apiBaseUrl}${path}`;
}

const motionObserver = !prefersReducedMotion && "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("motion-visible");
      motionObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14 })
  : null;

function observeMotionElements(root = document) {
  const elements = root.querySelectorAll(".card, .announcement-item, .gradebook-course, .chat-message, .student-section-nav, .course-resource-item, .course-video-item, .course-workspace-panel");

  elements.forEach((element) => {
    if (element.classList.contains("motion-ready")) return;

    element.classList.add("motion-ready");

    if (!motionObserver) {
      element.classList.add("motion-visible");
      return;
    }

    element.classList.add("motion-reveal");
    motionObserver.observe(element);
  });
}

function setSectionMenuOpen(isOpen) {
  if (!sectionMenuToggle || !sectionNav) return;

  sectionMenuToggle.setAttribute("aria-expanded", String(isOpen));
  sectionMenuToggle.setAttribute("aria-label", `${isOpen ? "Close" : "Open"} sections menu`);
  sectionMenuToggle.classList.toggle("active", isOpen);
  sectionNav.classList.toggle("section-menu-open", isOpen);
  sectionMenuBackdrop?.classList.toggle("active", isOpen);
  document.body.classList.toggle("section-menu-lock", isOpen);
}

sectionMenuToggle?.addEventListener("click", () => {
  const isOpen = sectionMenuToggle.getAttribute("aria-expanded") === "true";
  setSectionMenuOpen(!isOpen);
});

sectionMenuBackdrop?.addEventListener("click", () => {
  setSectionMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setSectionMenuOpen(false);
  if (event.key === "Escape") setNotificationPanelOpen(false);
});

notificationToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  const isOpen = notificationToggle.getAttribute("aria-expanded") === "true";
  setNotificationPanelOpen(!isOpen);
});

notificationPanel?.addEventListener("click", (event) => {
  const seeMoreButton = event.target.closest("[data-notification-see-more]");
  if (seeMoreButton) {
    notificationVisibleCount = Number.MAX_SAFE_INTEGER;
    renderNotificationCenter();
  }

  event.stopPropagation();
});

document.addEventListener("click", (event) => {
  if (!notificationCenter?.contains(event.target)) setNotificationPanelOpen(false);
});

notificationClear?.addEventListener("click", () => {
  markNotificationsRead(() => true);
});

notificationList?.addEventListener("click", (event) => {
  const item = event.target.closest("[data-notification-id]");
  if (!item) return;

  markNotificationsRead((notification) => notification.id === item.dataset.notificationId);
  showStudentSection(item.dataset.notificationSection, { updateHash: true });
  setNotificationPanelOpen(false);
  setSectionMenuOpen(false);
});

window.addEventListener("storage", (event) => {
  if (["gthNotifications", getNotificationReadKey()].includes(event.key)) renderNotificationCenter();
});

const classroomTitles = {
  all: "All Subjects"
};

const classroomStudents = {
  ict: [
    { id: "ict-andrea", name: "Andrea Valdez" },
    { id: "ict-jomar", name: "Jomar Mercado" },
    { id: "ict-mika", name: "Mika Santos" }
  ],
  css: [
    { id: "css-ella", name: "Ella Reyes" },
    { id: "css-paolo", name: "Paolo Cruz" },
    { id: "css-nina", name: "Nina Ramos" }
  ]
};

function getClassroomTitle(classroom = "") {
  if (classroom === "all") return "All Subjects";
  return getCustomCourses().find((course) => course.id === classroom)?.title || classroomTitles[classroom] || "Subject";
}

function getSubjectTargets(options = {}) {
  const { includeAll = true } = options;
  const targets = getCustomCourses().map((course) => ({
    value: course.id,
    label: course.title
  }));

  return includeAll ? [{ value: "all", label: "All Subjects" }, ...targets] : targets;
}

function populateSubjectTargetSelect(select, options = {}) {
  if (!select) return;

  const { includeAll = true, emptyLabel = "Create a subject first" } = options;
  const currentValue = select.value;
  const targets = getSubjectTargets({ includeAll });
  select.replaceChildren();

  if (!targets.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = emptyLabel;
    option.disabled = true;
    option.selected = true;
    select.appendChild(option);
    return;
  }

  targets.forEach((target) => {
    const option = document.createElement("option");
    option.value = target.value;
    option.textContent = target.label;
    select.appendChild(option);
  });

  if (targets.some((target) => target.value === currentValue)) {
    select.value = currentValue;
  }
}

const requestedClassroom = new URLSearchParams(window.location.search).get("classroom") || "";
const availableClassrooms = getSubjectTargets({ includeAll: false });
const selectedClassroom = availableClassrooms.some((target) => target.value === requestedClassroom)
  ? requestedClassroom
  : availableClassrooms[0]?.value || "";
const selectedClassroomTitle = getClassroomTitle(selectedClassroom);
const currentUserFromSession = (() => {
  try {
    return JSON.parse(sessionStorage.getItem("gthCurrentUser") || "null");
  } catch {
    return null;
  }
})();
const currentStudent = {
  ...((classroomStudents[selectedClassroom] || classroomStudents.ict)[0]),
  id: currentUserFromSession?._id || currentUserFromSession?.id || "",
  name: currentUserFromSession?.username || currentUserFromSession?.fullName || "Student",
  username: currentUserFromSession?.username || "",
  fullName: currentUserFromSession?.fullName || "",
  classroom: selectedClassroom
};

const subjectCourseMap = {
  "General Activity": ""
};

const deprecatedSubjectIds = new Set(["ict", "css"]);
const demoAnnouncements = [];
const demoVideos = [];
const demoAssignments = [];

let expandedAssignmentId;

const demoInvitations = [];

const courseWorkspaces = {};

const courseAccentClasses = ["primary", "coral", "sand"];
const filePreviewStore = new Map();
const fileObjectUrlStore = new Map();
const notificationsPerPage = 18;
let notificationVisibleCount = notificationsPerPage;

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function getAllStudents() {
  return Object.entries(classroomStudents).flatMap(([classroom, students]) => {
    return students.map((student) => ({ ...student, classroom }));
  });
}

function getStudentGrades() {
  return getStoredItems("gthStudentGrades", []);
}

function getStudentGrade(courseId, studentId) {
  return getStudentGrades().find((grade) => grade.courseId === courseId && grade.studentId === studentId);
}

function calculateFinalGrade(grade = {}) {
  const values = ["prelim", "midterm", "final"].map((key) => grade[key]);
  if (values.some((value) => value === "" || value === null || value === undefined)) return null;
  const parts = values.map((value) => Number(value));
  if (parts.some((part) => Number.isNaN(part))) return null;
  return Math.round(parts.reduce((total, part) => total + part, 0) / parts.length);
}

async function syncCurrentStudentFromServer() {
  const currentUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("gthCurrentUser") || "null");
    } catch {
      return null;
    }
  })();

  if (!currentUser?._id) return currentStudent;

  try {
    const response = await fetch(getApiUrl(`/users/${encodeURIComponent(currentUser._id)}/profile`));
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "Unable to load student profile.");

    const profile = result.data || {};
    const nextName = profile.username || profile.fullName || currentUser.username || currentUser.fullName || "Student";
    currentStudent.id = profile._id || currentUser._id || currentStudent.id;
    currentStudent.name = nextName;
    currentStudent.username = profile.username || currentUser.username || currentStudent.username || "";
    currentStudent.fullName = profile.fullName || currentUser.fullName || currentStudent.fullName || "";
    currentStudent.classroom = currentStudent.classroom || selectedClassroom;
    sessionStorage.setItem("gthCurrentUser", JSON.stringify({ ...currentUser, ...profile }));
  } catch {
    currentStudent.name = currentUser.username || currentUser.fullName || currentStudent.name || "Student";
    currentStudent.username = currentUser.username || currentStudent.username || "";
    currentStudent.fullName = currentUser.fullName || currentStudent.fullName || "";
  }
}

function renderCourseGradeSummary(courseId, student = currentStudent) {
  const grade = getStudentGrade(courseId, student.id) || {};
  const finalGrade = calculateFinalGrade(grade);
  const summary = document.createElement("div");
  summary.className = "course-grade-summary mt-3";

  const trackerName = student.username || student.fullName || student.name || "Student";
  summary.append(
    createTextElement("p", "section-label mb-1", "Learning tracker"),
    createTextElement("h4", "h6 mb-3", trackerName)
  );

  const grid = document.createElement("div");
  grid.className = "course-grade-grid";

  [
    ["Prelim", grade.prelim],
    ["Midterm", grade.midterm],
    ["Final", grade.final],
    ["Final Grade", finalGrade]
  ].forEach(([label, value]) => {
    const tile = document.createElement("div");
    tile.className = "course-grade-tile";
    tile.append(
      createTextElement("span", "", label),
      createTextElement("strong", "", value === null || value === undefined || value === "" ? "--" : `${value}%`)
    );
    grid.appendChild(tile);
  });

  summary.appendChild(grid);
  return summary;
}

function renderCourseResourcesPanel(course, courseId) {
  const panel = document.createElement("aside");
  panel.className = "course-workspace-panel course-workspace-resources-panel";

  const guidanceBox = document.createElement("section");
  guidanceBox.className = "course-resource-box";
  guidanceBox.append(
    createTextElement("h4", "h6 mb-1", "Classwork and resources"),
    createTextElement("small", "text-secondary", "Course notes and classwork guidance")
  );

  const resourceList = document.createElement("div");
  resourceList.className = "course-post-list mt-2";
  course.resources.forEach((resource) => {
    resourceList.appendChild(renderStaticCourseResource(resource, course));
  });
  guidanceBox.appendChild(resourceList);

  const postedResources = getCourseItems(getCourseResources(), courseId);
  const postedBox = document.createElement("section");
  postedBox.className = "course-resource-box course-resource-files-box";
  postedBox.append(
    createTextElement("h4", "h6 mb-1", "Reviewers"),
    createTextElement("small", "text-secondary", "PDF and DOCX files uploaded by the admin")
  );

  const postedList = document.createElement("div");
  postedList.className = "course-post-list mt-2";
  if (!postedResources.length) {
    postedList.appendChild(createTextElement("p", "text-secondary small mb-0", adminApp ? "No reviewers uploaded for this course yet." : "No reviewers uploaded by the admin yet."));
  } else {
    postedResources.forEach((resource) => {
      postedList.appendChild(renderCourseResourceItem(resource));
    });
  }

  postedBox.appendChild(postedList);
  if (adminApp) postedBox.appendChild(renderCourseResourceForm(courseId));

  panel.append(guidanceBox, postedBox);

  const courseVideos = getCourseVideos(courseId);
  const videoTitle = document.createElement("div");
  videoTitle.className = "course-resource-section-title";
  videoTitle.append(
    createTextElement("h4", "h6 mb-0", "Recorded lessons"),
    createTextElement("small", "text-secondary", "Videos posted by the admin for this course")
  );

  const videoList = document.createElement("div");
  videoList.className = "course-post-list course-video-list";

  if (!courseVideos.length) {
    videoList.appendChild(createTextElement("p", "text-secondary small mb-0", adminApp ? "No videos posted for this course yet." : "No recorded lessons for this course yet."));
  } else {
    courseVideos.forEach((video) => {
      videoList.appendChild(renderCourseVideoItem(video));
    });
  }

  panel.append(videoTitle, videoList);
  return panel;
}

function getCourseAssignments(course, courseId = "") {
  const courseTitle = String(course?.title || "").trim().toLowerCase();
  return getAssignments().filter((assignment) => {
    if (courseId && assignment.courseId === courseId) return true;
    return courseTitle && String(assignment.subject || "").trim().toLowerCase() === courseTitle;
  });
}

function calculateLearnerCourseProgress(courseId, course, student) {
  const quizzes = getCourseItems(getCourseQuizzes(), courseId);
  const quizSubmissions = quizzes.filter((quiz) => getQuizSubmission(quiz.id, student)).length;
  const courseAssignments = getCourseAssignments(course, courseId).filter((assignment) => {
    return assignment.classroom === "all" || assignment.classroom === student.classroom;
  });
  const assignmentSubmissions = courseAssignments.filter((assignment) => getAssignmentSubmission(assignment.id, student)).length;
  const graded = calculateFinalGrade(getStudentGrade(courseId, student.id) || {});
  const requiredItems = quizzes.length + courseAssignments.length;
  const completedItems = quizSubmissions + assignmentSubmissions;
  const activityProgress = requiredItems ? Math.round((completedItems / requiredItems) * 100) : null;
  const progress = activityProgress ?? graded ?? 0;

  return {
    progress,
    requiredItems,
    completedItems,
    quizSubmissions,
    quizTotal: quizzes.length,
    assignmentSubmissions,
    assignmentTotal: courseAssignments.length,
    graded
  };
}

function renderCourseLearnerTracker(course, courseId) {
  const panel = document.createElement("section");
  panel.className = "course-learner-tracker";

  const header = document.createElement("div");
  header.className = "course-learner-tracker-header";
  header.append(
    createTextElement("p", "section-label mb-1", "Classroom roster"),
    createTextElement("h4", "h6 mb-0", "Enrolled learners")
  );

  const countBadge = createTextElement("span", "badge text-bg-info", "Loading...");
  header.appendChild(countBadge);

  const list = document.createElement("div");
  list.className = "course-learner-list";
  list.appendChild(createTextElement("p", "text-secondary small mb-0", "Loading enrolled learners..."));

  panel.append(header, list);

  fetch(getApiUrl(`/courses/${encodeURIComponent(courseId)}/enrolled-students`))
    .then((response) => response.json().catch(() => ({})))
    .then((result) => {
      const learners = Array.isArray(result.data) ? result.data : [];
      countBadge.textContent = learners.length ? `${learners.length} learners` : "No learners";
      list.replaceChildren();

      if (!learners.length) {
        list.appendChild(createTextElement("p", "text-secondary small mb-0", "No students have joined this class yet."));
        return;
      }

      learners.forEach((learner) => {
        const row = document.createElement("div");
        row.className = "course-learner-row";

        const info = document.createElement("div");
        info.className = "course-learner-info";
        const displayName = learner.username || learner.fullName || "Student";
        const secondaryText = learner.fullName && learner.fullName !== displayName
          ? learner.fullName
          : "Enrolled learner";

        info.append(
          createTextElement("span", "avatar", getInitials(displayName)),
          createTextElement("strong", "", displayName),
          createTextElement("small", "text-secondary", secondaryText)
        );

        const status = document.createElement("div");
        status.className = "course-learner-status";
        status.append(
          createTextElement("strong", "", "Joined"),
          createTextElement("small", "text-secondary", learner.username ? `@${learner.username}` : "Student")
        );

        row.append(info, status);
        list.appendChild(row);
      });
    })
    .catch(() => {
      countBadge.textContent = "Unavailable";
      list.replaceChildren();
      list.appendChild(createTextElement("p", "text-secondary small mb-0", "Unable to load learners right now."));
    });

  return panel;
}

function renderCourseAssignmentForm(courseId) {
  const course = courseWorkspaces[courseId];
  const form = document.createElement("form");
  form.className = "course-post-form course-assignment-form vstack gap-2 mt-3";
  form.dataset.courseAssignmentForm = courseId;

  const classroomLabel = document.createElement("label");
  classroomLabel.className = "form-label small fw-bold mb-0";
  classroomLabel.textContent = "Post to";
  const classroom = document.createElement("select");
  classroom.className = "form-select form-select-sm mt-1";
  classroom.name = "classroom";
  classroom.required = true;
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Subjects";
  classroom.appendChild(allOption);
  getSubjectTargets({ includeAll: false }).forEach(({ value, label }) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    classroom.appendChild(option);
  });
  classroomLabel.appendChild(classroom);

  const typeLabel = document.createElement("label");
  typeLabel.className = "form-label small fw-bold mb-0";
  typeLabel.textContent = "Assignment type";
  const type = document.createElement("select");
  type.className = "form-select form-select-sm mt-1";
  type.name = "type";
  type.required = true;
  [["file", "File upload"], ["essay", "Essay answer"]].forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    type.appendChild(option);
  });
  typeLabel.appendChild(type);

  const title = document.createElement("input");
  title.className = "form-control form-control-sm";
  title.name = "title";
  title.type = "text";
  title.placeholder = "Assignment title";
  title.required = true;

  const instructions = document.createElement("textarea");
  instructions.className = "form-control form-control-sm";
  instructions.name = "instructions";
  instructions.rows = 4;
  instructions.placeholder = "Write assignment instructions";
  instructions.required = true;

  const attachmentLabel = document.createElement("label");
  attachmentLabel.className = "form-label small fw-bold mb-0";
  attachmentLabel.textContent = "Attach PDF or DOCX";
  const attachments = document.createElement("input");
  attachments.className = "form-control form-control-sm mt-1";
  attachments.name = "attachments";
  attachments.type = "file";
  attachments.accept = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  attachments.multiple = true;
  attachmentLabel.appendChild(attachments);

  const dueLabel = document.createElement("label");
  dueLabel.className = "form-label small fw-bold mb-0";
  dueLabel.textContent = "Due date and time";
  const dueDate = document.createElement("input");
  dueDate.className = "form-control form-control-sm mt-1";
  dueDate.name = "dueDate";
  dueDate.type = "datetime-local";
  dueDate.required = true;
  dueLabel.appendChild(dueDate);

  const button = document.createElement("button");
  button.className = "btn btn-primary btn-sm align-self-start";
  button.type = "submit";
  button.textContent = "Add Assignment";

  form.append(
    createTextElement("p", "section-label mb-0", "Add assignment"),
    createTextElement("strong", "small", course ? course.title : "Course assignment"),
    classroomLabel,
    typeLabel,
    title,
    instructions,
    attachmentLabel,
    dueLabel,
    button
  );
  return form;
}

function renderCourseQuizStack(courseId, options = {}) {
  const course = options.course || courseWorkspaces[courseId];
  const wrapper = document.createElement(options.article ? "article" : "div");
  wrapper.className = options.article ? "student-course-quiz-panel" : "course-quiz-stack";
  const nextTitle = course?.nextUpTitle || course?.next || "";
  const nextMessage = course?.nextUpMessage || "";
  const quizzes = getCourseItems(getCourseQuizzes(), courseId);
  const quizScore = getCourseQuizScore(courseId);

  if (options.includeHeader && course) {
    const header = document.createElement("div");
    header.className = "student-course-quiz-header";
    header.append(
      createTextElement("p", "section-label mb-1", "Course quizzes"),
      createTextElement("h3", "h6 mb-0", course.title)
    );
    wrapper.appendChild(header);
  }

  if (options.includeNext && course) {
    const nextPanel = document.createElement("div");
    nextPanel.className = "course-next-panel";
    nextPanel.append(
      createTextElement("p", "section-label mb-1", "Next up"),
      createTextElement("h4", "h6 mb-2", nextTitle || "No upcoming task yet")
    );

    if (nextMessage) {
      nextPanel.appendChild(createTextElement("p", "text-secondary small mb-0", nextMessage));
    }

    if (options.adminControls) nextPanel.appendChild(renderCourseNextForm(courseId, { title: nextTitle, message: nextMessage }));
    wrapper.appendChild(nextPanel);
  }

  if (options.includeQuizzes !== false) {
    const quizTitle = createTextElement("h4", "h6 mb-2", "Tests");
    const quizList = document.createElement("div");
    quizList.className = "course-post-list";
    wrapper.appendChild(quizTitle);
    if (options.adminControls) wrapper.appendChild(renderCourseQuizForm(courseId));

    if (!options.adminControls && quizzes.length) {
      const scoreSummary = document.createElement("div");
      scoreSummary.className = "course-quiz-score";
      scoreSummary.append(
        createTextElement("span", "", "Quiz score"),
        createTextElement("strong", "", `${formatQuizScore(quizScore.points)}/${quizScore.total} points`)
      );
      wrapper.appendChild(scoreSummary);
    }

    if (!quizzes.length) {
      quizList.appendChild(createTextElement("p", "text-secondary small mb-0", options.adminControls ? "No tests posted yet." : "No tests for this course yet."));
    } else {
      quizzes.forEach((quiz) => quizList.appendChild(renderCourseQuizItem(quiz)));
    }

    wrapper.appendChild(quizList);
  }

  if (course) {
    const assignmentTitle = createTextElement("h4", "h6 mb-2 mt-3", "Assignments");
    const assignmentList = document.createElement("div");
    assignmentList.className = "course-post-list";
    const courseAssignments = getCourseAssignments(course, courseId).filter((assignment) => {
      return options.adminControls || isVisibleForSelectedClassroom(assignment);
    });

    wrapper.appendChild(assignmentTitle);
    if (options.adminControls) wrapper.appendChild(renderCourseAssignmentForm(courseId));

    if (!courseAssignments.length) {
      assignmentList.appendChild(createTextElement("p", "text-secondary small mb-0", options.adminControls ? "No assignments posted yet." : "No assignments for this course yet."));
    } else {
      courseAssignments.forEach((assignment) => {
        assignmentList.appendChild(renderAssignmentCard(assignment, { admin: Boolean(options.adminControls) }));
      });
    }

    wrapper.appendChild(assignmentList);
  }

  if (options.includeGrades) {
    wrapper.appendChild(renderCourseGradeSummary(courseId));
  }

  return wrapper;
}

async function renderCourseWorkspace(courseId, triggerCard) {
  const course = courseWorkspaces[courseId];
  const courseList = triggerCard.closest("#courseList");
  if (!course || !courseList) return;

  await loadServerQuizzes(courseId);
  await loadServerQuizSubmissions(courseId);
  await loadServerEnrolledStudents(courseId);
  await loadServerQuizExtraChances(courseId);

  document.querySelectorAll(".course-card").forEach((card) => {
    const isActive = card === triggerCard;
    card.classList.toggle("course-card-active", isActive);
    card.setAttribute("aria-pressed", String(isActive));
  });

  courseList.parentElement.querySelector(".course-workspace")?.remove();

  const workspace = document.createElement("section");
  workspace.className = `course-workspace course-workspace-${course.accent}`;
  workspace.setAttribute("aria-live", "polite");

  const hero = document.createElement("div");
  hero.className = "course-workspace-hero";

  const heroText = document.createElement("div");
  heroText.append(
    createTextElement("p", "section-label mb-1", "Course workspace"),
    createTextElement("h3", "h4 mb-2", course.title),
    createTextElement("p", "text-secondary mb-0", course.description)
  );

  const heroMeta = document.createElement("div");
  heroMeta.className = "course-workspace-meta";
  heroMeta.append(
    createTextElement("span", "badge text-bg-info", course.status),
    createTextElement("strong", "", `${course.progress}%`)
  );

  const inviteCode = course.invitationCode || createInvitationCode(course.title, course.id);
  const invitePanel = document.createElement("div");
  invitePanel.className = "course-invite-code course-invite-code-hero";
  const inviteText = document.createElement("div");
  inviteText.append(
    createTextElement("span", "", "Subject invitation code"),
    createTextElement("strong", "", inviteCode)
  );
  const copyInvite = document.createElement("button");
  copyInvite.className = "btn btn-outline-primary btn-sm";
  copyInvite.type = "button";
  copyInvite.dataset.copyInviteCode = inviteCode;
  copyInvite.textContent = "Copy";
  invitePanel.append(inviteText, copyInvite);

  hero.appendChild(heroText);

  if (!adminApp) {
    const liveInvitation = getLatestCourseInvitation(courseId);
    const livePanel = document.createElement("div");
    livePanel.className = "course-invite-code course-invite-code-hero course-live-link-hero";

    const liveText = document.createElement("div");
    liveText.append(
      createTextElement("span", "", "Live session link"),
      createTextElement("strong", "", liveInvitation ? liveInvitation.title : "No live session")
    );
    livePanel.appendChild(liveText);

    if (liveInvitation) {
      const liveActions = document.createElement("div");
      liveActions.className = "course-live-link-actions";

      const openLive = document.createElement("a");
      openLive.className = "btn btn-primary btn-sm";
      openLive.href = liveInvitation.link;
      openLive.target = "_blank";
      openLive.rel = "noopener";
      openLive.textContent = "Open";

      const copyLive = document.createElement("button");
      copyLive.className = "btn btn-outline-primary btn-sm";
      copyLive.type = "button";
      copyLive.dataset.copyLiveSessionLink = liveInvitation.link;
      copyLive.textContent = "Copy";

      liveActions.append(openLive, copyLive);
      livePanel.appendChild(liveActions);
    }

    hero.appendChild(livePanel);
  }

  hero.append(invitePanel, heroMeta);

  const progress = document.createElement("div");
  progress.className = "course-workspace-progress progress";
  progress.setAttribute("role", "progressbar");
  progress.setAttribute("aria-label", `${course.title} progress`);
  progress.setAttribute("aria-valuenow", String(course.progress));
  progress.setAttribute("aria-valuemin", "0");
  progress.setAttribute("aria-valuemax", "100");

  const progressBar = document.createElement("div");
  progressBar.className = `progress-bar ${course.accent === "coral" ? "bg-coral" : course.accent === "sand" ? "bg-sand" : ""}`;
  progressBar.style.width = `${course.progress}%`;
  progress.appendChild(progressBar);

  const body = document.createElement("div");
  body.className = "course-workspace-grid";

  const stream = document.createElement("article");
  stream.className = "course-workspace-panel course-workspace-panel-main";
  stream.appendChild(renderCourseQuizStack(courseId, {
    course,
    includeNext: true,
    includeGrades: !adminApp,
    includeQuizzes: true,
    adminControls: Boolean(adminApp)
  }));

  const resourcePanel = renderCourseResourcesPanel(course, courseId);
  if (adminApp) resourcePanel.appendChild(renderCourseLearnerTracker(course, courseId));
  body.append(stream, resourcePanel);
  workspace.append(hero, progress, body);
  courseList.insertAdjacentElement("afterend", workspace);
  observeMotionElements(workspace);
  workspace.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest" });
}

function bindCourseCard(card) {
  if (card.dataset.courseBound === "true") return;
  card.dataset.courseBound = "true";
  card.tabIndex = 0;
  card.role = "button";
  card.setAttribute("aria-pressed", "false");

  card.addEventListener("click", () => {
    renderCourseWorkspace(card.dataset.course, card);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    renderCourseWorkspace(card.dataset.course, card);
  });
}

courseCards.forEach(bindCourseCard);

dashboardJumps.forEach((jump) => {
  jump.addEventListener("click", () => {
    showStudentSection(jump.dataset.openSection, { updateHash: true });
  });

  jump.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    showStudentSection(jump.dataset.openSection, { updateHash: true });
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".course-card").forEach((card) => {
      const isVisible = filter === "all" || card.dataset.status === filter;
      card.classList.toggle("d-none", !isVisible);
    });

    const activeCard = document.querySelector(".course-card-active");
    if (activeCard?.classList.contains("d-none")) {
      activeCard.classList.remove("course-card-active");
      activeCard.setAttribute("aria-pressed", "false");
      activeCard.closest("#courseList")?.parentElement.querySelector(".course-workspace")?.remove();
    }
  });
});

function showStudentSection(sectionId, options = {}) {
  if (!studentSections.length) return;

  const targetSection = document.querySelector(`[data-student-section="${sectionId}"]`) || studentSections[0];
  const targetId = targetSection.dataset.studentSection;

  studentSections.forEach((section) => {
    section.classList.toggle("active", section === targetSection);
  });

  studentSectionLinks.forEach((link) => {
    const isActive = link.dataset.studentSectionLink === targetId;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (options.updateHash) {
    history.replaceState(null, "", `#${targetId}`);
  }

  if (targetId === getNotificationSectionId({ section: "class-chat" })) {
    renderChatMessages();
  } else if (targetId === "private-messages") {
    renderPrivateMessages();
  } else {
    markNotificationsReadBySection(targetId, { render: false });
  }
  renderNotificationCenter();
  observeMotionElements(targetSection);

  if (options.updateHash && mobileSectionQuery.matches) {
    targetSection.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  }
}

if (studentSections.length) {
  const initialSection = window.location.hash.replace("#", "") || "announcements";
  showStudentSection(initialSection);

  studentSectionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showStudentSection(link.dataset.studentSectionLink, { updateHash: true });
      setSectionMenuOpen(false);
    });
  });

  window.addEventListener("hashchange", () => {
    showStudentSection(window.location.hash.replace("#", "") || "announcements");
  });
}

courseSearchForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchInput = form.querySelector("input[type='search']");
    const query = searchInput?.value.trim().toLowerCase();
    if (!query) return;

    const cards = Array.from(document.querySelectorAll(".course-card"));
    const match = cards.find((card) => {
      const title = card.querySelector("h3")?.textContent.trim().toLowerCase() || "";
      return title.includes(query);
    });

    cards.forEach((card) => card.classList.remove("course-search-match"));

    if (!match) {
      searchInput.classList.add("is-invalid");
      setTimeout(() => {
        searchInput.classList.remove("is-invalid");
      }, 1200);
      return;
    }

    match.classList.remove("d-none");
    match.scrollIntoView({ behavior: "smooth", block: "center" });
    match.classList.add("course-search-match");

    setTimeout(() => {
      match.classList.remove("course-search-match");
    }, 2200);
  });
});

function getStoredItems(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
}

function saveStoredItems(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
    return true;
  } catch {
    console.warn(`Unable to save ${key}. Browser storage may be full or unavailable.`);
    return false;
  }
}

function setFormStatus(form, message = "", type = "danger") {
  if (!form) return;
  let status = form.querySelector("[data-form-status]");
  if (!status) {
    status = document.createElement("p");
    status.dataset.formStatus = "true";
    form.appendChild(status);
  }

  status.className = message ? `alert alert-${type} small mb-0` : "d-none";
  status.textContent = message;
}

function getCurrentNotificationRole() {
  return adminApp ? "admin" : "student";
}

function getNotificationReadKey() {
  return getCurrentNotificationRole() === "admin"
    ? "gthNotificationReads-admin"
    : `gthNotificationReads-${currentStudent.id}`;
}

function getNotifications() {
  return getStoredItems("gthNotifications", []);
}

function saveNotifications(notifications) {
  saveStoredItems("gthNotifications", notifications.slice(0, 120));
}

function getReadNotificationIds() {
  return getStoredItems(getNotificationReadKey(), []);
}

function saveReadNotificationIds(ids) {
  saveStoredItems(getNotificationReadKey(), Array.from(new Set(ids)));
}

function getCourseById(courseId) {
  return getCustomCourses().find((course) => course.id === courseId);
}

function getCourseTitle(courseId) {
  return getCourseById(courseId)?.title || "Course";
}

function getAssignmentTitle(assignment) {
  return assignment?.title || "assignment";
}

function getNotificationSectionId(notification) {
  if (!notification?.section) return "announcements";
  if (notification.section === "class-chat" && !adminApp) return "student-chat";
  if (notification.section === "gmeet" && !adminApp) return "courses";
  return notification.section;
}

function isSectionCurrentlyOpen(sectionId) {
  return Boolean(document.querySelector(`[data-student-section="${sectionId}"]`)?.classList.contains("active"));
}

function notificationMatchesAudience(notification) {
  if (!notification?.audience) return false;

  const role = getCurrentNotificationRole();
  const audience = notification.audience;
  if (audience.role !== role) return false;

  if (role === "admin") return true;
  if (audience.studentId && audience.studentId !== currentStudent.id) return false;
  if (audience.classroom && !isVisibleForSelectedClassroom({ classroom: audience.classroom })) return false;
  if (notification.courseId) {
    const course = getCourseById(notification.courseId);
    if (course && !isCourseJoined(course)) return false;
  }

  return true;
}

function getVisibleNotifications() {
  const readIds = new Set(getReadNotificationIds());
  return getNotifications()
    .filter(notificationMatchesAudience)
    .map((notification) => ({ ...notification, unread: !readIds.has(notification.id) }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function addNotification(notification) {
  const createdAt = notification.createdAt || new Date().toISOString();
  const notifications = getNotifications();
  notifications.unshift({
    id: notification.id || `notification-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt,
    ...notification,
    createdAt
  });
  saveNotifications(notifications);
  renderNotificationCenter();
}

function markNotificationsRead(filterFn, options = {}) {
  const visibleNotifications = getVisibleNotifications();
  const matchingIds = visibleNotifications.filter(filterFn).map((notification) => notification.id);
  if (!matchingIds.length) return false;

  const currentIds = getReadNotificationIds();
  const nextIds = Array.from(new Set([...currentIds, ...matchingIds]));
  if (nextIds.length === currentIds.length) return false;

  saveReadNotificationIds(nextIds);
  if (options.render !== false) renderNotificationCenter();
  return true;
}

function markNotificationsReadBySection(sectionId, options = {}) {
  return markNotificationsRead((notification) => getNotificationSectionId(notification) === sectionId, options);
}

function getUnreadNotificationCount(sectionId, context = {}) {
  return getVisibleNotifications().filter((notification) => {
    if (!notification.unread) return false;
    if (sectionId && getNotificationSectionId(notification) !== sectionId) return false;
    if (context.classroom && notification.classroom !== context.classroom) return false;
    if (context.studentId && notification.studentId !== context.studentId) return false;
    return true;
  }).length;
}

function createNotificationMessage(notification) {
  const classroom = getClassroomTitle(notification.classroom || notification.audience?.classroom);
  const pieces = [];
  if (classroom && classroom !== "All Subjects") pieces.push(classroom);
  if (notification.courseId) pieces.push(getCourseTitle(notification.courseId));
  if (notification.studentName) pieces.push(notification.studentName);
  return pieces.length ? pieces.join(" - ") : "Global Techno Hub";
}

function getNotificationIcon(notification) {
  const icons = {
    announcement: "A",
    video: "V",
    assignment: "C",
    resource: "R",
    quiz: "Q",
    "course-next": "N",
    invitation: "L",
    "class-chat": "G",
    "private-message": "P"
  };
  return icons[notification.type] || "!";
}

function wrapSectionLinkLabels() {
  studentSectionLinks.forEach((link) => {
    if (link.querySelector(".nav-link-text")) return;
    const text = link.textContent.trim();
    link.textContent = "";
    link.appendChild(createTextElement("span", "nav-link-text", text));
  });
}

function updateSectionNotificationBadges() {
  wrapSectionLinkLabels();
  studentSectionLinks.forEach((link) => {
    const sectionId = link.dataset.studentSectionLink;
    const unread = getUnreadNotificationCount(sectionId);
    link.querySelector(".nav-unread-count")?.remove();
    if (!unread) return;

    const badge = createTextElement("span", "nav-unread-count", unread > 9 ? "9+" : String(unread));
    badge.setAttribute("aria-label", `${unread} unread`);
    link.appendChild(badge);
  });
}

function createNotificationItem(notification) {
  const button = document.createElement("button");
  button.className = `notification-item${notification.unread ? " unread" : ""}`;
  button.type = "button";
  button.dataset.notificationId = notification.id;
  button.dataset.notificationSection = getNotificationSectionId(notification);

  const icon = createTextElement("span", "notification-icon", getNotificationIcon(notification));
  const content = document.createElement("span");
  content.append(
    createTextElement("strong", "", notification.title || "New activity"),
    createTextElement("small", "text-secondary", notification.message || createNotificationMessage(notification)),
    createTextElement("small", "text-secondary", formatDate(notification.createdAt))
  );
  button.append(icon, content);
  return button;
}

function createNotificationSeeMore(remainingCount) {
  const footer = document.createElement("div");
  footer.className = "notification-more";

  const button = document.createElement("button");
  button.className = "notification-more-button";
  button.type = "button";
  button.dataset.notificationSeeMore = "true";
  button.textContent = `See more (${remainingCount} past notifications)`;

  footer.appendChild(button);
  return footer;
}

function renderNotificationCenter() {
  updateSectionNotificationBadges();
  if (!notificationCenter) return;

  const notifications = getVisibleNotifications();
  const unread = notifications.filter((notification) => notification.unread).length;
  notificationVisibleCount = Math.min(Math.max(notificationVisibleCount, notificationsPerPage), Math.max(notifications.length, notificationsPerPage));

  if (notificationCount) {
    notificationCount.textContent = unread > 99 ? "99+" : String(unread);
    notificationCount.classList.toggle("d-none", unread === 0);
  }

  if (!notificationList) return;
  notificationPanel?.querySelector(".notification-more")?.remove();
  notificationList.replaceChildren();

  if (!notifications.length) {
    notificationList.appendChild(createTextElement("p", "notification-empty mb-0", "No notifications yet."));
    return;
  }

  notifications.slice(0, notificationVisibleCount).forEach((notification) => {
    notificationList.appendChild(createNotificationItem(notification));
  });

  if (notifications.length > notificationVisibleCount) {
    notificationPanel?.appendChild(createNotificationSeeMore(notifications.length - notificationVisibleCount));
  }
}

function setNotificationPanelOpen(isOpen) {
  if (!notificationToggle || !notificationPanel) return;
  if (isOpen) {
    notificationVisibleCount = notificationsPerPage;
    renderNotificationCenter();
  }
  notificationToggle.classList.toggle("active", isOpen);
  notificationToggle.setAttribute("aria-expanded", String(isOpen));
  notificationPanel.classList.toggle("active", isOpen);
}

async function loadServerCourses(userId = "") {
  try {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
    const response = await fetch(getApiUrl(`/courses/all${query}`));
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "Unable to load courses.");
    serverCourses = Array.isArray(result.data) ? result.data : [];
    return serverCourses;
  } catch (error) {
    serverCourses = [];
    return serverCourses;
  }
}

function getCustomCourses() {
  return Array.isArray(serverCourses) ? serverCourses : [];
}

function saveCustomCourses(courses) {
  serverCourses = Array.isArray(courses) ? courses : [];
}

function getLatestCourseInvitation(courseId) {
  return getInvitations()
    .filter((invitation) => invitation.classroom === "all" || invitation.classroom === courseId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
}

function removeDeprecatedSubjectItems(items = []) {
  return items.filter((item) => {
    return !deprecatedSubjectIds.has(item.classroom) && !String(item.id || "").startsWith("demo-");
  });
}

function syncAssignmentSubjects() {
  if (!assignmentSubject) return;

  const currentValue = assignmentSubject.value;
  assignmentSubject.replaceChildren();

  const courses = getCustomCourses();
  if (!courses.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Create a course first";
    option.disabled = true;
    option.selected = true;
    assignmentSubject.appendChild(option);
    return;
  }

  courses.forEach((course) => {
    const option = document.createElement("option");
    option.value = course.title;
    option.textContent = course.title;
    assignmentSubject.appendChild(option);
  });

  if (courses.some((course) => course.title === currentValue)) assignmentSubject.value = currentValue;
}

function syncPostTargetSelectors() {
  [
    document.querySelector("#announcementClassroom"),
    document.querySelector("#videoClassroom"),
    document.querySelector("#invitationClassroom"),
    assignmentClassroom
  ].forEach((select) => populateSubjectTargetSelect(select, { includeAll: true }));

  populateSubjectTargetSelect(chatClassroom, { includeAll: false });
  syncAssignmentSubjects();

  if (!announcementSubject) return;

  const currentValue = announcementSubject.value;
  announcementSubject.replaceChildren();

  const courses = getCustomCourses();
  if (!courses.length) {
    const option = document.createElement("option");
    option.value = "General Reminder";
    option.textContent = "General Reminder";
    announcementSubject.appendChild(option);
    return;
  }

  courses.forEach((course) => {
    const option = document.createElement("option");
    option.value = course.title;
    option.textContent = course.title;
    announcementSubject.appendChild(option);
  });

  if (courses.some((course) => course.title === currentValue)) announcementSubject.value = currentValue;
}

function normalizeSubjectCode(value = "") {
  return String(value).trim().toUpperCase();
}

function getJoinedCourseCodes() {
  return [];
}

function saveJoinedCourseCodes(codes) {
  return codes;
}

function isCourseJoined(course) {
  if (adminApp) return true;
  return Boolean(course?.isJoined);
}

function getCourseResources() {
  return getStoredItems("gthCourseResources", []);
}

function saveCourseResources(resources) {
  return saveStoredItems("gthCourseResources", resources);
}

let serverQuizzes = [];
let serverQuizSubmissions = [];
let serverQuizExtraChances = [];
let serverCourseEnrolledStudents = {};

async function loadServerQuizzes(courseId = "") {
  if (!courseId) return [];
  try {
    const response = await fetch(getApiUrl(`/courses/${courseId}/quizzes`));
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "Unable to load quizzes.");
    serverQuizzes = Array.isArray(result.data) ? result.data : [];
    return serverQuizzes;
  } catch {
    serverQuizzes = [];
    return serverQuizzes;
  }
}

async function loadServerQuizSubmissions(courseId = "") {
  if (!courseId) return [];
  try {
    const response = await fetch(getApiUrl(`/courses/${courseId}/quiz-submissions`));
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "Unable to load quiz submissions.");
    serverQuizSubmissions = Array.isArray(result.data) ? result.data : [];
    return serverQuizSubmissions;
  } catch {
    serverQuizSubmissions = [];
    return serverQuizSubmissions;
  }
}

async function loadServerQuizExtraChances(courseId = "") {
  if (!courseId) return [];
  try {
    const response = await fetch(getApiUrl(`/courses/${courseId}/quiz-extra-chances`));
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "Unable to load extra quiz attempts.");
    serverQuizExtraChances = Array.isArray(result.data) ? result.data : [];
    return serverQuizExtraChances;
  } catch {
    serverQuizExtraChances = [];
    return serverQuizExtraChances;
  }
}

async function loadServerEnrolledStudents(courseId = "") {
  if (!courseId) return [];
  try {
    const response = await fetch(getApiUrl(`/courses/${encodeURIComponent(courseId)}/enrolled-students`));
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "Unable to load enrolled students.");
    const students = Array.isArray(result.data) ? result.data : [];
    serverCourseEnrolledStudents[courseId] = students;
    return students;
  } catch {
    serverCourseEnrolledStudents[courseId] = [];
    return [];
  }
}

function getCourseEnrolledStudents(courseId = "") {
  return Array.isArray(serverCourseEnrolledStudents[courseId]) ? serverCourseEnrolledStudents[courseId] : [];
}

function getCourseQuizzes() {
  return Array.isArray(serverQuizzes) ? serverQuizzes : [];
}

function saveCourseQuizzes(quizzes) {
  serverQuizzes = Array.isArray(quizzes) ? quizzes : [];
  return true;
}

function getCourseQuizSubmissions() {
  return Array.isArray(serverQuizSubmissions) ? serverQuizSubmissions : [];
}

function saveCourseQuizSubmissions(submissions) {
  serverQuizSubmissions = Array.isArray(submissions) ? submissions : [];
  return true;
}

function getQuizExtraChances() {
  return Array.isArray(serverQuizExtraChances) ? serverQuizExtraChances : [];
}

function saveQuizExtraChances(chances) {
  serverQuizExtraChances = Array.isArray(chances) ? chances : [];
  return true;
}

function getQuizExtraChance(quizId, studentId = currentStudent.id) {
  return getQuizExtraChances().find((chance) => chance.quizId === quizId && chance.studentId === studentId && !chance.usedAt);
}

function hasQuizExtraChance(quizId, studentId = currentStudent.id) {
  return Boolean(getQuizExtraChance(quizId, studentId));
}

async function consumeQuizExtraChance(quizId, studentId = currentStudent.id) {
  const chance = getQuizExtraChance(quizId, studentId);
  if (!chance) return;

  const updated = { ...chance, usedAt: new Date().toISOString() };
  saveQuizExtraChances(getQuizExtraChances().map((item) => {
    if (item.quizId !== quizId || item.studentId !== studentId || item.usedAt) return item;
    return updated;
  }));

  if (chance.id) {
    try {
      await fetch(getApiUrl(`/courses/${encodeURIComponent(chance.courseId || "")}/quiz-extra-chances/${encodeURIComponent(chance.id)}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usedAt: updated.usedAt })
      });
    } catch {
      // ignore update failures and keep the UI state consistent
    }
  }
}

function getCourseNextPosts() {
  return getStoredItems("gthCourseNextPosts", []);
}

function saveCourseNextPosts(posts) {
  saveStoredItems("gthCourseNextPosts", posts);
}

function readStorageFile(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve({
        name: file.name,
        size: file.size,
        type: file.type || getMimeTypeFromName(file.name),
        data: String(reader.result || "")
      });
    });
    reader.addEventListener("error", () => resolve(null));
    reader.readAsDataURL(file);
  });
}

function getMimeTypeFromName(name = "") {
  const extension = String(name).split(".").pop()?.toLowerCase();
  const types = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    txt: "text/plain",
    csv: "text/csv"
  };
  return types[extension] || "";
}

function getCourseItems(items, courseId) {
  return items
    .filter((item) => item.courseId === courseId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function renderCourseNextForm(courseId, currentNext = {}) {
  const form = document.createElement("form");
  form.className = "course-post-form vstack gap-2 mt-3";
  form.dataset.courseNextForm = courseId;

  const title = document.createElement("input");
  title.className = "form-control form-control-sm";
  title.name = "title";
  title.type = "text";
  title.placeholder = "Next up title";
  title.required = true;
  title.value = currentNext.title || "";

  const message = document.createElement("textarea");
  message.className = "form-control form-control-sm";
  message.name = "message";
  message.rows = 3;
  message.placeholder = "What should students do next?";
  message.required = true;
  message.value = currentNext.message || "";

  const button = document.createElement("button");
  button.className = "btn btn-primary btn-sm align-self-start";
  button.type = "submit";
  button.textContent = "Update Next Up";

  form.append(title, message, button);
  return form;
}

function renderCourseResourceItem(resource) {
  const item = document.createElement("details");
  item.className = "course-resource-item";
  item.dataset.resourceId = resource.id;

  const summary = document.createElement("summary");
  summary.className = "course-resource-summary";
  const summaryText = document.createElement("span");
  summaryText.append(
    createTextElement("strong", "", resource.title),
    createTextElement("small", "text-secondary d-block", resource.description || "Open to view details")
  );
  summary.append(summaryText, createTextElement("span", "badge text-bg-info", "View"));

  const content = document.createElement("div");
  content.className = "course-resource-content";
  if (resource.description) content.appendChild(createTextElement("p", "text-secondary small mb-2", resource.description));

  if (resource.file?.name || resource.link) {
    if (resource.file?.name) {
      content.appendChild(renderFileTile(resource.file, { className: "course-resource-file file-preview-tile" }));
    }

    if (resource.link) {
      const linkTile = document.createElement("div");
      linkTile.className = "course-resource-file file-preview-tile";
      const linkMeta = document.createElement("div");
      linkMeta.className = "file-preview-meta";
      linkMeta.append(
        createTextElement("span", "file-pill", isPdfPath(resource.link) ? "PDF" : "LINK"),
        createTextElement("span", "file-preview-name", resource.link),
        createTextElement("small", "text-secondary", "Shared resource link")
      );
      const linkActions = document.createElement("div");
      linkActions.className = "file-preview-actions";
      const openLink = document.createElement("button");
      openLink.className = "btn btn-outline-primary btn-sm";
      openLink.type = "button";
      openLink.dataset.courseResourceAction = "view";
      openLink.dataset.resourceId = resource.id;
      openLink.textContent = isPdfPath(resource.link) ? "Preview" : "Open";
      linkActions.appendChild(openLink);
      linkTile.append(linkMeta, linkActions);
      content.appendChild(linkTile);
    }
  }

  if (adminApp) {
    const actions = document.createElement("div");
    actions.className = "d-flex flex-wrap gap-2";
    const remove = document.createElement("button");
    remove.className = "btn btn-outline-danger btn-sm";
    remove.type = "button";
    remove.dataset.courseResourceAction = "remove";
    remove.dataset.resourceId = resource.id;
    remove.textContent = "Remove";
    actions.appendChild(remove);
    content.appendChild(actions);
  }

  item.append(summary, content);
  return item;
}

function isImagePath(value = "") {
  return /\.(apng|avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i.test(value);
}

function isPdfPath(value = "") {
  return /\.pdf(\?.*)?$/i.test(value);
}

function isVideoPath(value = "") {
  return /\.(mp4|m4v|webm|ogg|ogv|mov)(\?.*)?$/i.test(value);
}

function isTextPath(value = "") {
  return /\.(txt|csv|md|json|log)(\?.*)?$/i.test(value);
}

function canPreviewResourceFile(file = {}) {
  return Boolean(file.data) && (
    file.type?.startsWith("image/")
    || file.type?.startsWith("video/")
    || file.type === "application/pdf"
    || file.type?.startsWith("text/")
    || isImagePath(file.name)
    || isVideoPath(file.name)
    || isPdfPath(file.name)
    || isTextPath(file.name)
  );
}

function getDataUrlText(dataUrl = "") {
  const [, metadata = "", payload = ""] = String(dataUrl).match(/^data:([^,]*),(.*)$/) || [];
  if (!payload) return "";

  try {
    const text = metadata.includes(";base64") ? atob(payload) : decodeURIComponent(payload);
    return text.length > 2400 ? `${text.slice(0, 2400)}...` : text;
  } catch {
    return "";
  }
}

function getFilePreviewUrl(file = {}) {
  if (!file.data) return "";
  if (!String(file.data).startsWith("data:")) return file.data;

  const cacheKey = `${file.name || "file"}-${file.size || 0}-${file.data.length}`;
  if (fileObjectUrlStore.has(cacheKey)) return fileObjectUrlStore.get(cacheKey);

  try {
    const [meta = "", payload = ""] = file.data.split(",");
    if (!payload) return file.data;
    const mimeType = file.type || meta.match(/^data:([^;]+)/)?.[1] || "application/octet-stream";
    const binary = meta.includes(";base64") ? atob(payload) : decodeURIComponent(payload);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    const objectUrl = URL.createObjectURL(new Blob([bytes], { type: mimeType }));
    fileObjectUrlStore.set(cacheKey, objectUrl);
    return objectUrl;
  } catch {
    return file.data;
  }
}

function renderCourseResourcePreview(resource) {
  const file = resource.file;
  const link = resource.link || "";
  const preview = document.createElement("div");
  preview.className = "course-resource-preview";

  if (file?.data && (file.type?.startsWith("image/") || isImagePath(file.name))) {
    const image = document.createElement("img");
    image.src = getFilePreviewUrl(file);
    image.alt = file.name;
    preview.appendChild(image);
    return preview;
  }

  if (file?.data && (file.type?.startsWith("video/") || isVideoPath(file.name))) {
    const video = document.createElement("video");
    video.src = getFilePreviewUrl(file);
    video.controls = true;
    video.playsInline = true;
    preview.appendChild(video);
    return preview;
  }

  if (file?.data && (file.type === "application/pdf" || isPdfPath(file.name))) {
    const frame = document.createElement("iframe");
    frame.src = getFilePreviewUrl(file);
    frame.title = `${file.name} preview`;
    preview.appendChild(frame);
    return preview;
  }

  if (file?.data && (file.type?.startsWith("text/") || isTextPath(file.name))) {
    const text = document.createElement("pre");
    text.textContent = getDataUrlText(file.data) || "Text preview is not available for this file.";
    preview.appendChild(text);
    return preview;
  }

  if (link && isImagePath(link)) {
    const image = document.createElement("img");
    image.src = link;
    image.alt = resource.title;
    preview.appendChild(image);
    return preview;
  }

  if (link && isVideoPath(link)) {
    const video = document.createElement("video");
    video.src = link;
    video.controls = true;
    video.playsInline = true;
    preview.appendChild(video);
    return preview;
  }

  if (link && isPdfPath(link)) {
    const frame = document.createElement("iframe");
    frame.src = link;
    frame.title = `${resource.title} preview`;
    preview.appendChild(frame);
    return preview;
  }

  return null;
}

function renderStaticCourseResource(resource, course) {
  const item = document.createElement("details");
  item.className = "course-resource-item";

  const summary = document.createElement("summary");
  summary.className = "course-resource-summary";
  const summaryText = document.createElement("span");
  summaryText.append(
    createTextElement("strong", "", resource)
  );
  summary.append(summaryText, createTextElement("span", "badge text-bg-info", "View"));

  const content = document.createElement("div");
  content.className = "course-resource-content";
  const text = resource.toLowerCase().includes("description")
    ? course.description
    : "Details will appear here when the admin posts related material.";
  content.appendChild(createTextElement("p", "text-secondary small mb-0", text));

  item.append(summary, content);
  return item;
}

function renderCourseResourceForm(courseId) {
  const form = document.createElement("form");
  form.className = "course-post-form vstack gap-2 mt-3";
  form.dataset.courseResourceForm = courseId;

  const title = document.createElement("input");
  title.className = "form-control form-control-sm";
  title.name = "title";
  title.type = "text";
  title.placeholder = "Reviewer title";
  title.required = true;

  const file = document.createElement("input");
  file.className = "form-control form-control-sm";
  file.name = "file";
  file.type = "file";
  file.accept = ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  file.required = true;

  const button = document.createElement("button");
  button.className = "btn btn-primary btn-sm align-self-start";
  button.type = "submit";
  button.textContent = "Upload Reviewer";

  const status = document.createElement("p");
  status.className = "d-none";
  status.dataset.formStatus = "true";

  form.append(
    createTextElement("strong", "small", "Upload reviewer"),
    title,
    file,
    button,
    status
  );
  return form;
}

function getQuizSubmission(quizId, student = currentStudent) {
  return getCourseQuizSubmissions().find((submission) => submission.quizId === quizId && submission.studentId === student.id);
}

function getQuizTypeLabel(type) {
  if (type === "multiple-choice") return "Multiple Choice";
  if (type === "true-false") return "True or False";
  if (type === "matching") return "Matching Type";
  if (type === "enumeration") return "Enumeration";
  if (type === "essay") return "Essay";
  return "Modified True or False";
}

function getQuestionPoints(question) {
  const points = Number(question.points);
  return Number.isFinite(points) && points > 0 ? points : 1;
}

function formatQuizScore(value) {
  const score = Number(value);
  if (!Number.isFinite(score)) return "0";
  return Number.isInteger(score) ? String(score) : score.toFixed(2).replace(/\.?0+$/, "");
}

function getMatchingPairPoints(question) {
  const pairs = Array.isArray(question.pairs) ? question.pairs : [];
  if (!pairs.length) return 0;
  return getQuestionPoints(question) / pairs.length;
}

function getQuizTotalPoints(quiz) {
  return getQuizQuestions(quiz).reduce((total, question) => total + getQuestionPoints(question), 0);
}

function getQuizQuestions(quiz) {
  if (Array.isArray(quiz.questions) && quiz.questions.length) return quiz.questions;

  return [{
    id: `${quiz.id}-q1`,
    question: quiz.question,
    options: quiz.options || [],
    correctAnswer: quiz.correctAnswer,
    correction: quiz.correction || "",
    points: 1
  }];
}

function getQuestionType(quiz, question = {}) {
  return question.type || quiz.type || "multiple-choice";
}

function isManualGradeType(type) {
  return ["enumeration", "essay", "modified-true-false"].includes(type);
}

function isAutoGradeType(type) {
  return ["multiple-choice", "true-false", "matching"].includes(type);
}

function getManualQuestionScore(submission, question) {
  if (!submission?.manualScores || !Object.prototype.hasOwnProperty.call(submission.manualScores, question.id)) return null;
  const score = Number(submission.manualScores[question.id]);
  return Number.isFinite(score) ? Math.min(Math.max(score, 0), getQuestionPoints(question)) : null;
}

function getQuizSections(quiz = {}) {
  if (Array.isArray(quiz.sections) && quiz.sections.length) return quiz.sections;

  const questions = getQuizQuestions(quiz);
  const groups = [];
  questions.forEach((question) => {
    const sectionIndex = Number.isFinite(Number(question.sectionIndex)) ? Number(question.sectionIndex) : 0;
    if (!groups[sectionIndex]) {
      groups[sectionIndex] = {
        type: getQuestionType(quiz, question),
        questions: []
      };
    }
    groups[sectionIndex].questions.push(question);
  });

  return groups.filter(Boolean);
}

function getSubmittedAnswer(submission, question, index) {
  if (!submission) return "";
  if (submission.answers && Object.prototype.hasOwnProperty.call(submission.answers, question.id)) {
    return submission.answers[question.id];
  }
  return index === 0 ? submission.answer || "" : "";
}

function getSubmittedCorrection(submission, question, index) {
  if (!submission) return "";
  if (submission.corrections && Object.prototype.hasOwnProperty.call(submission.corrections, question.id)) {
    return submission.corrections[question.id];
  }
  return index === 0 ? submission.correction || "" : "";
}

function renderQuizImage(src, alt = "") {
  if (!src) return null;
  const image = document.createElement("img");
  image.className = "course-quiz-image";
  image.src = src;
  image.alt = alt;
  image.loading = "lazy";
  return image;
}

function renderMatchingText(text, image, alt) {
  const wrapper = document.createElement("span");
  wrapper.className = "course-matching-text";
  const quizImage = renderQuizImage(image, alt);
  if (quizImage) wrapper.appendChild(quizImage);
  wrapper.appendChild(createTextElement("span", "", text || "Untitled match"));
  return wrapper;
}

function createMatchingPairField(labelText, input) {
  const label = document.createElement("label");
  label.className = "course-matching-pair-field";
  label.append(createTextElement("span", "", labelText), input);
  return label;
}

function createMatchingPairRow(pair = {}, pairIndex = 0, key = "", activeType = "multiple-choice", totalPairs = 1) {
  const pairRow = document.createElement("details");
  pairRow.className = "course-matching-pair";
  pairRow.dataset.matchingPairRow = "true";
  if (pairIndex === 0) pairRow.open = true;

  const pairNumber = createTextElement("span", "course-matching-pair-number", String(pairIndex + 1));
  const pairSummary = document.createElement("summary");
  pairSummary.className = "course-matching-pair-summary";
  const summaryText = document.createElement("span");
  summaryText.append(
    createTextElement("strong", "", `Pair ${pairIndex + 1}`),
    createTextElement("small", "text-secondary", pair.prompt && pair.answer ? `${pair.prompt} -> ${pair.answer}` : "Item and correct match")
  );
  pairSummary.append(pairNumber, summaryText);

  const pairBody = document.createElement("div");
  pairBody.className = "course-matching-pair-body";

  const itemPanel = document.createElement("div");
  itemPanel.className = "course-matching-pair-panel";
  itemPanel.appendChild(createTextElement("strong", "", "Item"));
  const matchPanel = document.createElement("div");
  matchPanel.className = "course-matching-pair-panel";
  matchPanel.appendChild(createTextElement("strong", "", "Correct match"));

  const prompt = document.createElement("input");
  prompt.className = "form-control form-control-sm";
  prompt.name = `matchPrompt${pairIndex}-${key}`;
  prompt.type = "text";
  prompt.placeholder = `Item ${pairIndex + 1}`;
  prompt.required = activeType === "matching";
  prompt.value = pair.prompt || "";

  const promptImage = document.createElement("input");
  promptImage.className = "form-control form-control-sm";
  promptImage.name = `matchPromptImage${pairIndex}-${key}`;
  promptImage.type = "url";
  promptImage.placeholder = "Item image URL optional";
  promptImage.value = pair.promptImage || "";

  const answer = document.createElement("input");
  answer.className = "form-control form-control-sm";
  answer.name = `matchAnswer${pairIndex}-${key}`;
  answer.type = "text";
  answer.placeholder = `Correct match ${pairIndex + 1}`;
  answer.required = activeType === "matching";
  answer.value = pair.answer || "";

  const answerImage = document.createElement("input");
  answerImage.className = "form-control form-control-sm";
  answerImage.name = `matchAnswerImage${pairIndex}-${key}`;
  answerImage.type = "url";
  answerImage.placeholder = "Match image URL optional";
  answerImage.value = pair.answerImage || "";

  itemPanel.append(
    createMatchingPairField("Text", prompt),
    createMatchingPairField("Image URL (optional)", promptImage)
  );
  matchPanel.append(
    createMatchingPairField("Text", answer),
    createMatchingPairField("Image URL (optional)", answerImage)
  );

  pairBody.append(itemPanel, matchPanel);
  if (totalPairs > 1) {
    const remove = document.createElement("button");
    remove.className = "btn btn-outline-danger btn-sm course-matching-pair-remove";
    remove.type = "button";
    remove.dataset.matchingPairAction = "remove";
    remove.textContent = "Remove";
    pairBody.appendChild(remove);
  }

  pairRow.append(pairSummary, pairBody);
  return pairRow;
}

function refreshMatchingPairNumbers(container) {
  const rows = Array.from(container.querySelectorAll("[data-matching-pair-row]"));
  rows.forEach((row, index) => {
    const prompt = row.querySelector("input[name^='matchPrompt']");
    const answer = row.querySelector("input[name^='matchAnswer']");
    if (prompt) prompt.placeholder = `Item ${index + 1}`;
    if (answer) answer.placeholder = `Correct match ${index + 1}`;
    const pairNumber = row.querySelector(".course-matching-pair-number");
    if (pairNumber) pairNumber.textContent = String(index + 1);
    const pairTitle = row.querySelector(".course-matching-pair-summary strong");
    if (pairTitle) pairTitle.textContent = `Pair ${index + 1}`;
    const pairSummaryText = row.querySelector(".course-matching-pair-summary small");
    if (pairSummaryText) {
      pairSummaryText.textContent = prompt?.value && answer?.value ? `${prompt.value} -> ${answer.value}` : "Item and correct match";
    }
    let remove = row.querySelector("[data-matching-pair-action='remove']");
    if (rows.length > 1 && !remove) {
      remove = document.createElement("button");
      remove.className = "btn btn-outline-danger btn-sm course-matching-pair-remove";
      remove.type = "button";
      remove.dataset.matchingPairAction = "remove";
      remove.textContent = "Remove";
      row.querySelector(".course-matching-pair-body")?.appendChild(remove);
    } else if (rows.length === 1) {
      remove?.remove();
    }
  });

  const builderCount = container.closest(".course-matching-builder")?.querySelector(".course-matching-builder-count");
  if (builderCount) builderCount.textContent = `${rows.length} pair${rows.length === 1 ? "" : "s"} - images optional`;
}

function drawMatchingLines(board) {
  const svg = board.querySelector("[data-matching-lines]");
  if (!svg) return;
  svg.replaceChildren();
  const boardRect = board.getBoundingClientRect();
  board.querySelectorAll("[data-matching-answer]").forEach((input) => {
    if (!input.value) return;
    const left = board.querySelector(`[data-matching-left][data-pair-index='${input.dataset.pairIndex}']`);
    const right = Array.from(board.querySelectorAll("[data-matching-right]")).find((button) => button.dataset.answer === input.value);
    if (!left || !right) return;

    const leftRect = left.getBoundingClientRect();
    const rightRect = right.getBoundingClientRect();
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(leftRect.right - boardRect.left));
    line.setAttribute("y1", String(leftRect.top + leftRect.height / 2 - boardRect.top));
    line.setAttribute("x2", String(rightRect.left - boardRect.left));
    line.setAttribute("y2", String(rightRect.top + rightRect.height / 2 - boardRect.top));
    svg.appendChild(line);
  });
}

function refreshMatchingBoardState(board) {
  const selectedAnswers = Array.from(board.querySelectorAll("[data-matching-answer]"))
    .map((input) => input.value)
    .filter(Boolean);
  board.querySelectorAll("[data-matching-left]").forEach((button) => {
    const input = board.querySelector(`[data-matching-answer][data-pair-index='${button.dataset.pairIndex}']`);
    button.classList.toggle("course-matching-node-linked", Boolean(input?.value));
  });
  board.querySelectorAll("[data-matching-right]").forEach((button) => {
    button.classList.toggle("course-matching-node-linked", selectedAnswers.includes(button.dataset.answer || ""));
  });
  drawMatchingLines(board);
}

function handleMatchingSelection(target) {
  const matchingLeft = target.closest("[data-matching-left]");
  if (matchingLeft) {
    const board = matchingLeft.closest("[data-matching-board]");
    if (!board) return false;
    board.querySelectorAll("[data-matching-left]").forEach((button) => button.classList.remove("course-matching-node-active"));
    matchingLeft.classList.add("course-matching-node-active");
    board.dataset.activePairIndex = matchingLeft.dataset.pairIndex || "";
    drawMatchingLines(board);
    return true;
  }

  const matchingRight = target.closest("[data-matching-right]");
  if (matchingRight) {
    const board = matchingRight.closest("[data-matching-board]");
    if (!board || board.dataset.activePairIndex === undefined || board.dataset.activePairIndex === "") return false;
    const input = board.querySelector(`[data-matching-answer][data-pair-index='${board.dataset.activePairIndex}']`);
    if (!input) return false;
    board.querySelectorAll("[data-matching-answer]").forEach((answerInput) => {
      if (answerInput !== input && answerInput.value === matchingRight.dataset.answer) answerInput.value = "";
    });
    input.value = matchingRight.dataset.answer || "";
    board.querySelectorAll("[data-matching-left]").forEach((button) => button.classList.remove("course-matching-node-active"));
    board.dataset.activePairIndex = "";
    refreshMatchingBoardState(board);
    return true;
  }

  return false;
}

let lastMatchingPointerAt = 0;

function getShuffledMatchingAnswers(pairs = []) {
  const answers = pairs.map((pair, originalIndex) => ({
    answer: pair.answer,
    answerImage: pair.answerImage,
    originalIndex
  }));

  for (let index = answers.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [answers[index], answers[swapIndex]] = [answers[swapIndex], answers[index]];
  }

  if (answers.length > 1) {
    answers.forEach((item, index) => {
      if (item.originalIndex !== index) return;
      const swapIndex = index === answers.length - 1 ? index - 1 : index + 1;
      [answers[index], answers[swapIndex]] = [answers[swapIndex], answers[index]];
    });
  }

  return answers;
}

function createMatchingConnectBoard(question) {
  const board = document.createElement("div");
  board.className = "course-matching-connect";
  board.dataset.matchingBoard = "true";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("course-matching-lines");
  svg.dataset.matchingLines = "true";
  svg.setAttribute("aria-hidden", "true");

  const leftColumn = document.createElement("div");
  leftColumn.className = "course-matching-column";
  const rightColumn = document.createElement("div");
  rightColumn.className = "course-matching-column";

  const answers = getShuffledMatchingAnswers(question.pairs || []);

  (question.pairs || []).forEach((pair, pairIndex) => {
    const leftButton = document.createElement("button");
    leftButton.className = "course-matching-node";
    leftButton.type = "button";
    leftButton.dataset.matchingLeft = "true";
    leftButton.dataset.pairIndex = String(pairIndex);
    leftButton.append(renderMatchingText(pair.prompt, pair.promptImage, `Image for ${pair.prompt}`));

    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = `answer-${question.id}-${pairIndex}`;
    hidden.dataset.matchingAnswer = "true";
    hidden.dataset.pairIndex = String(pairIndex);
    leftColumn.append(leftButton, hidden);
  });

  answers.forEach((pair) => {
    const rightButton = document.createElement("button");
    rightButton.className = "course-matching-node";
    rightButton.type = "button";
    rightButton.dataset.matchingRight = "true";
    rightButton.dataset.answer = pair.answer;
    rightButton.append(renderMatchingText(pair.answer, pair.answerImage, `Image for ${pair.answer}`));
    rightColumn.appendChild(rightButton);
  });

  board.append(svg, leftColumn, rightColumn);
  board.querySelectorAll(".course-quiz-image").forEach((image) => {
    if (image.complete) return;
    image.addEventListener("load", () => drawMatchingLines(board), { once: true });
    image.addEventListener("error", () => drawMatchingLines(board), { once: true });
  });
  window.setTimeout(() => drawMatchingLines(board), 0);
  return board;
}

function normalizeAnswer(value = "") {
  return String(value).trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeEnumerationAnswer(value = "") {
  return String(value)
    .split(/[\n,]+/)
    .map((part) => normalizeAnswer(part))
    .filter(Boolean)
    .sort()
    .join("|");
}

function isQuestionCorrect(quiz, question, submission, index) {
  const answer = getSubmittedAnswer(submission, question, index);
  const type = getQuestionType(quiz, question);
  if (!answer) return false;
  if (isManualGradeType(type)) return false;
  if (type === "enumeration") return normalizeEnumerationAnswer(answer) === normalizeEnumerationAnswer(question.correctAnswer);
  if (type === "essay") return false;
  if (type === "matching") {
    const pairs = question.pairs || [];
    if (!pairs.length || typeof answer !== "object") return false;
    return pairs.every((pair, pairIndex) => normalizeAnswer(answer[pairIndex]) === normalizeAnswer(pair.answer));
  }
  return answer === question.correctAnswer;
}

function getMatchingQuestionScore(question, answer) {
  const pairs = Array.isArray(question.pairs) ? question.pairs : [];
  if (!pairs.length || !answer || typeof answer !== "object") return 0;
  const pairPoints = getMatchingPairPoints(question);
  return pairs.reduce((score, pair, pairIndex) => {
    return score + (normalizeAnswer(answer[pairIndex]) === normalizeAnswer(pair.answer) ? pairPoints : 0);
  }, 0);
}

function getMatchingAnswerChoice(question, answerText = "") {
  return (question.pairs || []).find((pair) => normalizeAnswer(pair.answer) === normalizeAnswer(answerText));
}

function renderMatchingResultChoice(label, text, image, stateClass = "") {
  const choice = document.createElement("div");
  choice.className = `course-matching-result-choice${stateClass ? ` ${stateClass}` : ""}`;
  choice.append(
    createTextElement("span", "course-matching-result-label", label),
    renderMatchingText(text || "No answer", image || "", text ? `Image for ${text}` : "")
  );
  return choice;
}

function renderMatchingResultRow(question, pair, pairIndex, submittedAnswer, options = {}) {
  const submittedChoice = getMatchingAnswerChoice(question, submittedAnswer);
  const isCorrect = normalizeAnswer(submittedAnswer) === normalizeAnswer(pair.answer);
  const answerLabel = options.answerLabel || (options.adminView ? "Student picked" : "Your answer");
  const row = document.createElement("div");
  row.className = `course-matching-result-row${isCorrect ? " course-matching-result-correct" : " course-matching-result-wrong"}`;

  const header = document.createElement("div");
  header.className = "course-matching-result-header";
  header.append(
    createTextElement("span", "course-quiz-letter", String(pairIndex + 1)),
    createTextElement("strong", "", "Correct match")
  );

  const grid = document.createElement("div");
  grid.className = "course-matching-result-grid";
  grid.append(
    renderMatchingResultChoice("Item", pair.prompt, pair.promptImage),
    renderMatchingResultChoice(answerLabel, submittedAnswer || "No answer", submittedChoice?.answerImage || "", isCorrect ? "is-correct" : "is-wrong")
  );

  if (options.showCorrect) {
    grid.append(renderMatchingResultChoice("Correct answer", pair.answer, pair.answerImage, "is-correct"));
  }

  row.append(header, grid);
  return row;
}

function getQuizScore(quiz, submission) {
  if (!submission) return 0;
  return getQuizQuestions(quiz).reduce((total, question, index) => {
    const manualScore = getManualQuestionScore(submission, question);
    if (manualScore !== null) return total + manualScore;

    const type = getQuestionType(quiz, question);
    if (isManualGradeType(type)) return total;
    if (type === "matching") {
      return total + getMatchingQuestionScore(question, getSubmittedAnswer(submission, question, index));
    }
    if (!isAutoGradeType(type)) return total;
    return total + (isQuestionCorrect(quiz, question, submission, index) ? getQuestionPoints(question) : 0);
  }, 0);
}

function getCourseQuizScore(courseId, student = currentStudent) {
  const quizzes = getCourseItems(getCourseQuizzes(), courseId);
  return quizzes.reduce((score, quiz) => {
    const submission = getQuizSubmission(quiz.id, student);
    return {
      points: score.points + getQuizScore(quiz, submission),
      total: score.total + getQuizTotalPoints(quiz)
    };
  }, { points: 0, total: 0 });
}

function renderSubmittedAnswerForAdmin(quiz, question, submission, index) {
  const type = getQuestionType(quiz, question);
  const answer = getSubmittedAnswer(submission, question, index);
  const wrapper = document.createElement("div");
  wrapper.className = "course-answer-text";

  if (type === "matching" && typeof answer === "object") {
    wrapper.classList.add("course-grade-matching-answer");
    (question.pairs || []).forEach((pair, pairIndex) => {
      wrapper.appendChild(renderMatchingResultRow(question, pair, pairIndex, answer[pairIndex] || "", { adminView: true }));
    });
    return wrapper;
  }

  wrapper.textContent = answer || "No answer";
  const correction = getSubmittedCorrection(submission, question, index);
  if (correction) wrapper.appendChild(createTextElement("small", "text-secondary d-block mt-2", `Correction: ${correction}`));
  return wrapper;
}

function renderQuizGradingPanel(quiz) {
  const submissions = getCourseQuizSubmissions().filter((submission) => submission.quizId === quiz.id);
  const panel = document.createElement("div");
  panel.className = "course-grading-panel";

  panel.appendChild(createTextElement("h4", "h6 mb-2", "Manual grading"));
  if (!submissions.length) {
    panel.appendChild(createTextElement("p", "text-secondary small mb-0", "No student submissions yet."));
    return panel;
  }

  const questions = getQuizQuestions(quiz);
  submissions.forEach((submission) => {
    const form = document.createElement("form");
    form.className = "course-grade-submission";
    form.dataset.quizGradeForm = quiz.id;
    form.dataset.submissionId = submission.id;

    const score = getQuizScore(quiz, submission);
    form.append(
      createTextElement("strong", "", submission.studentName || "Student"),
      createTextElement("small", "text-secondary", `Current score: ${formatQuizScore(score)}/${getQuizTotalPoints(quiz)} points`)
    );

    questions.forEach((question, index) => {
      const type = getQuestionType(quiz, question);
      const row = document.createElement("div");
      row.className = "course-grade-question";
      row.append(
        createTextElement("p", "fw-bold mb-1", `${index + 1}. ${question.question}`),
        renderSubmittedAnswerForAdmin(quiz, question, submission, index)
      );

      if (isManualGradeType(type)) {
        const scoreLabel = document.createElement("label");
        scoreLabel.className = "form-label small fw-bold mb-0";
        const scoreInput = document.createElement("input");
        scoreInput.className = "form-control form-control-sm mt-1";
        scoreInput.name = `score-${question.id}`;
        scoreInput.type = "number";
        scoreInput.min = "0";
        scoreInput.max = String(getQuestionPoints(question));
        scoreInput.step = "0.01";
        scoreInput.placeholder = `0-${getQuestionPoints(question)}`;
        scoreInput.value = getManualQuestionScore(submission, question) ?? "";
        scoreLabel.append(`Manual score out of ${getQuestionPoints(question)}`, scoreInput);
        row.appendChild(scoreLabel);
      } else {
        const autoScore = type === "matching"
          ? getMatchingQuestionScore(question, getSubmittedAnswer(submission, question, index))
          : isQuestionCorrect(quiz, question, submission, index) ? getQuestionPoints(question) : 0;
        row.appendChild(createTextElement("small", "text-secondary", `Auto score: ${formatQuizScore(autoScore)}/${getQuestionPoints(question)}`));
      }

      form.appendChild(row);
    });

    const save = document.createElement("button");
    save.className = "btn btn-primary btn-sm align-self-start";
    save.type = "submit";
    save.textContent = "Save Scores";
    form.appendChild(save);
    panel.appendChild(form);
  });

  return panel;
}

function renderQuizExtraChancePanel(quiz) {
  const panel = document.createElement("div");
  panel.className = "course-extra-chance-panel";
  panel.append(
    createTextElement("h4", "h6 mb-1", "Add attempt approvals"),
    createTextElement("p", "small text-secondary mb-2", "Approve one extra quiz attempt for each student currently enrolled in this course who missed the due date.")
  );

  if (!isPastDue(quiz.dueAt)) {
    panel.appendChild(createTextElement("p", "text-secondary small mb-0", "Extra chances appear after the due time passes."));
    return panel;
  }

  const submittedStudentIds = new Set(getCourseQuizSubmissions()
    .filter((submission) => submission.quizId === quiz.id)
    .map((submission) => submission.studentId));
  const enrolledStudents = getCourseEnrolledStudents(quiz.courseId)
    .map((student) => ({
      id: student.id || student._id || student.username,
      name: student.fullName || student.username || student.name || "Student",
      classroom: student.classroom || "all"
    }))
    .filter((student) => Boolean(student.id));
  const missedStudents = enrolledStudents.filter((student) => !submittedStudentIds.has(student.id));

  if (!missedStudents.length) {
    panel.appendChild(createTextElement("p", "text-secondary small mb-0", "No missed students for this quiz."));
    return panel;
  }

  const list = document.createElement("div");
  list.className = "course-extra-chance-list";
  const studentsByClassroom = missedStudents.reduce((groups, student) => {
    const key = student.classroom || "all";
    groups[key] = [...(groups[key] || []), student];
    return groups;
  }, {});

  Object.entries(studentsByClassroom).forEach(([classroom, students], groupIndex) => {
    const group = document.createElement("details");
    group.className = "course-extra-chance-group";
    if (groupIndex === 0) group.open = true;

    const grantedCount = students.filter((student) => hasQuizExtraChance(quiz.id, student.id)).length;
    const summary = document.createElement("summary");
    summary.className = "course-extra-chance-summary";
    summary.append(
      createTextElement("strong", "", getClassroomTitle(classroom)),
      createTextElement("span", "badge text-bg-info", `${grantedCount}/${students.length} approved`)
    );

    const rows = document.createElement("div");
    rows.className = "course-extra-chance-students";
    students.forEach((student) => {
      const row = document.createElement("div");
      row.className = "course-extra-chance-row";
      const granted = hasQuizExtraChance(quiz.id, student.id);
      const info = document.createElement("div");
      info.append(
        createTextElement("strong", "", student.name),
        createTextElement("small", "text-secondary d-block", granted ? "Extra attempt approved" : "Waiting for approval")
      );

      const button = document.createElement("button");
      button.className = `btn btn-sm ${granted ? "btn-outline-success" : "btn-outline-primary"}`;
      button.type = "button";
      button.dataset.quizChanceAction = "grant";
      button.dataset.quizId = quiz.id;
      button.dataset.courseId = quiz.courseId;
      button.dataset.studentId = student.id;
      button.dataset.studentName = student.name;
      button.disabled = granted;
      button.textContent = granted ? "Approved" : "Approve attempt";
      row.append(info, button);
      rows.appendChild(row);
    });

    group.append(summary, rows);
    list.appendChild(group);
  });

  panel.appendChild(list);
  return panel;
}

function renderCourseQuizItem(quiz) {
  const item = document.createElement("details");
  item.className = "course-quiz-item";

  const questions = getQuizQuestions(quiz);
  const sectionCount = getQuizSections(quiz).length;
  const submission = getQuizSubmission(quiz.id);
  const score = getQuizScore(quiz, submission);
  const totalPoints = getQuizTotalPoints(quiz);
  const quizTypeLabel = sectionCount > 1 ? `${sectionCount} test sections` : getQuizTypeLabel(quiz.type);
  const quizExpired = isPastDue(quiz.dueAt);
  const extraChance = hasQuizExtraChance(quiz.id);
  const quizAvailable = !quizExpired || extraChance;
  const summary = document.createElement("summary");
  summary.className = "course-quiz-summary";
  const summaryText = document.createElement("span");
  summaryText.append(
    createTextElement("strong", "", quiz.title),
    createTextElement("small", "text-secondary d-block", `${quizTypeLabel} - ${questions.length} question${questions.length === 1 ? "" : "s"} - ${totalPoints} point${totalPoints === 1 ? "" : "s"}`)
  );
  if (quiz.dueAt) {
    summaryText.appendChild(createTextElement("small", quizExpired && !submission ? "text-danger d-block" : "text-secondary d-block", `Due ${formatDateTime(quiz.dueAt)}`));
  }
  const summaryBadge = createTextElement("span", `badge ${submission ? "text-bg-success" : quizAvailable ? "text-bg-info" : "text-bg-warning"}`, submission ? `${formatQuizScore(score)}/${totalPoints} points` : extraChance ? "Extra attempt" : quizExpired ? "Closed" : "Open");
  summary.append(summaryText, summaryBadge);

  const meta = document.createElement("div");
  meta.className = "d-flex flex-wrap gap-2 align-items-center mb-2";
  meta.append(
    createTextElement("span", "badge text-bg-info", quizTypeLabel),
    createTextElement("small", "text-secondary", formatDate(quiz.createdAt))
  );
  if (quiz.dueAt) {
    meta.appendChild(createTextElement("span", quizExpired ? "badge text-bg-warning" : "badge text-bg-info", `Due ${formatDateTime(quiz.dueAt)}`));
  }

  const content = document.createElement("div");
  content.className = "course-quiz-content";
  content.appendChild(meta);

  if (adminApp || submission) {
    let currentSectionIndex = null;
    questions.forEach((question, index) => {
      const type = getQuestionType(quiz, question);
      if (question.sectionIndex !== currentSectionIndex) {
        currentSectionIndex = question.sectionIndex;
        content.appendChild(createTextElement("p", "section-label mb-0", `Test ${Number(currentSectionIndex || 0) + 1} - ${getQuizTypeLabel(type)}`));
      }
      const questionBlock = document.createElement("div");
      questionBlock.className = "course-quiz-question";
      questionBlock.appendChild(createTextElement("p", "fw-bold mb-2", `${index + 1}. ${question.question}`));
      const gradingHint = isManualGradeType(type)
        ? "Admin will grade this manually"
        : "Auto-graded on submission";
      questionBlock.appendChild(createTextElement("small", "text-secondary mb-2", `${getQuestionPoints(question)} point${getQuestionPoints(question) === 1 ? "" : "s"} • ${gradingHint}`));

      const options = document.createElement("div");
      options.className = "course-quiz-options mb-2";
      if (type === "enumeration" || type === "essay") {
        const submittedText = getSubmittedAnswer(submission, question, index);
        if (submittedText) {
          questionBlock.appendChild(createTextElement("p", "course-answer-text mb-2", submittedText));
        }
      } else if (type === "matching") {
        const submittedPairs = getSubmittedAnswer(submission, question, index) || {};
        const matchingScore = getMatchingQuestionScore(question, submittedPairs);
        (question.pairs || []).forEach((pair, pairIndex) => {
          const answer = submission ? submittedPairs[pairIndex] || "" : pair.answer;
          options.appendChild(renderMatchingResultRow(question, pair, pairIndex, answer, {
            adminView: adminApp && Boolean(submission),
            answerLabel: adminApp && !submission ? "Correct match" : undefined
          }));
        });
        questionBlock.appendChild(options);
        if (submission && !adminApp) {
          questionBlock.appendChild(createTextElement("small", "text-secondary", `Matching score: ${formatQuizScore(matchingScore)}/${getQuestionPoints(question)} points`));
        }
      } else {
        const choices = type === "multiple-choice"
          ? question.options.map((option, optionIndex) => [String.fromCharCode(65 + optionIndex), option])
          : [["True", "True"], ["False", "False"]];

        choices.forEach(([value, label]) => {
          const optionRow = document.createElement("div");
          const isCorrect = adminApp && question.correctAnswer === value;
          const isSubmitted = getSubmittedAnswer(submission, question, index) === value;
          optionRow.className = `course-quiz-option${isCorrect ? " course-quiz-option-correct" : ""}${isSubmitted ? " course-quiz-option-selected" : ""}`;
          optionRow.append(
            createTextElement("span", "course-quiz-letter", value),
            createTextElement("span", "", label)
          );
          options.appendChild(optionRow);
        });

        questionBlock.appendChild(options);
      }
      if (adminApp && type !== "matching") {
        const keyText = type === "matching"
          ? (question.pairs || []).map((pair) => `${pair.prompt} = ${pair.answer}`).join("; ")
          : type === "essay"
            ? question.correctAnswer || "Essay answer guide"
            : question.correctAnswer;
        questionBlock.appendChild(createTextElement("p", "small text-secondary mb-0", `Answer key: ${keyText}${question.correction ? ` - ${question.correction}` : ""}`));
      }
      content.appendChild(questionBlock);
    });
  }

  if (adminApp) {
    content.appendChild(renderQuizGradingPanel(quiz));
    content.appendChild(renderQuizExtraChancePanel(quiz));

    const actions = document.createElement("div");
    actions.className = "d-flex flex-wrap gap-2";
    const edit = document.createElement("button");
    edit.className = "btn btn-outline-primary btn-sm";
    edit.type = "button";
    edit.dataset.courseQuizAction = "edit";
    edit.dataset.quizId = quiz.id;
    edit.textContent = "Edit";

    const remove = document.createElement("button");
    remove.className = "btn btn-outline-danger btn-sm";
    remove.type = "button";
    remove.dataset.courseQuizAction = "remove";
    remove.dataset.quizId = quiz.id;
    remove.textContent = "Remove";
    actions.append(edit, remove);
    content.appendChild(actions);
  } else {
    if (submission) {
      const result = document.createElement("div");
      result.className = "course-quiz-result";
      result.append(
        createTextElement("span", "badge text-bg-success", `Score: ${formatQuizScore(score)}/${totalPoints} points`),
        createTextElement("small", "text-secondary", "Submitted answers are highlighted above.")
      );
      content.appendChild(result);
    } else if (!quizAvailable) {
      const closed = document.createElement("div");
      closed.className = "course-quiz-result";
      closed.append(
        createTextElement("span", "badge text-bg-warning", "Closed"),
        createTextElement("small", "text-secondary", `This quiz closed on ${formatDateTime(quiz.dueAt)}.`)
      );
      content.appendChild(closed);
    } else {
      const form = document.createElement("form");
      form.className = "course-quiz-answer vstack gap-2";
      form.dataset.courseQuizAnswer = quiz.id;

      let currentSectionIndex = null;
      questions.forEach((question, index) => {
        const type = getQuestionType(quiz, question);
        if (question.sectionIndex !== currentSectionIndex) {
          currentSectionIndex = question.sectionIndex;
          form.appendChild(createTextElement("p", "section-label mb-0", `Test ${Number(currentSectionIndex || 0) + 1} - ${getQuizTypeLabel(type)}`));
        }
        const answerBlock = document.createElement("div");
        answerBlock.className = `course-quiz-question course-quiz-question-${type}`;
        answerBlock.appendChild(createTextElement("p", "fw-bold mb-2", `${index + 1}. ${question.question}`));
        answerBlock.appendChild(createTextElement("small", "text-secondary mb-2", `${getQuestionPoints(question)} point${getQuestionPoints(question) === 1 ? "" : "s"}`));

        if (type === "enumeration") {
          const answer = document.createElement("textarea");
          answer.className = "form-control form-control-sm";
          answer.name = `answer-${question.id}`;
          answer.rows = 3;
          answer.placeholder = "Write each answer separated by a comma or a new line";
          answer.required = true;
          answerBlock.appendChild(answer);
        } else if (type === "essay") {
          const answer = document.createElement("textarea");
          answer.className = "form-control form-control-sm";
          answer.name = `answer-${question.id}`;
          answer.rows = 5;
          answer.placeholder = "Write your essay answer";
          answer.required = true;
          answerBlock.appendChild(answer);
        } else if (type === "matching") {
          answerBlock.appendChild(createMatchingConnectBoard(question));
        } else {
          const choices = document.createElement("div");
          choices.className = `course-answer-choices course-answer-choices-${type}`;
          const answerChoices = type === "multiple-choice"
            ? question.options.map((option, optionIndex) => [String.fromCharCode(65 + optionIndex), option])
            : [["True", "True"], ["False", "False"]];

          answerChoices.forEach(([value, labelText]) => {
            const label = document.createElement("label");
            label.className = "course-answer-choice";

            const input = document.createElement("input");
            input.className = "visually-hidden";
            input.name = `answer-${question.id}`;
            input.type = "radio";
            input.value = value;
            input.required = true;

            label.append(
              input,
              createTextElement("span", "course-quiz-letter", value),
              createTextElement("span", "", labelText)
            );
            choices.appendChild(label);
          });
          answerBlock.appendChild(choices);
        }

        if (type === "modified-true-false") {
          const correction = document.createElement("input");
          correction.className = "form-control form-control-sm mt-2";
          correction.name = `correction-${question.id}`;
          correction.type = "text";
          correction.placeholder = "If false, write the corrected statement";
          answerBlock.appendChild(correction);
        }

        form.appendChild(answerBlock);
      });

      const button = document.createElement("button");
      button.className = "btn btn-primary btn-sm align-self-start";
      button.type = "submit";
      button.textContent = extraChance ? "Submit Extra Attempt" : "Submit Answer";
      form.appendChild(button);
      content.appendChild(form);
    }
  }

  item.append(summary, content);
  return item;
}

function createQuizCorrectChoice(name, value, text, checked = false, variant = "") {
  const label = document.createElement("label");
  label.className = `course-correct-choice${variant ? ` ${variant}` : ""}`;
  label.title = text ? `${value} ${text}` : `Mark choice ${value} as correct`;

  const input = document.createElement("input");
  input.className = "visually-hidden";
  input.name = name;
  input.type = "radio";
  input.value = value;
  input.required = true;
  input.checked = checked;

  if (variant === "course-correct-choice-bullet") {
    label.append(input, createTextElement("span", "course-correct-bullet", ""));
  } else {
    label.append(
      input,
      createTextElement("span", "course-quiz-letter", value),
      createTextElement("span", "", text)
    );
  }
  return label;
}

function createQuizQuestionRow(index, activeType = "multiple-choice", existingQuestion = {}) {
  const key = `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`;
  const row = document.createElement("div");
  row.className = "course-quiz-question-form";
  row.dataset.quizQuestionRow = "true";
  row.dataset.questionIndex = String(index);

  const header = document.createElement("div");
  header.className = "course-quiz-question-form-header";
  header.append(
    createTextElement("strong", "", `Question ${index + 1}`)
  );

  if (index > 0) {
    const remove = document.createElement("button");
    remove.className = "btn btn-outline-danger btn-sm";
    remove.type = "button";
    remove.dataset.quizQuestionAction = "remove";
    remove.textContent = "Remove";
    header.appendChild(remove);
  }

  const question = document.createElement("textarea");
  question.className = "form-control form-control-sm";
  question.name = `question-${key}`;
  question.rows = 2;
  question.placeholder = "Question";
  question.required = true;
  question.value = existingQuestion.question || "";

  const points = document.createElement("input");
  points.className = "form-control form-control-sm";
  points.name = `points-${key}`;
  points.type = "number";
  points.min = "1";
  points.step = "1";
  points.placeholder = "Points";
  points.required = true;
  points.value = existingQuestion.points || 1;

  const gradingHint = createTextElement("small", "text-secondary d-block", activeType === "multiple-choice" || activeType === "true-false"
    ? "Auto-graded with the assigned points"
    : "Admin will grade this manually");

  const mcFields = document.createElement("div");
  mcFields.className = "course-quiz-fields";
  mcFields.dataset.quizFields = "multiple-choice";
  const correctChoiceGroup = document.createElement("div");
  correctChoiceGroup.className = "course-correct-choice-group";

  ["A", "B", "C", "D"].forEach((letter) => {
    const choiceRow = document.createElement("div");
    choiceRow.className = "course-correct-choice-row";

    const option = document.createElement("input");
    option.className = "form-control form-control-sm";
    option.name = `option${letter}-${key}`;
    option.type = "text";
    option.placeholder = `Choice ${letter}`;
    option.required = activeType === "multiple-choice";
    option.value = existingQuestion.options?.[letter.charCodeAt(0) - 65] || "";

    choiceRow.append(
      createQuizCorrectChoice(`correctChoice-${key}`, letter, "Correct", (existingQuestion.correctAnswer || "A") === letter, "course-correct-choice-bullet"),
      option
    );
    correctChoiceGroup.appendChild(choiceRow);
  });
  mcFields.appendChild(correctChoiceGroup);

  const tfFields = document.createElement("div");
  tfFields.className = "course-quiz-fields d-none";
  tfFields.dataset.quizFields = "true-false";
  const tfChoices = document.createElement("div");
  tfChoices.className = "course-correct-choice-group";
  [["True", (existingQuestion.correctAnswer || "True") === "True"], ["False", existingQuestion.correctAnswer === "False"]].forEach(([value, checked]) => {
    const choiceRow = document.createElement("div");
    choiceRow.className = "course-correct-choice-row course-correct-choice-row-static";
    choiceRow.append(
      createQuizCorrectChoice(`correctTf-${key}`, value, "Correct", checked, "course-correct-choice-bullet"),
      createTextElement("span", "course-static-choice-text", value)
    );
    tfChoices.appendChild(choiceRow);
  });
  tfFields.appendChild(tfChoices);

  const modifiedFields = document.createElement("div");
  modifiedFields.className = "course-quiz-fields d-none";
  modifiedFields.dataset.quizFields = "modified-true-false";
  const modifiedChoices = document.createElement("div");
  modifiedChoices.className = "course-correct-choice-group";
  [["True", (existingQuestion.correctAnswer || "True") === "True"], ["False", existingQuestion.correctAnswer === "False"]].forEach(([value, checked]) => {
    const choiceRow = document.createElement("div");
    choiceRow.className = "course-correct-choice-row course-correct-choice-row-static";
    choiceRow.append(
      createQuizCorrectChoice(`correctModified-${key}`, value, "Correct", checked, "course-correct-choice-bullet"),
      createTextElement("span", "course-static-choice-text", value)
    );
    modifiedChoices.appendChild(choiceRow);
  });
  const correction = document.createElement("input");
  correction.className = "form-control form-control-sm mt-2";
  correction.name = `correction-${key}`;
  correction.type = "text";
  correction.placeholder = "Correction if the answer is false";
  correction.value = existingQuestion.correction || "";
  modifiedFields.append(modifiedChoices, correction);

  const matchingFields = document.createElement("div");
  matchingFields.className = "course-quiz-fields d-none";
  matchingFields.dataset.quizFields = "matching";
  const matchingShell = document.createElement("details");
  matchingShell.className = "course-matching-builder";
  matchingShell.open = true;
  const matchingSummary = document.createElement("summary");
  matchingSummary.className = "course-matching-builder-summary";
  const matchingHelp = document.createElement("div");
  matchingHelp.className = "course-matching-builder-note";
  const pairs = existingQuestion.pairs?.length ? existingQuestion.pairs : [{}, {}, {}, {}];
  matchingHelp.append(
    createTextElement("strong", "", "Matching pairs"),
    createTextElement("span", "course-matching-builder-count", `${pairs.length} pair${pairs.length === 1 ? "" : "s"} - images optional`)
  );
  matchingSummary.appendChild(matchingHelp);
  const matchingPairs = document.createElement("div");
  matchingPairs.className = "course-matching-pair-list";
  matchingPairs.dataset.matchingPairList = "true";
  pairs.forEach((pair, pairIndex) => {
    matchingPairs.appendChild(createMatchingPairRow(pair, pairIndex, key, activeType, pairs.length));
  });
  const addPair = document.createElement("button");
  addPair.className = "btn btn-outline-primary btn-sm align-self-start";
  addPair.type = "button";
  addPair.dataset.matchingPairAction = "add";
  addPair.textContent = "Add Matching Item";
  matchingShell.append(matchingSummary, matchingPairs, addPair);
  matchingFields.appendChild(matchingShell);

  const enumerationFields = document.createElement("div");
  enumerationFields.className = "course-quiz-fields d-none";
  enumerationFields.dataset.quizFields = "enumeration";
  const enumerationAnswer = document.createElement("textarea");
  enumerationAnswer.className = "form-control form-control-sm";
  enumerationAnswer.name = `enumerationAnswer-${key}`;
  enumerationAnswer.rows = 3;
  enumerationAnswer.placeholder = "Correct answers separated by commas or new lines";
  enumerationAnswer.required = activeType === "enumeration";
  enumerationAnswer.value = activeType === "enumeration" ? existingQuestion.correctAnswer || "" : "";
  enumerationFields.appendChild(enumerationAnswer);

  const essayFields = document.createElement("div");
  essayFields.className = "course-quiz-fields d-none";
  essayFields.dataset.quizFields = "essay";
  const essayGuide = document.createElement("textarea");
  essayGuide.className = "form-control form-control-sm";
  essayGuide.name = `essayGuide-${key}`;
  essayGuide.rows = 3;
  essayGuide.placeholder = "Essay answer guide or rubric";
  essayGuide.value = activeType === "essay" ? existingQuestion.correctAnswer || "" : "";
  essayFields.appendChild(essayGuide);

  row.append(header, question, points, gradingHint, mcFields, tfFields, modifiedFields, matchingFields, enumerationFields, essayFields);
  updateQuizQuestionRowType(row, activeType);
  return row;
}

function updateQuizQuestionRowType(row, type) {
  row.querySelectorAll("[data-quiz-fields]").forEach((group) => {
    const isActive = group.dataset.quizFields === type;
    group.classList.toggle("d-none", !isActive);
    group.querySelectorAll("input, textarea, select").forEach((field) => {
      const isCorrection = field.name.startsWith("correction-");
      const isEssayGuide = field.name.startsWith("essayGuide-");
      const isMatchingImage = field.name.startsWith("matchPromptImage") || field.name.startsWith("matchAnswerImage");
      field.required = isActive && !isCorrection && !isEssayGuide && !isMatchingImage;
    });
  });
}

function refreshQuizQuestionNumbers(container) {
  container.querySelectorAll("[data-quiz-question-row]").forEach((row, index) => {
    row.dataset.questionIndex = String(index);
    const label = row.querySelector(".course-quiz-question-form-header strong");
    if (label) label.textContent = `Question ${index + 1}`;
  });
}

function createQuizTestSection(index, editingSection = null) {
  const section = document.createElement("div");
  section.className = "course-test-section";
  section.dataset.quizTestSection = "true";
  section.dataset.testIndex = String(index);

  const heading = document.createElement("div");
  heading.className = "course-test-section-header";
  heading.append(
    createTextElement("strong", "", `Test ${index + 1}`),
    createTextElement("small", "text-secondary", "Choose the type for this test only")
  );

  const type = document.createElement("select");
  type.className = "form-select form-select-sm mt-1";
  type.name = `type-${index}`;
  type.dataset.quizTypeSelect = "true";
  type.required = true;
  type.append(
    new Option("Multiple Choice", "multiple-choice"),
    new Option("True or False", "true-false"),
    new Option("Modified True or False", "modified-true-false"),
    new Option("Enumeration", "enumeration"),
    new Option("Essay", "essay")
  );
  type.value = editingSection?.type === "matching" ? "multiple-choice" : editingSection?.type || "multiple-choice";
  const typeLabel = document.createElement("label");
  typeLabel.className = "form-label small fw-bold mb-0";
  typeLabel.append("Type of this test", type);

  const questions = document.createElement("div");
  questions.className = "course-quiz-question-list";
  questions.dataset.quizQuestions = "true";
  const sectionQuestions = editingSection?.questions?.length ? editingSection.questions : [{}];
  sectionQuestions.forEach((questionItem, questionIndex) => {
    questions.appendChild(createQuizQuestionRow(questionIndex, type.value, questionItem));
  });

  const addQuestion = document.createElement("button");
  addQuestion.className = "btn btn-outline-primary btn-sm align-self-start";
  addQuestion.type = "button";
  addQuestion.dataset.quizQuestionAction = "add";
  addQuestion.textContent = "Add Question to This Test";

  section.append(heading, typeLabel, questions, addQuestion);
  return section;
}

function refreshQuizTestNumbers(form) {
  form.querySelectorAll("[data-quiz-test-section]").forEach((section, index) => {
    section.dataset.testIndex = String(index);
    const heading = section.querySelector(".course-test-section-header strong");
    if (heading) heading.textContent = `Test ${index + 1}`;
  });
}

function renderCourseQuizForm(courseId, editingQuiz = null) {
  const panel = document.createElement("details");
  panel.className = "course-add-quiz course-post-form mt-3";
  if (editingQuiz) panel.open = true;

  const summary = document.createElement("summary");
  summary.className = "course-quiz-summary";
  const summaryText = document.createElement("span");
  summaryText.append(
    createTextElement("strong", "", editingQuiz ? "Edit Test" : "Add Test"),
    createTextElement("small", "text-secondary d-block", "One due date for the whole test paper")
  );
  summary.append(summaryText, createTextElement("span", "badge text-bg-info", "Admin"));

  const form = document.createElement("form");
  form.className = "course-quiz-form vstack gap-2";
  form.dataset.courseQuizForm = courseId;
  if (editingQuiz) form.dataset.quizId = editingQuiz.id;

  const paperTitle = document.createElement("input");
  paperTitle.className = "form-control form-control-sm";
  paperTitle.name = "title";
  paperTitle.type = "text";
  paperTitle.placeholder = "Test paper title";
  paperTitle.required = true;
  paperTitle.value = editingQuiz?.title || "New Test Paper";

  const paperDueAt = document.createElement("input");
  paperDueAt.className = "form-control form-control-sm mt-1";
  paperDueAt.name = "dueAt";
  paperDueAt.type = "datetime-local";
  paperDueAt.required = true;
  paperDueAt.value = editingQuiz?.dueAt || "";
  const paperDueAtLabel = document.createElement("label");
  paperDueAtLabel.className = "form-label small fw-bold mb-0";
  paperDueAtLabel.append("Due date and time", paperDueAt);

  const sections = document.createElement("div");
  sections.className = "course-test-section-list";
  sections.dataset.quizTestSections = "true";
  const editingSections = editingQuiz ? getQuizSections(editingQuiz) : [];
  (editingSections.length ? editingSections : [null]).forEach((section, index) => {
    sections.appendChild(createQuizTestSection(index, section));
  });

  const addTest = document.createElement("button");
  addTest.className = "btn btn-outline-primary btn-sm align-self-start";
  addTest.type = "button";
  addTest.dataset.quizTestAction = "add";
  addTest.textContent = "Add Test 2";

  const button = document.createElement("button");
  button.className = "btn btn-primary btn-sm align-self-start";
  button.type = "submit";
  button.textContent = editingQuiz ? "Save Test" : "Post Tests";

  form.append(paperTitle, paperDueAtLabel, sections);
  form.appendChild(addTest);
  form.appendChild(button);
  panel.append(summary, form);
  return panel;
}

function createCustomCourseWorkspace(course, index) {
  const accent = courseAccentClasses[index % courseAccentClasses.length];
  const courseId = String(course._id || course.id || `custom-course-${index}`);

  courseWorkspaces[courseId] = {
    code: String(index + 4).padStart(2, "0"),
    title: course.title,
    status: adminApp ? "Live" : "In Progress",
    progress: adminApp ? 0 : 1,
    accent,
    invitationCode: course.invitationCode || createInvitationCode(course.title, course.id),
    description: course.description,
    nextUpTitle: course.nextUpTitle || "",
    nextUpMessage: course.nextUpMessage || "",
    next: course.nextUpTitle || "Start reviewing the course materials and wait for new activities from the admin.",
    modules: [
      ["Course overview", "Open"],
      ["Learning materials", "Pending"],
      ["Assessment", "Pending"]
    ],
    resources: [],
    activity: ["Course created by admin", "Ready for learner access"]
  };
}

function createInvitationCode(title = "", fallback = "") {
  const source = `${title} ${fallback}`.trim() || "COURSE";
  const letters = source.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 4).padEnd(4, "X");
  const number = Math.abs(Array.from(source).reduce((total, character) => total + character.charCodeAt(0), 0) % 10000);
  return `${letters}-${String(number).padStart(4, "0")}`;
}

function createCourseCard(course, index) {
  const accent = courseAccentClasses[index % courseAccentClasses.length];
  const statusText = adminApp ? "Live" : "In Progress";
  const article = document.createElement("article");
  article.className = "card course-card course-card-custom";
  article.dataset.course = String(course._id || course.id);
  article.dataset.status = "live";

  const row = document.createElement("div");
  row.className = "row g-0 course-card-layout";

  const media = document.createElement("div");
  media.className = `col-md-3 course-card-media course-strip course-strip-${accent}`;

  const contentColumn = document.createElement("div");
  contentColumn.className = "col-md-9";

  const body = document.createElement("div");
  body.className = "card-body";

  const header = document.createElement("div");
  header.className = "d-flex justify-content-between gap-2 mb-2";
  
  const titleEl = createTextElement("h3", "mb-0", course.title);
  titleEl.style.fontSize = "1.1rem";
  titleEl.style.fontWeight = "750";
  titleEl.style.color = "var(--gth-ink)";
  titleEl.style.lineHeight = "1.3";
  
  const badgeEl = createTextElement("span", "badge text-bg-success", statusText);
  badgeEl.style.whiteSpace = "nowrap";
  
  header.append(titleEl, badgeEl);

  const descEl = createTextElement("p", "mb-3", course.description);
  descEl.style.fontSize = "0.95rem";
  descEl.style.color = "var(--gth-muted)";
  descEl.style.lineHeight = "1.4";
  descEl.style.margin = "0";

  const codeLabel = document.createElement("p");
  codeLabel.style.fontSize = "0.75rem";
  codeLabel.style.fontWeight = "700";
  codeLabel.style.color = "var(--gth-muted)";
  codeLabel.style.letterSpacing = "0.03em";
  codeLabel.style.margin = "0.5rem 0 0.25rem 0";
  codeLabel.style.textTransform = "uppercase";
  codeLabel.textContent = "Subject Code";
  
  const codeEl = createTextElement("p", "mb-3", course.invitationCode || createInvitationCode(course.title, course.id));
  codeEl.style.fontSize = "0.95rem";
  codeEl.style.fontWeight = "700";
  codeEl.style.color = accent === "coral" ? "var(--gth-coral)" : accent === "sand" ? "#81510b" : "var(--gth-teal)";
  codeEl.style.fontFamily = "monospace";
  codeEl.style.margin = "0 0 0.75rem 0";
  codeEl.style.letterSpacing = "0.02em";

  const progressMeta = document.createElement("div");
  progressMeta.className = "d-flex justify-content-between small mb-1";
  progressMeta.style.fontSize = "0.85rem";
  progressMeta.style.fontWeight = "600";
  progressMeta.append(
    createTextElement("span", "", "Progress"),
    createTextElement("strong", "", adminApp ? "0%" : "1%")
  );

  const progress = document.createElement("div");
  progress.className = "progress";
  progress.setAttribute("role", "progressbar");
  progress.setAttribute("aria-label", `${course.title} progress`);
  progress.setAttribute("aria-valuenow", adminApp ? "0" : "1");
  progress.setAttribute("aria-valuemin", "0");
  progress.setAttribute("aria-valuemax", "100");

  const progressBar = document.createElement("div");
  progressBar.className = `progress-bar ${accent === "coral" ? "bg-coral" : accent === "sand" ? "bg-sand" : ""}`;
  progressBar.style.width = adminApp ? "0%" : "1%";
  progress.appendChild(progressBar);

  body.append(
    header,
    descEl,
    codeLabel,
    codeEl,
    progressMeta,
    progress
  );

  if (adminApp) {
    const actions = document.createElement("div");
    actions.className = "d-flex flex-wrap gap-2 mt-3";
    const remove = document.createElement("button");
    remove.className = "btn btn-outline-danger btn-sm";
    remove.type = "button";
    remove.dataset.courseAction = "remove";
    remove.dataset.courseId = String(course._id || course.id);
    remove.textContent = "Remove";
    actions.appendChild(remove);
    body.appendChild(actions);
  }

  contentColumn.appendChild(body);
  row.append(media, contentColumn);
  article.appendChild(row);
  bindCourseCard(article);
  return article;
}

function renderCustomCourses() {
  const lists = document.querySelectorAll("#courseList");
  if (!lists.length) return;
  syncPostTargetSelectors();

  const courses = getCustomCourses().map((course) => ({
    ...course,
    id: String(course._id || course.id),
    _id: String(course._id || course.id),
    isJoined: true
  }));

  Object.keys(courseWorkspaces)
    .filter((courseId) => courseId.startsWith("custom-course-"))
    .forEach((courseId) => delete courseWorkspaces[courseId]);

  courses.forEach(createCustomCourseWorkspace);

  lists.forEach((list) => {
    list.querySelectorAll(".course-card-custom, .course-empty-state").forEach((card) => card.remove());
    const visibleCourses = courses.filter(isCourseJoined);
    if (!adminApp && !visibleCourses.length) {
      const empty = document.createElement("div");
      empty.className = "course-empty-state";
      const importButton = document.createElement("button");
      importButton.className = "btn btn-primary btn-sm";
      importButton.type = "button";
      importButton.dataset.studentImportFocus = "true";
      importButton.textContent = "Import";
      empty.append(
        createTextElement("p", "text-secondary mb-0", "Import a subject code to join a course."),
        importButton
      );
      list.appendChild(empty);
      return;
    }

    visibleCourses.forEach((course, index) => {
      list.appendChild(createCourseCard(course, index));
    });
  });

}

document.addEventListener("click", (event) => {
  const importFocus = event.target.closest("[data-student-import-focus]");
  if (!importFocus) return;

  showStudentSection("courses", { updateHash: true });
  studentImportCode?.focus();
});

studentImportForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const code = normalizeSubjectCode(studentImportCode?.value || "");
  const currentUser = JSON.parse(sessionStorage.getItem("gthCurrentUser") || "null");

  if (!currentUser?._id) {
    studentImportMessage.className = "course-import-message text-danger mb-0";
    studentImportMessage.textContent = "Please log in first.";
    return;
  }

  try {
    const response = await fetch(getApiUrl("/courses/join"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser._id, invitationCode: code })
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) throw new Error(result.message || "Unable to join course.");

    studentImportMessage.className = "course-import-message text-success mb-0";
    studentImportMessage.textContent = `Joined ${result.data?.course?.title || "the course"}.`;

    if (result.data?.user) {
      sessionStorage.setItem("gthCurrentUser", JSON.stringify(result.data.user));
    }

    studentImportForm.reset();
    await loadServerCourses(currentUser?._id || "");
    renderCustomCourses();
  } catch (error) {
    studentImportMessage.className = "course-import-message text-danger mb-0";
    studentImportMessage.textContent = error.message || "Unable to join course.";
  }
});

courseForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = courseTitle?.value.trim() || "";
  const description = courseDescription?.value.trim() || "";
  if (!title || !description) return;

  try {
    const response = await fetch(getApiUrl("/courses/add"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        status: "live"
      })
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) throw new Error(result.message || "Unable to create course.");

    courseForm.reset();
    setFormStatus(courseForm, result.data?.invitationCode ? `Course created! Share code ${result.data.invitationCode} with students.` : "Course created successfully.", "success");
    await loadServerCourses();
    renderCustomCourses();
    showStudentSection("courses", { updateHash: true });

    const modal = window.bootstrap?.Modal.getInstance(document.querySelector("#courseModal"));
    modal?.hide();
  } catch (error) {
    window.alert(error.message || "Unable to create course.");
  }
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-course-action='remove']");
  if (!button) return;

  const courseId = button.dataset.courseId;
  const courseName = button.closest(".course-card")?.querySelector("h3")?.textContent || "this course";
  
  // Show styled confirmation modal
  const modalHTML = `
    <div class="modal fade" id="deleteCourseModal" tabindex="-1" role="dialog" aria-labelledby="deleteCourseLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content" style="border: 1px solid #d8e7ec; border-radius: 0.75rem; box-shadow: 0 20px 60px rgba(12, 42, 51, 0.2);">
          <div class="modal-header" style="border-bottom: 1px solid #e4eef2; padding: 1.5rem; background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 251, 252, 0.92));">
            <div style="display: grid; gap: 0.25rem;">
              <h5 class="modal-title" id="deleteCourseLabel" style="color: var(--gth-ink); font-weight: 850; margin: 0;">Remove Course</h5>
              <small style="color: var(--gth-muted);">This action cannot be undone</small>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="padding: 1.5rem;">
            <div style="display: grid; gap: 0.75rem;">
              <div style="display: grid; gap: 0.4rem;">
                <p style="margin: 0; color: var(--gth-muted); font-size: 0.95rem;">Are you sure you want to remove</p>
                <p style="margin: 0; color: var(--gth-ink); font-weight: 750; font-size: 1.05rem; word-break: break-word;">${courseName}</p>
              </div>
              <div style="padding: 0.75rem; border-left: 3px solid var(--gth-coral); border-radius: 0.35rem; background: #fff4f6;">
                <small style="color: #7a4a51; display: block; line-height: 1.4;">All enrolled students will lose access. Course data will be permanently removed.</small>
              </div>
            </div>
          </div>
          <div class="modal-footer" style="border-top: 1px solid #e4eef2; padding: 1rem; background: rgba(248, 251, 252, 0.5);">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" style="border-color: #c8dde3;">Cancel</button>
            <button type="button" class="btn btn-danger" id="confirmDeleteBtn" style="background: var(--gth-coral); border-color: var(--gth-coral);">Remove Course</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Remove old modal and backdrop if exists
  const oldModal = document.getElementById("deleteCourseModal");
  if (oldModal) {
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.remove();
    oldModal.remove();
  }

  // Add modal to page
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Show modal and handle confirmation
  const modal = new window.bootstrap.Modal(document.getElementById("deleteCourseModal"), { 
    backdrop: true,
    keyboard: false
  });
  modal.show();

  document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
    modal.hide();
    
    try {
      const response = await fetch(getApiUrl(`/courses/delete/${courseId}`), { method: "DELETE" });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(result.message || "Unable to remove course.");

      saveCustomCourses(getCustomCourses().filter((course) => String(course._id || course.id) !== String(courseId)));
      saveCourseNextPosts(getCourseNextPosts().filter((item) => item.courseId !== courseId));
      saveCourseResources(getCourseResources().filter((item) => item.courseId !== courseId));
      saveCourseQuizzes(getCourseQuizzes().filter((item) => item.courseId !== courseId));
      saveCourseQuizSubmissions(getCourseQuizSubmissions().filter((item) => item.courseId !== courseId));
      document.querySelector(".course-workspace")?.remove();

      await loadServerCourses();
      renderCustomCourses();
    } catch (error) {
      window.alert(error.message || "Unable to remove course.");
    }

    // Clean up modal and backdrop
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.remove();
    document.getElementById("deleteCourseModal")?.remove();
    document.body.classList.remove("modal-open");
  }, { once: true });

  // Clean up modal on hide
  document.getElementById("deleteCourseModal").addEventListener("hidden.bs.modal", () => {
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.remove();
    document.getElementById("deleteCourseModal")?.remove();
    document.body.classList.remove("modal-open");
  }, { once: true });
});

function refreshOpenCourseWorkspace(courseId) {
  const activeCourseCard = document.querySelector(`.course-card-active[data-course='${courseId}']`);
  if (activeCourseCard) renderCourseWorkspace(courseId, activeCourseCard);
}

function refreshActiveCourseWorkspace() {
  const activeCourseCard = document.querySelector(".course-card-active");
  if (activeCourseCard?.dataset.course) renderCourseWorkspace(activeCourseCard.dataset.course, activeCourseCard);
}

window.addEventListener("resize", () => {
  document.querySelectorAll("[data-matching-board]").forEach(drawMatchingLines);
});

document.addEventListener("change", (event) => {
  const select = event.target.closest("[data-quiz-type-select]");
  if (!select) return;

  const section = select.closest("[data-quiz-test-section]");
  if (!section) return;

  section.querySelectorAll("[data-quiz-question-row]").forEach((row) => updateQuizQuestionRowType(row, select.value));
});

document.addEventListener("submit", async (event) => {
  const nextForm = event.target.closest("[data-course-next-form]");
  if (!nextForm) return;

  event.preventDefault();
  const courseId = nextForm.dataset.courseNextForm;
  const title = nextForm.elements.title.value.trim();
  const message = nextForm.elements.message.value.trim();
  if (!title || !message) return;

  try {
    const response = await fetch(getApiUrl(`/courses/${courseId}/next-up`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message })
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) throw new Error(result.message || "Unable to save course update.");

    await loadServerCourses(adminApp ? "" : currentUserForCourses?._id || "");
    if (courseWorkspaces[courseId]) {
      courseWorkspaces[courseId] = {
        ...courseWorkspaces[courseId],
        nextUpTitle: title,
        nextUpMessage: message,
        next: title
      };
    }
    addNotification({
      type: "course-next",
      section: "courses",
      courseId,
      audience: { role: "student" },
      title: `New course update: ${title}`,
      message: getCourseTitle(courseId),
      createdAt: new Date().toISOString()
    });
    refreshOpenCourseWorkspace(courseId);
  } catch (error) {
    window.alert(error.message || "Unable to save course update.");
  }
});

document.addEventListener("submit", async (event) => {
  const resourceForm = event.target.closest("[data-course-resource-form]");
  if (!resourceForm) return;

  event.preventDefault();
  setFormStatus(resourceForm);
  const courseId = resourceForm.dataset.courseResourceForm;
  const selectedFile = resourceForm.elements.file.files?.[0];
  const title = resourceForm.elements.title.value.trim();
  const file = await readStorageFile(selectedFile);
  if (!title || !file) {
    setFormStatus(resourceForm, "Add a reviewer title and choose a PDF or DOCX file.");
    return;
  }

  const resources = getCourseResources();
  const resource = {
    id: `course-resource-${Date.now()}`,
    courseId,
    title,
    description: "",
    link: "",
    file,
    createdAt: new Date().toISOString()
  };
  resources.unshift(resource);

  if (!saveCourseResources(resources)) {
    setFormStatus(resourceForm, "This reviewer file could not be saved. Try a smaller PDF/DOCX or remove older uploaded files first.");
    return;
  }
  addNotification({
    type: "resource",
    section: "courses",
    courseId,
    audience: { role: "student" },
    title: `New reviewer: ${title}`,
    message: getCourseTitle(courseId),
    createdAt: resource.createdAt
  });
  resourceForm.reset();
  setFormStatus(resourceForm, "Reviewer uploaded for students.", "success");
  refreshOpenCourseWorkspace(courseId);
});

document.addEventListener("submit", async (event) => {
  const gradeForm = event.target.closest("[data-quiz-grade-form]");
  if (!gradeForm) return;

  event.preventDefault();
  const quiz = getCourseQuizzes().find((item) => item.id === gradeForm.dataset.quizGradeForm);
  if (!quiz) return;

  const questions = getQuizQuestions(quiz);
  const submissions = getCourseQuizSubmissions().map((submission) => {
    if (submission.id !== gradeForm.dataset.submissionId) return submission;

    const manualScores = { ...(submission.manualScores || {}) };
    questions.forEach((question) => {
      if (!isManualGradeType(getQuestionType(quiz, question))) return;
      const field = gradeForm.querySelector(`[name='score-${question.id}']`);
      if (!field) return;
      if (field.value === "") {
        delete manualScores[question.id];
        return;
      }
      const score = Math.min(Math.max(Number(field.value), 0), getQuestionPoints(question));
      manualScores[question.id] = Number.isFinite(score) ? score : 0;
    });

    return {
      ...submission,
      manualScores,
      gradedAt: new Date().toISOString()
    };
  });

  const updatedSubmission = submissions.find((submission) => submission.id === gradeForm.dataset.submissionId);
  if (updatedSubmission) {
    try {
      const response = await fetch(getApiUrl(`/courses/${quiz.courseId}/quiz-submissions/${updatedSubmission.id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSubmission)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to grade submission.");
    } catch (error) {
      window.alert(error.message || "Unable to grade submission.");
      return;
    }
  }

  saveCourseQuizSubmissions(submissions);
  await loadServerQuizSubmissions(quiz.courseId);
  refreshOpenCourseWorkspace(quiz.courseId);
});

document.addEventListener("submit", async (event) => {
  const quizForm = event.target.closest("[data-course-quiz-form]");
  if (!quizForm) return;

  event.preventDefault();
  const courseId = quizForm.dataset.courseQuizForm;
  const existingQuizzes = getCourseQuizzes();
  const existingQuiz = existingQuizzes.find((item) => item.id === quizForm.dataset.quizId);
  const now = Date.now();
  const title = quizForm.elements.title.value.trim();
  const dueAt = quizForm.elements.dueAt.value;
  const sections = Array.from(quizForm.querySelectorAll("[data-quiz-test-section]"));
  const quizSections = [];
  const allQuestions = [];
  if (!title || !dueAt) return;

  for (const [sectionIndex, section] of sections.entries()) {
    const type = section.querySelector("[data-quiz-type-select]")?.value || "multiple-choice";
    const existingSection = existingQuiz ? getQuizSections(existingQuiz)[sectionIndex] : null;

    const questionRows = Array.from(section.querySelectorAll("[data-quiz-question-row]"));
    const questions = questionRows.map((row, index) => {
      const questionText = row.querySelector("textarea[name^='question-']")?.value.trim() || "";
      const question = {
        id: existingSection?.questions?.[index]?.id || `q-${now}-${sectionIndex}-${index}`,
        question: questionText,
        type,
        sectionIndex,
        options: [],
        correctAnswer: "",
        correction: "",
        pairs: [],
        points: Math.max(1, Number(row.querySelector("input[name^='points-']")?.value || 1))
      };

      if (type === "multiple-choice") {
        question.options = ["A", "B", "C", "D"].map((letter) => row.querySelector(`input[name^='option${letter}-']`)?.value.trim() || "");
        question.correctAnswer = row.querySelector("input[name^='correctChoice-']:checked")?.value || "A";
      } else if (type === "true-false") {
        question.correctAnswer = row.querySelector("input[name^='correctTf-']:checked")?.value || "True";
      } else if (type === "modified-true-false") {
        question.correctAnswer = row.querySelector("input[name^='correctModified-']:checked")?.value || "True";
        question.correction = row.querySelector("input[name^='correction-']")?.value.trim() || "";
      } else if (type === "matching") {
        question.pairs = Array.from(row.querySelectorAll(".course-matching-pair")).map((pairRow) => ({
          prompt: pairRow.querySelector("input[name^='matchPrompt']")?.value.trim() || "",
          promptImage: pairRow.querySelector("input[name^='matchPromptImage']")?.value.trim() || "",
          answer: pairRow.querySelector("input[name^='matchAnswer']")?.value.trim() || "",
          answerImage: pairRow.querySelector("input[name^='matchAnswerImage']")?.value.trim() || ""
        }));
        question.correctAnswer = question.pairs.map((pair) => `${pair.prompt}=${pair.answer}`).join("; ");
      } else if (type === "enumeration") {
        question.correctAnswer = row.querySelector("textarea[name^='enumerationAnswer-']")?.value.trim() || "";
      } else if (type === "essay") {
        question.correctAnswer = row.querySelector("textarea[name^='essayGuide-']")?.value.trim() || "";
      }

      return question;
    });

    if (!questions.length || questions.some((question) => !question.question)) return;
    if (questions.some((question) => !Number.isFinite(question.points) || question.points < 1)) return;
    if (type === "multiple-choice" && questions.some((question) => question.options.some((option) => !option))) return;
    if (type === "matching" && questions.some((question) => !question.pairs.length || question.pairs.some((pair) => !pair.prompt || !pair.answer))) return;
    if (type === "enumeration" && questions.some((question) => !question.correctAnswer)) return;

    quizSections.push({ type, questions });
    allQuestions.push(...questions);
  }

  const quiz = {
    id: existingQuiz?.id || `course-quiz-${now}`,
    courseId,
    type: quizSections.length > 1 ? "mixed" : quizSections[0]?.type || "multiple-choice",
    title,
    dueAt,
    createdAt: existingQuiz?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: quizSections,
    questions: allQuestions,
    question: allQuestions[0].question,
    options: allQuestions[0].options,
    correctAnswer: allQuestions[0].correctAnswer,
    correction: allQuestions[0].correction
  };

  const savedQuizzes = existingQuizzes.filter((item) => item.id !== quiz.id);
  saveCourseQuizzes([quiz, ...savedQuizzes]);
  try {
    const response = existingQuiz
      ? await fetch(getApiUrl(`/courses/${courseId}/quizzes/${quiz.id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz)
      })
      : await fetch(getApiUrl(`/courses/${courseId}/quizzes`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz)
      });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "Unable to save quiz.");
    await loadServerQuizzes(courseId);
    saveCourseQuizSubmissions(getCourseQuizSubmissions().filter((submission) => submission.quizId !== quiz.id));
    if (!existingQuiz) {
      addNotification({
        type: "quiz",
        section: "courses",
        courseId,
        audience: { role: "student" },
        title: `New test/quiz: ${title}`,
        message: `${getCourseTitle(courseId)} - due ${formatDate(dueAt)}`,
        createdAt: quiz.createdAt
      });
    }
    refreshOpenCourseWorkspace(courseId);
  } catch (error) {
    window.alert(error.message || "Unable to save quiz.");
  }
});

document.addEventListener("submit", async (event) => {
  const answerForm = event.target.closest("[data-course-quiz-answer]");
  if (!answerForm) return;

  event.preventDefault();
  const quizId = answerForm.dataset.courseQuizAnswer;
  const quiz = getCourseQuizzes().find((item) => item.id === quizId);
  if (!quiz) return;
  const extraChance = hasQuizExtraChance(quizId);
  if (isPastDue(quiz.dueAt) && !extraChance) {
    refreshOpenCourseWorkspace(quiz.courseId);
    return;
  }

  const answers = {};
  const corrections = {};
  const questions = getQuizQuestions(quiz);
  const hasAllAnswers = questions.every((question) => {
    const type = getQuestionType(quiz, question);
    let answer = answerForm.querySelector(`input[name='answer-${question.id}']:checked`)?.value || "";
    if (type === "enumeration" || type === "essay") {
      answer = answerForm.querySelector(`[name='answer-${question.id}']`)?.value.trim() || "";
    } else if (type === "matching") {
      answer = {};
      (question.pairs || []).forEach((pair, pairIndex) => {
        answer[pairIndex] = answerForm.querySelector(`[name='answer-${question.id}-${pairIndex}']`)?.value || "";
      });
    }
    answers[question.id] = answer;
    corrections[question.id] = answerForm.querySelector(`input[name='correction-${question.id}']`)?.value.trim() || "";
    return typeof answer === "object" ? Object.values(answer).every(Boolean) : Boolean(answer);
  });
  if (!hasAllAnswers) return;

  const submissions = getCourseQuizSubmissions().filter((submission) => {
    return !(submission.quizId === quizId && submission.studentId === currentStudent.id);
  });
  const submission = {
    id: `course-quiz-submission-${Date.now()}`,
    courseId: quiz.courseId,
    quizId,
    studentId: currentStudent.id,
    studentName: currentStudent.name,
    answer: answers[questions[0].id],
    answers,
    correction: corrections[questions[0].id],
    corrections,
    submittedAt: new Date().toISOString()
  };
  submissions.push(submission);

  try {
    const response = await fetch(getApiUrl(`/courses/${quiz.courseId}/quiz-submissions`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "Unable to submit quiz.");
    await loadServerQuizSubmissions(quiz.courseId);
  } catch (error) {
    window.alert(error.message || "Unable to submit quiz.");
    return;
  }

  saveCourseQuizSubmissions(submissions);
  if (extraChance) await consumeQuizExtraChance(quizId);
  refreshOpenCourseWorkspace(quiz.courseId);
});

document.addEventListener("input", (event) => {
  const pairRow = event.target.closest("[data-matching-pair-row]");
  if (!pairRow) return;
  const pairList = pairRow.closest("[data-matching-pair-list]");
  if (pairList) refreshMatchingPairNumbers(pairList);
});

document.addEventListener("pointerup", (event) => {
  if (!handleMatchingSelection(event.target)) return;
  lastMatchingPointerAt = Date.now();
  event.preventDefault();
});

document.addEventListener("click", async (event) => {
  if (Date.now() - lastMatchingPointerAt < 450 && event.target.closest("[data-matching-board]")) {
    event.preventDefault();
    return;
  }

  if (handleMatchingSelection(event.target)) {
    event.preventDefault();
    return;
  }

  const filePreviewButton = event.target.closest("[data-file-preview-id]");
  if (filePreviewButton) {
    const file = filePreviewStore.get(filePreviewButton.dataset.filePreviewId);
    if (!file?.data) return;

    event.preventDefault();
    if (openResourceModal({ title: file.name || "Attachment", file })) return;
    window.open(file.data, "_blank", "noopener");
    return;
  }

  const questionAction = event.target.closest("[data-quiz-question-action]");
  if (questionAction) {
    const section = questionAction.closest("[data-quiz-test-section]");
    const questionList = section?.querySelector("[data-quiz-questions]");
    if (!section || !questionList) return;

    if (questionAction.dataset.quizQuestionAction === "add") {
      const index = questionList.querySelectorAll("[data-quiz-question-row]").length;
      const type = section.querySelector("[data-quiz-type-select]")?.value || "multiple-choice";
      questionList.appendChild(createQuizQuestionRow(index, type));
      return;
    }

    if (questionAction.dataset.quizQuestionAction === "remove") {
      questionAction.closest("[data-quiz-question-row]")?.remove();
      refreshQuizQuestionNumbers(questionList);
      return;
    }
  }

  const testAction = event.target.closest("[data-quiz-test-action='add']");
  if (testAction) {
    const form = testAction.closest("[data-course-quiz-form]");
    const sections = form?.querySelector("[data-quiz-test-sections]");
    if (!form || !sections) return;
    const index = sections.querySelectorAll("[data-quiz-test-section]").length;
    sections.appendChild(createQuizTestSection(index));
    testAction.textContent = `Add Test ${index + 2}`;
    refreshQuizTestNumbers(form);
    return;
  }

  const matchingPairAction = event.target.closest("[data-matching-pair-action]");
  if (matchingPairAction) {
    const questionRow = matchingPairAction.closest("[data-quiz-question-row]");
    const pairList = questionRow?.querySelector("[data-matching-pair-list]");
    if (!questionRow || !pairList) return;

    if (matchingPairAction.dataset.matchingPairAction === "add") {
      const index = pairList.querySelectorAll("[data-matching-pair-row]").length;
      pairList.appendChild(createMatchingPairRow({}, index, `${Date.now()}-${index}`, "matching", index + 1));
      refreshMatchingPairNumbers(pairList);
      return;
    }

    if (matchingPairAction.dataset.matchingPairAction === "remove") {
      matchingPairAction.closest("[data-matching-pair-row]")?.remove();
      refreshMatchingPairNumbers(pairList);
      return;
    }
  }

  const copyInvite = event.target.closest("[data-copy-invite-code]");
  if (copyInvite) {
    navigator.clipboard?.writeText(copyInvite.dataset.copyInviteCode || "");
    copyInvite.textContent = "Copied";
    window.setTimeout(() => {
      copyInvite.textContent = "Copy";
    }, 1400);
    return;
  }

  const copyLiveSession = event.target.closest("[data-copy-live-session-link]");
  if (copyLiveSession) {
    navigator.clipboard?.writeText(copyLiveSession.dataset.copyLiveSessionLink || "");
    copyLiveSession.textContent = "Copied";
    window.setTimeout(() => {
      copyLiveSession.textContent = "Copy";
    }, 1400);
    return;
  }

  const resourceButton = event.target.closest("[data-course-resource-action='remove']");
  if (resourceButton) {
    const resource = getCourseResources().find((item) => item.id === resourceButton.dataset.resourceId);
    saveCourseResources(getCourseResources().filter((item) => item.id !== resourceButton.dataset.resourceId));
    if (resource) refreshOpenCourseWorkspace(resource.courseId);
    return;
  }

  const resourceViewButton = event.target.closest("[data-course-resource-action='view']");
  if (resourceViewButton) {
    const resource = getCourseResources().find((item) => item.id === resourceViewButton.dataset.resourceId);
    const resourceItem = resourceViewButton.closest(".course-resource-item");
    resourceItem?.setAttribute("open", "");

    if (openResourceModal(resource)) return;

    const preview = resourceItem?.querySelector(".course-resource-preview-shell");
    if (preview) {
      preview.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest" });
      return;
    }

    if (resource?.file?.data) {
      window.open(resource.file.data, "_blank", "noopener");
      return;
    }

    if (resource?.link) {
      window.open(resource.link, "_blank", "noopener");
    }
    return;
  }

  const chanceButton = event.target.closest("[data-quiz-chance-action='grant']");
  if (chanceButton) {
    const alreadyGranted = getQuizExtraChances().some((chance) => {
      return chance.quizId === chanceButton.dataset.quizId
        && chance.studentId === chanceButton.dataset.studentId
        && !chance.usedAt;
    });

    if (!alreadyGranted) {
      const courseId = chanceButton.dataset.courseId;
      const quizId = chanceButton.dataset.quizId;
      const studentId = chanceButton.dataset.studentId;
      const studentName = chanceButton.dataset.studentName;
      fetch(getApiUrl(`/courses/${courseId}/quiz-extra-chances`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, studentId, studentName })
      })
        .then((response) => response.json().catch(() => ({})))
        .then((result) => {
          if (!result || !result.code || result.code >= 400) return;
          return loadServerQuizExtraChances(courseId);
        })
        .finally(() => {
          refreshOpenCourseWorkspace(courseId);
        });
    }

    return;
  }

  const quizButton = event.target.closest("[data-course-quiz-action='remove']");
  const editButton = event.target.closest("[data-course-quiz-action='edit']");
  if (editButton) {
    const quiz = getCourseQuizzes().find((item) => item.id === editButton.dataset.quizId);
    if (!quiz) return;
    const existingForm = document.querySelector(`[data-course-quiz-form][data-quiz-id='${quiz.id}']`);
    if (existingForm) {
      existingForm.closest(".course-add-quiz")?.remove();
      return;
    }
    editButton.closest(".course-quiz-item")?.insertAdjacentElement("afterend", renderCourseQuizForm(quiz.courseId, quiz));
    return;
  }

  if (!quizButton) return;

  const quiz = getCourseQuizzes().find((item) => item.id === quizButton.dataset.quizId);
  if (!quiz) return;

  const confirmed = window.confirm(`Delete this quiz and remove its contents and all submitted answers for ${quiz.title}? This action cannot be undone.`);
  if (!confirmed) return;

  try {
    const response = await fetch(getApiUrl("/courses/" + quiz.courseId + "/quizzes/" + quiz.id), { method: "DELETE" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "Unable to delete quiz.");
    await loadServerQuizzes(quiz.courseId);
    await loadServerQuizSubmissions(quiz.courseId);
    await loadServerQuizExtraChances(quiz.courseId);
    refreshOpenCourseWorkspace(quiz.courseId);
  } catch (error) {
    window.alert(error.message || "Unable to delete quiz.");
  }
});

function getCurrentAuthor() {
  return adminApp ? "Admin" : "Student";
}

function isVisibleForSelectedClassroom(item) {
  if (adminApp) return true;
  if (item.classroom === "all") return true;
  if (selectedClassroom !== "all") return item.classroom === selectedClassroom;

  const course = getCustomCourses().find((customCourse) => customCourse.id === item.classroom);
  return course ? isCourseJoined(course) : item.classroom === currentStudent.classroom;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function isPastDue(value) {
  return Boolean(value) && new Date(value).getTime() <= Date.now();
}

function getAllAnnouncementComments() {
  return getStoredItems("gthAnnouncementComments", []);
}

function getAnnouncementComments(announcementId) {
  return getAllAnnouncementComments().filter((comment) => comment.announcementId === announcementId);
}

function renderAnnouncementCard(announcement, options = {}) {
  const article = document.createElement("article");
  article.className = "announcement-item";
  if (announcement.pinned) article.classList.add("announcement-pinned");

  const meta = document.createElement("div");
  meta.className = "d-flex flex-wrap gap-2 align-items-center mb-2";

  if (announcement.pinned) {
    const pinned = document.createElement("span");
    pinned.className = "badge text-bg-warning";
    pinned.textContent = "Pinned";
    meta.appendChild(pinned);
  }

  const classroom = document.createElement("span");
  classroom.className = "badge text-bg-info";
  classroom.textContent = getClassroomTitle(announcement.classroom);
  meta.appendChild(classroom);

  const time = document.createElement("small");
  time.className = "text-secondary";
  time.textContent = formatDate(announcement.createdAt);
  meta.appendChild(time);

  const toggleButton = document.createElement("button");
  toggleButton.className = "btn btn-outline-secondary btn-sm ms-auto";
  toggleButton.type = "button";
  toggleButton.dataset.announcementAction = "toggle-comments";
  toggleButton.textContent = "Minimize Comments";

  const header = document.createElement("div");
  header.className = "d-flex flex-wrap align-items-start gap-2";
  header.append(meta, toggleButton);

  const body = document.createElement("div");
  body.className = "announcement-card-body";

  const subject = document.createElement("h3");
  subject.className = "h6 mb-1";
  subject.textContent = announcement.subject;

  const message = document.createElement("p");
  message.className = "mb-0 text-secondary";
  message.textContent = announcement.message;

  body.append(subject, message);

  const comments = getAnnouncementComments(announcement.id);
  const commentsSection = document.createElement("div");
  commentsSection.className = "announcement-comments mt-3";

  const commentsTitle = document.createElement("h4");
  commentsTitle.className = "h6 mb-2";
  commentsTitle.textContent = "Comments";

  const commentsList = document.createElement("div");
  commentsList.className = "vstack gap-2 mb-2";

  if (!comments.length) {
    const empty = document.createElement("p");
    empty.className = "text-secondary small mb-0";
    empty.textContent = "No comments yet.";
    commentsList.appendChild(empty);
  } else {
    comments.forEach((comment) => {
      const commentItem = document.createElement("div");
      commentItem.className = "announcement-comment";

      const commentMeta = document.createElement("small");
      commentMeta.className = "text-secondary d-block";
      commentMeta.textContent = `${comment.author} - ${formatDate(comment.createdAt)}`;

      const commentText = document.createElement("p");
      commentText.className = "mb-0";
      commentText.textContent = comment.text;

      commentItem.append(commentMeta, commentText);
      commentsList.appendChild(commentItem);
    });
  }

  const commentForm = document.createElement("form");
  commentForm.className = "announcement-comment-form d-flex gap-2";
  commentForm.dataset.announcementCommentForm = announcement.id;

  const commentLabel = document.createElement("label");
  commentLabel.className = "visually-hidden";
  commentLabel.setAttribute("for", `comment-${announcement.id}`);
  commentLabel.textContent = "Comment";

  const commentInput = document.createElement("input");
  commentInput.className = "form-control form-control-sm";
  commentInput.id = `comment-${announcement.id}`;
  commentInput.name = "comment";
  commentInput.type = "text";
  commentInput.placeholder = "Write a comment";
  commentInput.required = true;

  const commentButton = document.createElement("button");
  commentButton.className = "btn btn-primary btn-sm";
  commentButton.type = "submit";
  commentButton.textContent = "Comment";

  commentForm.append(commentLabel, commentInput, commentButton);
  commentsSection.append(commentsTitle, commentsList, commentForm);
  body.appendChild(commentsSection);

  if (options.admin) {
    const actions = document.createElement("div");
    actions.className = "d-flex flex-wrap gap-2 mt-3";

    const pinButton = document.createElement("button");
    pinButton.className = "btn btn-outline-secondary btn-sm";
    pinButton.type = "button";
    pinButton.dataset.announcementAction = "toggle-pin";
    pinButton.dataset.announcementId = announcement.id;
    pinButton.textContent = announcement.pinned ? "Remove Pin" : "Pin";

    const removeButton = document.createElement("button");
    removeButton.className = "btn btn-outline-danger btn-sm";
    removeButton.type = "button";
    removeButton.dataset.announcementAction = "remove";
    removeButton.dataset.announcementId = announcement.id;
    removeButton.textContent = "Remove";

    actions.append(pinButton, removeButton);
    body.appendChild(actions);
  }

  article.append(header, body);
  return article;
}

function getAnnouncements() {
  const stored = getStoredItems("gthAnnouncements", null);
  if (stored) {
    const cleaned = removeDeprecatedSubjectItems(stored);
    if (cleaned.length !== stored.length) saveStoredItems("gthAnnouncements", cleaned);
    return cleaned;
  }

  saveStoredItems("gthAnnouncements", demoAnnouncements);
  return demoAnnouncements;
}

function renderAnnouncements() {
  const announcements = getAnnouncements().sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (adminAnnouncements) {
    adminAnnouncements.replaceChildren();
    announcements.forEach((announcement) => {
      adminAnnouncements.appendChild(renderAnnouncementCard(announcement, { admin: true }));
    });

    observeMotionElements(adminAnnouncements);
  }

  if (studentAnnouncements) {
    const classroomAnnouncements = announcements.filter(isVisibleForSelectedClassroom);

    studentAnnouncements.replaceChildren();
    if (studentAnnouncementClass) studentAnnouncementClass.textContent = selectedClassroomTitle;

    if (!classroomAnnouncements.length) {
      const empty = document.createElement("p");
      empty.className = "text-secondary mb-0";
      empty.textContent = "No announcements for this classroom yet.";
      studentAnnouncements.appendChild(empty);
      return;
    }

    classroomAnnouncements.forEach((announcement) => {
      studentAnnouncements.appendChild(renderAnnouncementCard(announcement));
    });

    observeMotionElements(studentAnnouncements);
  }
}

announcementForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const announcements = getAnnouncements();
  const announcement = {
    id: `announcement-${Date.now()}`,
    classroom: document.querySelector("#announcementClassroom").value,
    subject: document.querySelector("#announcementSubject").value,
    message: document.querySelector("#announcementMessage").value.trim(),
    pinned: document.querySelector("#announcementPinned").checked,
    createdAt: new Date().toISOString()
  };

  if (!announcement.message) return;

  announcements.unshift(announcement);
  saveStoredItems("gthAnnouncements", announcements);
  addNotification({
    type: "announcement",
    section: "announcements",
    classroom: announcement.classroom,
    audience: { role: "student", classroom: announcement.classroom },
    title: `New announcement: ${announcement.subject}`,
    message: announcement.message,
    createdAt: announcement.createdAt
  });
  announcementForm.reset();
  renderAnnouncements();
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-announcement-comment-form]");
  if (!form) return;

  event.preventDefault();

  const input = form.querySelector("input[name='comment']");
  const text = input.value.trim();
  if (!text) return;

  const comments = getAllAnnouncementComments();
  comments.push({
    id: `announcement-comment-${Date.now()}`,
    announcementId: form.dataset.announcementCommentForm,
    author: getCurrentAuthor(),
    text,
    createdAt: new Date().toISOString()
  });

  saveStoredItems("gthAnnouncementComments", comments);
  input.value = "";
  renderAnnouncements();
});

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-announcement-action]");
  if (!actionButton) return;

  if (actionButton.dataset.announcementAction === "toggle-comments") {
    const comments = actionButton.closest(".announcement-item")?.querySelector(".announcement-comments");
    if (!comments) return;

    comments.classList.toggle("announcement-comments-collapsed");
    actionButton.textContent = comments.classList.contains("announcement-comments-collapsed") ? "Open Comments" : "Minimize Comments";
    return;
  }

  const announcements = getAnnouncements();
  const announcementId = actionButton.dataset.announcementId;

  if (actionButton.dataset.announcementAction === "remove") {
    saveStoredItems("gthAnnouncements", announcements.filter((item) => item.id !== announcementId));
    saveStoredItems("gthAnnouncementComments", getAllAnnouncementComments().filter((item) => item.announcementId !== announcementId));
    renderAnnouncements();
    return;
  }

  if (actionButton.dataset.announcementAction === "toggle-pin") {
    const updatedAnnouncements = announcements.map((item) => {
      if (item.id !== announcementId) return item;
      return { ...item, pinned: !item.pinned };
    });

    saveStoredItems("gthAnnouncements", updatedAnnouncements);
    renderAnnouncements();
  }
});

function getVideos() {
  const stored = getStoredItems("gthVideos", null);
  if (stored) {
    const cleaned = removeDeprecatedSubjectItems(stored);
    if (cleaned.length !== stored.length) saveStoredItems("gthVideos", cleaned);
    return cleaned;
  }

  saveStoredItems("gthVideos", demoVideos);
  return demoVideos;
}

function extractDriveId(url) {
  try {
    const parsedUrl = new URL(url);
    if (!parsedUrl.hostname.includes("drive.google.com")) return "";

    const fileMatch = parsedUrl.pathname.match(/\/file\/d\/([^/]+)/);
    if (fileMatch) return fileMatch[1];

    const openId = parsedUrl.searchParams.get("id");
    return openId || "";
  } catch {
    return "";
  }
}

function getVideoSource(url) {
  if (!url) return null;

  const driveId = extractDriveId(url);
  if (driveId) {
    return {
      provider: "drive",
      providerLabel: "Google Drive",
      sourceId: driveId,
      embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
      thumbnailUrl: ""
    };
  }

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("mail.google.com") || parsedUrl.hostname.includes("gmail.com")) {
      return {
        provider: "gmail",
        providerLabel: "Gmail Link",
        sourceId: parsedUrl.href,
        embedUrl: "",
        thumbnailUrl: ""
      };
    }
  } catch {
    return null;
  }

  return {
    provider: "link",
    providerLabel: "Shared Link",
    sourceId: url,
    embedUrl: "",
    thumbnailUrl: ""
  };
}

function getSavedVideoSource(video) {
  if (!video) return null;
  if (video.file?.data) {
    return {
      ...video,
      provider: "upload",
      providerLabel: "Uploaded Video",
      embedUrl: video.file.data,
      thumbnailUrl: ""
    };
  }
  if (video.provider && video.embedUrl) return video;

  const source = getVideoSource(video.url);
  if (source) return { ...video, ...source };

  return video;
}

function getCourseVideos(courseId) {
  return getVideos()
    .filter((video) => video.classroom === "all" || video.classroom === courseId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function createVideoPlaceholder(providerLabel = "Video") {
  const placeholder = document.createElement("div");
  placeholder.className = "video-thumb video-thumb-placeholder";
  placeholder.append(
    createTextElement("span", "", "VIDEO"),
    createTextElement("strong", "", providerLabel)
  );
  return placeholder;
}

function showVideoModal() {
  if (!videoModal) return false;

  if (window.bootstrap?.Modal) {
    bootstrap.Modal.getOrCreateInstance(videoModal).show();
    return true;
  }

  videoModal.classList.add("show");
  videoModal.removeAttribute("aria-hidden");
  videoModal.setAttribute("aria-modal", "true");
  videoModal.setAttribute("role", "dialog");
  videoModal.style.display = "block";
  document.body.classList.add("modal-open");

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop fade show video-modal-backdrop";
  backdrop.dataset.videoModalBackdrop = "true";
  document.body.appendChild(backdrop);

  return true;
}

function clearVideoModalMedia() {
  if (videoModalFrame) {
    videoModalFrame.src = "";
    videoModalFrame.srcdoc = "";
    videoModalFrame.classList.remove("d-none");
  }
  if (videoModalPlayer) {
    videoModalPlayer.pause();
    videoModalPlayer.removeAttribute("src");
    videoModalPlayer.load();
    videoModalPlayer.classList.add("d-none");
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function setModalFallback(title, message, action = null) {
  if (!videoModalFrame) return;

  const actionMarkup = action
    ? `<a class="btn btn-primary btn-sm" href="${escapeHtml(action.href)}" ${action.download ? `download="${escapeHtml(action.download)}"` : 'target="_blank" rel="noopener"'}>${escapeHtml(action.label)}</a>`
    : "";
  videoModalFrame.srcdoc = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            color: #12333b;
            background: #f8fbfc;
          }
          main {
            max-width: 34rem;
            padding: 2rem;
            text-align: center;
          }
          h1 {
            margin: 0 0 0.75rem;
            font-size: 1.2rem;
          }
          p {
            margin: 0 0 1.25rem;
            color: #5f7279;
            line-height: 1.5;
          }
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 2.25rem;
            padding: 0.45rem 0.8rem;
            border-radius: 0.5rem;
            color: #fff;
            background: #087f9b;
            font-weight: 750;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(message)}</p>
          ${actionMarkup}
        </main>
      </body>
    </html>`;
  videoModalFrame.classList.remove("d-none");
  videoModalPlayer?.classList.add("d-none");
}

function openResourceModal(resource) {
  if (!resource || !videoModal) return false;

  clearVideoModalMedia();
  if (videoModalLabel) videoModalLabel.textContent = resource.title || resource.file?.name || "Learning Resource";

  const file = resource.file;
  const link = resource.link || "";

  if (file?.data && (file.type?.startsWith("video/") || isVideoPath(file.name)) && videoModalPlayer) {
    videoModalPlayer.src = getFilePreviewUrl(file);
    videoModalPlayer.classList.remove("d-none");
    videoModalFrame?.classList.add("d-none");
    showVideoModal();
    return true;
  }

  if (link && isVideoPath(link) && videoModalPlayer) {
    videoModalPlayer.src = link;
    videoModalPlayer.classList.remove("d-none");
    videoModalFrame?.classList.add("d-none");
    showVideoModal();
    return true;
  }

  if (file?.data && canPreviewResourceFile(file) && videoModalFrame) {
    videoModalFrame.src = getFilePreviewUrl(file);
    videoModalFrame.classList.remove("d-none");
    videoModalPlayer?.classList.add("d-none");
    showVideoModal();
    return true;
  }

  if (link && (isPdfPath(link) || isImagePath(link) || isTextPath(link)) && videoModalFrame) {
    videoModalFrame.src = link;
    videoModalFrame.classList.remove("d-none");
    videoModalPlayer?.classList.add("d-none");
    showVideoModal();
    return true;
  }

  if (file?.data) {
    setModalFallback(
      file.name || "Resource file",
      "This file type cannot be previewed directly in the browser. You can still download it from here.",
      { href: file.data, download: file.name || "resource", label: "Download File" }
    );
    showVideoModal();
    return true;
  }

  if (link) {
    setModalFallback(
      resource.title || "Resource link",
      "This link cannot be embedded in the viewer. Open the original resource in a new tab.",
      { href: link, label: "Open Original" }
    );
    showVideoModal();
    return true;
  }

  return false;
}

function renderCourseVideoItem(video) {
  const source = getSavedVideoSource(video);
  const item = document.createElement("article");
  item.className = "course-resource-item course-video-item";
  item.dataset.videoId = video.id;

  const thumbnailWrap = document.createElement("button");
  thumbnailWrap.className = "course-video-thumb-button";
  thumbnailWrap.type = "button";
  thumbnailWrap.dataset.videoAction = "watch";
  thumbnailWrap.dataset.videoId = video.id;
  thumbnailWrap.setAttribute("aria-label", `Watch ${video.title}`);

  let thumbnail;
  if (source.thumbnailUrl) {
    thumbnail = document.createElement("img");
    thumbnail.className = "course-video-thumb";
    thumbnail.src = source.thumbnailUrl;
    thumbnail.alt = "";
  } else {
    thumbnail = createVideoPlaceholder(source.providerLabel);
    thumbnail.classList.add("course-video-thumb");
  }

  const play = document.createElement("span");
  play.className = "course-video-play";
  play.textContent = "Play";
  thumbnailWrap.append(thumbnail, play);

  const content = document.createElement("div");
  content.className = "course-video-content";
  const meta = document.createElement("div");
  meta.className = "d-flex flex-wrap gap-2 align-items-center";
  meta.append(
    createTextElement("span", "badge text-bg-info", getClassroomTitle(video.classroom)),
    createTextElement("span", "badge text-bg-light", source.providerLabel || "Video"),
    createTextElement("small", "text-secondary", formatDate(video.createdAt))
  );

  const title = createTextElement("strong", "", video.title);
  const actions = document.createElement("div");
  actions.className = "d-flex flex-wrap gap-2";

  const watchButton = document.createElement("button");
  watchButton.className = "btn btn-primary btn-sm";
  watchButton.type = "button";
  watchButton.dataset.videoAction = "watch";
  watchButton.dataset.videoId = video.id;
  watchButton.textContent = "Watch";
  actions.appendChild(watchButton);

  if (adminApp) {
    const removeButton = document.createElement("button");
    removeButton.className = "btn btn-outline-danger btn-sm";
    removeButton.type = "button";
    removeButton.dataset.videoAction = "remove";
    removeButton.dataset.videoId = video.id;
    removeButton.textContent = "Remove";
    actions.appendChild(removeButton);
  }

  content.append(meta, title, actions);
  item.append(thumbnailWrap, content);
  return item;
}

function hideVideoModal() {
  if (!videoModal) return;

  if (window.bootstrap?.Modal) {
    bootstrap.Modal.getOrCreateInstance(videoModal).hide();
    return;
  }

  clearVideoModalMedia();
  videoModal.classList.remove("show");
  videoModal.setAttribute("aria-hidden", "true");
  videoModal.removeAttribute("aria-modal");
  videoModal.removeAttribute("role");
  videoModal.style.display = "";
  document.body.classList.remove("modal-open");
  document.querySelector("[data-video-modal-backdrop='true']")?.remove();
}

function renderVideoCard(video, options = {}) {
  const source = getSavedVideoSource(video);

  if (!options.admin) {
    const wrapper = document.createElement("article");
    wrapper.className = "col-12";

    const card = document.createElement("button");
    card.className = "announcement-item video-announcement-item";
    card.dataset.videoAction = "watch";
    card.dataset.videoId = video.id;
    card.type = "button";

    let thumbnail;
    if (source.thumbnailUrl) {
      thumbnail = document.createElement("img");
      thumbnail.className = "video-announcement-thumb";
      thumbnail.src = source.thumbnailUrl;
      thumbnail.alt = "";
    } else {
      thumbnail = createVideoPlaceholder(source.providerLabel);
      thumbnail.classList.add("video-announcement-thumb");
    }

    const content = document.createElement("div");
    content.className = "video-announcement-content";

    const meta = document.createElement("div");
    meta.className = "d-flex flex-wrap gap-2 align-items-center mb-2";

    const classroom = document.createElement("span");
    classroom.className = "badge text-bg-info";
    classroom.textContent = getClassroomTitle(video.classroom);

    const time = document.createElement("small");
    time.className = "text-secondary";
    time.textContent = formatDate(video.createdAt);

    const title = document.createElement("h3");
    title.className = "h6 mb-2";
    title.textContent = video.title;

    const details = document.createElement("div");
    details.className = "video-announcement-details";
    details.append(
      createTextElement("span", "", "Recorded lesson"),
      createTextElement("span", "", source.providerLabel || "Video"),
      createTextElement("span", "", "Opens player")
    );

    const action = document.createElement("span");
    action.className = "btn btn-primary btn-sm video-announcement-action";
    action.textContent = "Watch";

    meta.append(classroom, time);
    content.append(meta, title, details);
    card.append(thumbnail, content, action);
    wrapper.appendChild(card);

    return wrapper;
  }

  const wrapper = document.createElement("article");
  wrapper.className = "col-12 col-md-6 col-xxl-4 video-card-column";

  const card = document.createElement("div");
  card.className = "card video-resource h-100";

  let thumbnail;
  if (source.thumbnailUrl) {
    thumbnail = document.createElement("img");
    thumbnail.className = "video-thumb";
    thumbnail.src = source.thumbnailUrl;
    thumbnail.alt = "";
  } else {
    thumbnail = createVideoPlaceholder(source.providerLabel);
  }

  const body = document.createElement("div");
  body.className = "card-body";

  const meta = document.createElement("div");
  meta.className = "d-flex flex-wrap gap-2 align-items-center mb-2";

  const classroom = document.createElement("span");
  classroom.className = "badge text-bg-info";
  classroom.textContent = getClassroomTitle(video.classroom);

  const time = document.createElement("small");
  time.className = "text-secondary";
  time.textContent = formatDate(video.createdAt);

  const provider = document.createElement("span");
  provider.className = "badge text-bg-light";
  provider.textContent = source.providerLabel || "Video";

  meta.append(classroom, provider, time);

  const title = document.createElement("h3");
  title.className = "h6 mb-3";
  title.textContent = video.title;

  const actions = document.createElement("div");
  actions.className = "d-flex flex-wrap gap-2";

  const watchButton = document.createElement("button");
  watchButton.className = "btn btn-primary btn-sm";
  watchButton.type = "button";
  watchButton.dataset.videoAction = "watch";
  watchButton.dataset.videoId = video.id;
  watchButton.textContent = "Watch";
  actions.appendChild(watchButton);

  if (options.admin) {
    const removeButton = document.createElement("button");
    removeButton.className = "btn btn-outline-danger btn-sm";
    removeButton.type = "button";
    removeButton.dataset.videoAction = "remove";
    removeButton.dataset.videoId = video.id;
    removeButton.textContent = "Remove";
    actions.appendChild(removeButton);
  }

  body.append(meta, title, actions);
  card.append(thumbnail, body);
  wrapper.appendChild(card);

  return wrapper;
}

function renderVideos() {
  const videos = getVideos().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (adminVideos) {
    adminVideos.replaceChildren();

    if (!videos.length) {
      const empty = document.createElement("p");
      empty.className = "col-12 text-secondary mb-0";
      empty.textContent = "No videos posted yet.";
      adminVideos.appendChild(empty);
    } else {
      videos.forEach((video) => {
        adminVideos.appendChild(renderVideoCard(video, { admin: true }));
      });
    }

    observeMotionElements(adminVideos);
  }
}

videoForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const url = document.querySelector("#videoUrl")?.value.trim() || "";
  const file = await readStorageFile(document.querySelector("#videoFile")?.files?.[0]);
  const source = file ? {
    provider: "upload",
    providerLabel: "Uploaded Video",
    sourceId: file.name,
    embedUrl: file.data,
    thumbnailUrl: ""
  } : getVideoSource(url);

  if (!source) {
    videoError?.classList.remove("d-none");
    return;
  }

  const videos = getVideos();
  const video = {
    id: `video-${Date.now()}`,
    classroom: document.querySelector("#videoClassroom").value,
    title: document.querySelector("#videoTitle").value.trim(),
    url,
    file,
    ...source,
    createdAt: new Date().toISOString()
  };
  videos.unshift(video);

  saveStoredItems("gthVideos", videos);
  addNotification({
    type: "video",
    section: "courses",
    courseId: video.classroom,
    classroom: video.classroom,
    audience: { role: "student", classroom: video.classroom },
    title: `New video: ${video.title}`,
    message: source.providerLabel || "Recorded lesson",
    createdAt: video.createdAt
  });
  videoError?.classList.add("d-none");
  videoForm.reset();
  renderVideos();
  if (video.classroom === "all") {
    refreshActiveCourseWorkspace();
  } else {
    refreshOpenCourseWorkspace(video.classroom);
  }
});

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-video-action]");
  if (!actionButton) return;

  const videos = getVideos();
  const video = getSavedVideoSource(videos.find((item) => item.id === actionButton.dataset.videoId));
  if (!video) return;

  if (actionButton.dataset.videoAction === "remove") {
    saveStoredItems("gthVideos", videos.filter((item) => item.id !== video.id));
    renderVideos();
    if (video.classroom === "all") {
      refreshActiveCourseWorkspace();
    } else {
      refreshOpenCourseWorkspace(video.classroom);
    }
    return;
  }

  if (actionButton.dataset.videoAction === "watch" && video.provider === "upload" && video.embedUrl && videoModal && videoModalPlayer) {
    clearVideoModalMedia();
    videoModalPlayer.src = video.embedUrl;
    videoModalPlayer.classList.remove("d-none");
    videoModalFrame?.classList.add("d-none");
    if (videoModalLabel) videoModalLabel.textContent = video.title;
    showVideoModal();
    return;
  }

  if (actionButton.dataset.videoAction === "watch" && video.embedUrl && videoModal && videoModalFrame) {
    clearVideoModalMedia();
    videoModalFrame.src = video.embedUrl;
    videoModalFrame.classList.remove("d-none");
    videoModalPlayer?.classList.add("d-none");
    if (videoModalLabel) videoModalLabel.textContent = video.title;
    showVideoModal();
    return;
  }

  if (actionButton.dataset.videoAction === "watch") {
    window.open(video.url, "_blank", "noopener");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;

  const actionButton = event.target.closest("[data-video-action]");
  if (!actionButton) return;

  event.preventDefault();
  actionButton.click();
});

videoModal?.addEventListener("hidden.bs.modal", () => {
  clearVideoModalMedia();
});

function getAssignments() {
  const stored = getStoredItems("gthAssignments", null);
  if (stored) {
    const cleaned = removeDeprecatedSubjectItems(stored);
    if (cleaned.length !== stored.length) saveStoredItems("gthAssignments", cleaned);
    return cleaned;
  }

  saveStoredItems("gthAssignments", demoAssignments);
  return demoAssignments;
}

function formatDueDate(value) {
  const date = value?.includes("T") ? new Date(value) : new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(name = "") {
  const extension = String(name).split(".").pop();
  return extension && extension !== name ? extension.toLowerCase() : "";
}

function getFileTypeLabel(file = {}) {
  const extension = getFileExtension(file.name);
  if (extension) return extension.slice(0, 4).toUpperCase();
  if (file.type?.startsWith("image/")) return "IMG";
  if (file.type?.startsWith("video/")) return "VID";
  if (file.type === "application/pdf") return "PDF";
  if (file.type?.startsWith("text/")) return "TXT";
  return "FILE";
}

function getFileKindLabel(file = {}) {
  const extension = getFileExtension(file.name);
  if (file.type?.startsWith("image/") || isImagePath(file.name)) return "Image file";
  if (file.type?.startsWith("video/") || isVideoPath(file.name)) return "Video file";
  if (file.type === "application/pdf" || isPdfPath(file.name)) return "PDF document";
  if (file.type?.startsWith("text/") || isTextPath(file.name)) return "Text document";
  if (["doc", "docx"].includes(extension)) return "Word document";
  if (["ppt", "pptx"].includes(extension)) return "Presentation";
  if (["xls", "xlsx", "csv"].includes(extension)) return "Spreadsheet";
  if (extension === "zip") return "Archive";
  return "Uploaded file";
}

function registerFilePreview(file) {
  if (!file?.data) return "";
  const id = `file-preview-${file.name || "file"}-${file.size || 0}-${file.data.length}`;
  filePreviewStore.set(id, file);
  return id;
}

function renderFileTile(file = {}, options = {}) {
  const item = document.createElement("div");
  item.className = `${options.className || "file-preview-tile"}${canPreviewResourceFile(file) ? " file-preview-tile-previewable" : ""}`;

  const meta = document.createElement("div");
  meta.className = "file-preview-meta";
  meta.append(
    createTextElement("span", "file-pill", getFileTypeLabel(file)),
    createTextElement("span", "file-preview-name", file.name || options.title || "Attachment"),
    createTextElement("small", "text-secondary", `${getFileKindLabel(file)}${file.size ? ` - ${formatFileSize(file.size)}` : ""}`)
  );

  const actions = document.createElement("div");
  actions.className = "file-preview-actions";

  if (file.data) {
    const previewId = registerFilePreview(file);
    const previewButton = document.createElement("button");
    previewButton.className = "btn btn-outline-primary btn-sm";
    previewButton.type = "button";
    previewButton.dataset.filePreviewId = previewId;
    previewButton.textContent = "Open";
    actions.appendChild(previewButton);

    const download = document.createElement("a");
    download.className = "btn btn-outline-secondary btn-sm";
    download.href = file.data;
    download.download = file.name || "attachment";
    download.textContent = "Download";
    actions.appendChild(download);
  } else if (options.link) {
    const link = document.createElement("a");
    link.className = "btn btn-outline-primary btn-sm";
    link.href = options.link;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Open";
    actions.appendChild(link);
  }

  item.append(meta, actions);
  return item;
}

function renderAssignmentFiles(files = []) {
  const list = document.createElement("div");
  list.className = "assignment-file-list";
  files.forEach((file) => list.appendChild(renderFileTile(file, { className: "assignment-file-link file-preview-tile" })));
  return list;
}

function getAssignmentSubmissions() {
  return getStoredItems("gthAssignmentSubmissions", []);
}

function getAssignmentClassrooms(assignment) {
  if (assignment.classroom === "all") return Object.keys(classroomStudents);
  return classroomStudents[assignment.classroom] ? [assignment.classroom] : [];
}

function getAssignmentStudents(assignment) {
  return getAssignmentClassrooms(assignment).flatMap((classroom) => {
    return classroomStudents[classroom].map((student) => ({ ...student, classroom }));
  });
}

function isSubmissionForStudent(submission, assignmentId, student) {
  if (submission.assignmentId !== assignmentId) return false;
  if (submission.studentId) return submission.studentId === student.id;
  return submission.classroom === student.classroom && student.id === (classroomStudents[student.classroom] || [])[0]?.id;
}

function getAssignmentSubmission(assignmentId, student = currentStudent) {
  return getAssignmentSubmissions().find((submission) => {
    return isSubmissionForStudent(submission, assignmentId, student);
  });
}

function getAssignmentCourseId(assignment) {
  if (assignment?.courseId) return assignment.courseId;
  const subject = String(assignment?.subject || "").trim().toLowerCase();
  if (!subject) return "";
  return Object.entries(courseWorkspaces).find(([, course]) => {
    return String(course.title || "").trim().toLowerCase() === subject;
  })?.[0] || "";
}

function refreshAssignmentSurfaces(assignmentId = "") {
  renderAssignments();
  const assignment = assignmentId ? getAssignments().find((item) => item.id === assignmentId) : null;
  const courseId = getAssignmentCourseId(assignment);
  if (courseId) refreshOpenCourseWorkspace(courseId);
}

function createGradeForm(courseId, student, options = {}) {
  const grade = getStudentGrade(courseId, student.id) || {};
  const finalGrade = calculateFinalGrade(grade);
  const gradeForm = document.createElement("form");
  gradeForm.className = options.compact ? "assignment-grade-form gradebook-grade-form" : "assignment-grade-form";
  gradeForm.dataset.studentGradeForm = courseId;
  gradeForm.dataset.studentId = student.id;
  gradeForm.dataset.studentName = student.name;
  gradeForm.dataset.classroom = student.classroom;

  [
    ["prelim", "Prelim", grade.prelim],
    ["midterm", "Midterm", grade.midterm],
    ["final", "Final", grade.final]
  ].forEach(([name, labelText, value]) => {
    const label = document.createElement("label");
    label.className = "form-label mb-0";
    label.textContent = labelText;

    const input = document.createElement("input");
    input.className = "form-control form-control-sm mt-1";
    input.name = name;
    input.type = "number";
    input.min = "0";
    input.max = "100";
    input.placeholder = "0";
    input.value = value ?? "";

    label.appendChild(input);
    gradeForm.appendChild(label);
  });

  const finalDisplay = document.createElement("div");
  finalDisplay.className = "assignment-final-grade";
  finalDisplay.append(
    createTextElement("span", "", "Final Grade"),
    createTextElement("strong", "", finalGrade === null ? "--" : `${finalGrade}%`)
  );

  const gradeButton = document.createElement("button");
  gradeButton.className = "btn btn-outline-primary btn-sm";
  gradeButton.type = "submit";
  gradeButton.textContent = "Save Grades";

  gradeForm.append(finalDisplay, gradeButton);
  return gradeForm;
}

function renderGradebook() {
  if (!adminGrades) return;

  adminGrades.replaceChildren();

  Object.entries(courseWorkspaces).forEach(([courseId, course]) => {
    const courseGrades = getAllStudents().map((student) => {
      return calculateFinalGrade(getStudentGrade(courseId, student.id) || {});
    }).filter((grade) => grade !== null);

    const courseAverage = courseGrades.length
      ? Math.round(courseGrades.reduce((total, grade) => total + grade, 0) / courseGrades.length)
      : null;

    const coursePanel = document.createElement("article");
    coursePanel.className = "gradebook-course";

    const header = document.createElement("div");
    header.className = "gradebook-course-header";
    const headerText = document.createElement("div");
    headerText.append(
      createTextElement("p", "section-label mb-1", "Course grading"),
      createTextElement("h3", "h6 mb-1", course.title),
      createTextElement("small", "text-secondary", "Record each learner's period grades. Final grade is calculated automatically.")
    );

    const average = document.createElement("div");
    average.className = "gradebook-average";
    average.append(
      createTextElement("span", "", "Course average"),
      createTextElement("strong", "", courseAverage === null ? "--" : `${courseAverage}%`)
    );

    header.append(headerText, average);

    const rows = document.createElement("div");
    rows.className = "gradebook-rows";

    getAllStudents().forEach((student) => {
      const row = document.createElement("section");
      row.className = "gradebook-row";

      const info = document.createElement("div");
      info.className = "gradebook-student";

      const initials = student.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
      info.append(
        createTextElement("span", "avatar", initials),
        createTextElement("strong", "", student.name),
        createTextElement("small", "text-secondary", getClassroomTitle(student.classroom))
      );

      row.append(info, createGradeForm(courseId, student, { compact: true }));
      rows.appendChild(row);
    });

    coursePanel.append(header, rows);
    adminGrades.appendChild(coursePanel);
  });

  observeMotionElements(adminGrades);
}

function renderAssignmentReview(assignment) {
  const review = document.createElement("div");
  review.className = "assignment-review mt-3";

  const reviewTitle = document.createElement("strong");
  reviewTitle.className = "d-block mb-2";
  reviewTitle.textContent = "Submitted work";

  const list = document.createElement("div");
  list.className = "vstack gap-2";

  const submittedStudents = getAssignmentStudents(assignment).filter((student) => {
    return Boolean(getAssignmentSubmission(assignment.id, student));
  });

  if (!submittedStudents.length) {
    list.appendChild(createTextElement("p", "text-secondary small mb-0", "No submissions yet."));
  }

  submittedStudents.forEach((student) => {
    const submission = getAssignmentSubmission(assignment.id, student);
    const row = document.createElement("div");
    row.className = "assignment-review-row";

    const info = document.createElement("div");
    info.className = "assignment-review-info";

    const nameLine = document.createElement("div");
    nameLine.className = "d-flex flex-wrap align-items-center gap-2";

    const name = document.createElement("strong");
    name.textContent = student.name;

    const classroom = document.createElement("span");
    classroom.className = "badge text-bg-light";
    classroom.textContent = getClassroomTitle(student.classroom);

    nameLine.append(name, classroom);
    info.appendChild(nameLine);

    if (submission) {
      const submitted = document.createElement("small");
      submitted.className = "text-secondary d-block mt-1";
      const fileCount = submission.files?.length || 0;
      submitted.textContent = assignment.type === "essay"
        ? `Submitted ${formatDate(submission.submittedAt)} as an essay response.`
        : `Submitted ${formatDate(submission.submittedAt)} with ${fileCount} file${fileCount === 1 ? "" : "s"}.`;
      info.appendChild(submitted);

      if (assignment.type === "essay" && submission.essay) {
        const answer = createTextElement("p", "assignment-essay-preview text-secondary small mb-0 mt-2", submission.essay);
        info.appendChild(answer);
      } else if (submission.files?.length) {
        const files = renderAssignmentFiles(submission.files);
        files.classList.add("mt-2");
        info.appendChild(files);
      }
    }

    row.append(info);
    list.appendChild(row);
  });

  review.append(reviewTitle, list);
  return review;
}

function renderAssignmentCard(assignment, options = {}) {
  const isExpanded = expandedAssignmentId === assignment.id;
  const wrapper = document.createElement("article");
  wrapper.className = "col-12";

  const card = document.createElement("div");
  card.className = `${options.admin ? "card video-resource h-100" : "announcement-item"} assignment-card${isExpanded ? " assignment-card-expanded" : ""}`;

  const body = document.createElement("div");
  body.className = options.admin ? "card-body" : "";

  const meta = document.createElement("div");
  meta.className = "d-flex flex-wrap gap-2 align-items-center mb-2";

  const classroom = document.createElement("span");
  classroom.className = "badge text-bg-info";
  classroom.textContent = getClassroomTitle(assignment.classroom);

  const subject = document.createElement("span");
  subject.className = "badge text-bg-light";
  subject.textContent = assignment.subject || "General Activity";

  const dueDate = document.createElement("span");
  dueDate.className = "badge text-bg-warning";
  dueDate.textContent = `Due ${formatDueDate(assignment.dueDate)}`;

  const type = document.createElement("span");
  type.className = "badge text-bg-light";
  type.textContent = assignment.type === "essay" ? "Essay" : "File upload";

  const created = document.createElement("small");
  created.className = "text-secondary";
  created.textContent = formatDate(assignment.createdAt);

  const title = document.createElement("h3");
  title.className = "h6 mb-0";
  title.textContent = assignment.title;

  const instructions = document.createElement("p");
  instructions.className = "text-secondary mb-0";
  instructions.textContent = assignment.instructions;

  const toggle = document.createElement("button");
  toggle.className = "assignment-toggle";
  toggle.type = "button";
  toggle.dataset.assignmentAction = "toggle";
  toggle.dataset.assignmentId = assignment.id;
  toggle.setAttribute("aria-expanded", String(isExpanded));
  toggle.append(
    createTextElement("span", "", isExpanded ? "Hide details" : "View details"),
    createTextElement("span", "assignment-toggle-icon", isExpanded ? "-" : "+")
  );

  const header = document.createElement("div");
  header.className = "assignment-card-header";
  header.append(title, toggle);

  const details = document.createElement("div");
  details.className = "assignment-card-details";

  meta.append(classroom, subject, type, dueDate, created);
  body.append(meta, header);

  if (!isExpanded) {
    const preview = document.createElement("p");
    preview.className = "assignment-preview text-secondary mb-0";
    preview.textContent = assignment.instructions;
    body.appendChild(preview);
  }

  if (isExpanded) {
    details.appendChild(instructions);

    if (assignment.attachments?.length) {
      const materials = document.createElement("div");
      materials.className = "assignment-materials";
      materials.append(
        createTextElement("strong", "d-block mb-2", "Attached materials"),
        renderAssignmentFiles(assignment.attachments)
      );
      details.appendChild(materials);
    }
  }

  if (options.admin) {
    if (isExpanded) details.appendChild(renderAssignmentReview(assignment));

    const actions = document.createElement("div");
    actions.className = "d-flex flex-wrap gap-2 mt-3";

    const removeButton = document.createElement("button");
    removeButton.className = "btn btn-outline-danger btn-sm";
    removeButton.type = "button";
    removeButton.dataset.assignmentAction = "remove";
    removeButton.dataset.assignmentId = assignment.id;
    removeButton.textContent = "Remove";

    actions.appendChild(removeButton);
    if (isExpanded) details.appendChild(actions);
  } else {
    const submission = getAssignmentSubmission(assignment.id);
    const uploadForm = document.createElement("form");
    uploadForm.className = "assignment-upload-form vstack gap-2 mt-3";
    uploadForm.dataset.assignmentUploadForm = assignment.id;

    const submitButton = document.createElement("button");
    submitButton.className = "btn btn-primary btn-sm align-self-start";
    submitButton.type = "submit";

    if (assignment.type === "essay") {
      const essayLabel = document.createElement("label");
      essayLabel.className = "form-label mb-0";
      essayLabel.textContent = "Essay answer";

      const essayInput = document.createElement("textarea");
      essayInput.className = "form-control mt-1";
      essayInput.name = "assignmentEssay";
      essayInput.rows = 6;
      essayInput.placeholder = "Write your answer here";
      essayInput.required = true;
      essayInput.value = submission?.essay || "";

      submitButton.textContent = submission ? "Update Essay" : "Submit Essay";
      essayLabel.appendChild(essayInput);
      uploadForm.append(essayLabel, submitButton);
    } else {
      const uploadLabel = document.createElement("label");
      uploadLabel.className = "form-label mb-0";
      uploadLabel.textContent = "Upload files";

      const fileInput = document.createElement("input");
      fileInput.className = "form-control mt-1";
      fileInput.name = "assignmentFiles";
      fileInput.type = "file";
      fileInput.multiple = true;
      fileInput.required = true;

      submitButton.textContent = submission ? "Replace Upload" : "Upload";
      uploadLabel.appendChild(fileInput);
      uploadForm.append(uploadLabel, submitButton);
    }

    if (isExpanded) details.appendChild(uploadForm);

    if (submission) {
      const submitted = document.createElement("div");
      submitted.className = "assignment-submission mt-3";

      const submittedTitle = document.createElement("strong");
      submittedTitle.className = "d-block mb-1";
      submittedTitle.textContent = assignment.type === "essay" ? "Submitted essay" : "Submitted files";

      const submittedTime = document.createElement("small");
      submittedTime.className = "text-secondary d-block mb-2";
      submittedTime.textContent = formatDate(submission.submittedAt);

      submitted.append(submittedTitle, submittedTime);
      if (assignment.type === "essay") {
        submitted.appendChild(createTextElement("p", "assignment-essay-preview mb-0", submission.essay || ""));
      } else {
        submitted.appendChild(renderAssignmentFiles(submission.files || []));
      }
      if (isExpanded) details.appendChild(submitted);
    }
  }

  if (isExpanded) body.appendChild(details);
  card.appendChild(body);
  wrapper.appendChild(card);
  return wrapper;
}

function renderAssignments() {
  const assignments = getAssignments().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (adminAssignments) {
    if (expandedAssignmentId === undefined) {
      expandedAssignmentId = assignments[0]?.id || null;
    } else if (expandedAssignmentId !== null && !assignments.some((assignment) => assignment.id === expandedAssignmentId)) {
      expandedAssignmentId = assignments[0]?.id || null;
    }

    adminAssignments.replaceChildren();

    if (!assignments.length) {
      const empty = document.createElement("p");
      empty.className = "col-12 text-secondary mb-0";
      empty.textContent = "No assignments posted yet.";
      adminAssignments.appendChild(empty);
    } else {
      assignments.forEach((assignment) => {
        adminAssignments.appendChild(renderAssignmentCard(assignment, { admin: true }));
      });
    }

    observeMotionElements(adminAssignments);
  }

  if (studentAssignments) {
    const classroomAssignments = assignments.filter(isVisibleForSelectedClassroom);
    if (!adminAssignments) {
      if (expandedAssignmentId === undefined) {
        expandedAssignmentId = classroomAssignments[0]?.id || null;
      } else if (expandedAssignmentId !== null && !classroomAssignments.some((assignment) => assignment.id === expandedAssignmentId)) {
        expandedAssignmentId = classroomAssignments[0]?.id || null;
      }
    }

    studentAssignments.replaceChildren();
    if (studentAssignmentClass) studentAssignmentClass.textContent = selectedClassroomTitle;

    if (!classroomAssignments.length) {
      const empty = document.createElement("p");
      empty.className = "text-secondary mb-0";
      empty.textContent = "No assignments for this classroom yet.";
      studentAssignments.appendChild(empty);
      return;
    }

    classroomAssignments.forEach((assignment) => {
      studentAssignments.appendChild(renderAssignmentCard(assignment));
    });

    observeMotionElements(studentAssignments);
  }

  renderGradebook();
}

async function saveAssignmentFromForm(form, courseId = "") {
  setFormStatus(form);
  const course = courseWorkspaces[courseId];
  const title = (form.elements.title?.value || form.querySelector("#assignmentTitle")?.value || "").trim();
  const subject = course?.title || assignmentSubject?.value || "";
  const type = form.elements.type?.value || assignmentType?.value || "file";
  const instructions = (form.elements.instructions?.value || form.querySelector("#assignmentInstructions")?.value || "").trim();
  const dueDate = form.elements.dueDate?.value || form.querySelector("#assignmentDueDate")?.value || "";
  const classroom = form.elements.classroom?.value || assignmentClassroom?.value || "all";
  const attachmentInput = form.elements.attachments || assignmentAttachment;

  if (!title || !subject || !instructions || !dueDate) {
    setFormStatus(form, "Complete the classwork title, instructions, subject, and due date before posting.");
    return;
  }

  const attachments = (await Promise.all(Array.from(attachmentInput?.files || []).map(readStorageFile))).filter(Boolean);
  const assignments = getAssignments();
  const assignmentId = `assignment-${Date.now()}`;
  assignments.unshift({
    id: assignmentId,
    courseId,
    classroom,
    subject,
    type,
    title,
    instructions,
    attachments,
    dueDate,
    createdAt: new Date().toISOString()
  });

  expandedAssignmentId = assignmentId;
  if (!saveStoredItems("gthAssignments", assignments)) {
    setFormStatus(form, "This classwork file could not be saved. Try a smaller PDF/DOCX or remove older uploaded files first.");
    return;
  }
  addNotification({
    type: "assignment",
    section: "courses",
    courseId,
    classroom,
    audience: { role: "student", classroom },
    title: `New classwork: ${title}`,
    message: `${subject} - due ${formatDate(dueDate)}`,
    createdAt: assignments[0].createdAt
  });
  form.reset();
  syncAssignmentSubjects();
  refreshAssignmentSurfaces(assignmentId);
}

assignmentForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveAssignmentFromForm(assignmentForm);
});

document.addEventListener("submit", async (event) => {
  const form = event.target.closest("[data-course-assignment-form]");
  if (!form) return;

  event.preventDefault();
  await saveAssignmentFromForm(form, form.dataset.courseAssignmentForm);
});

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-assignment-action]");
  if (!actionButton) return;

  if (actionButton.dataset.assignmentAction === "toggle") {
    expandedAssignmentId = expandedAssignmentId === actionButton.dataset.assignmentId ? null : actionButton.dataset.assignmentId;
    refreshAssignmentSurfaces(actionButton.dataset.assignmentId);
    return;
  }

  if (actionButton.dataset.assignmentAction === "remove") {
    const assignmentId = actionButton.dataset.assignmentId;
    const assignment = getAssignments().find((item) => item.id === assignmentId);
    const courseId = getAssignmentCourseId(assignment);
    if (expandedAssignmentId === actionButton.dataset.assignmentId) expandedAssignmentId = null;
    saveStoredItems("gthAssignments", getAssignments().filter((item) => item.id !== assignmentId));
    saveStoredItems("gthAssignmentSubmissions", getAssignmentSubmissions().filter((item) => item.assignmentId !== assignmentId));
    renderAssignments();
    if (courseId) refreshOpenCourseWorkspace(courseId);
  }
});

document.addEventListener("submit", async (event) => {
  const form = event.target.closest("[data-assignment-upload-form]");
  if (!form) return;

  event.preventDefault();

  const assignment = getAssignments().find((item) => item.id === form.dataset.assignmentUploadForm);
  if (!assignment) return;

  const fileInput = form.querySelector("input[type='file']");
  const essayInput = form.querySelector("[name='assignmentEssay']");
  const files = Array.from(fileInput?.files || []);
  const essay = essayInput?.value.trim() || "";
  if (assignment.type === "essay" && !essay) return;
  if (assignment.type !== "essay" && !files.length) return;
  const storedFiles = assignment.type === "essay" ? [] : (await Promise.all(files.map(readStorageFile))).filter(Boolean);

  const assignmentId = form.dataset.assignmentUploadForm;
  expandedAssignmentId = assignmentId;
  const submissions = getAssignmentSubmissions().filter((submission) => {
    return !isSubmissionForStudent(submission, assignmentId, currentStudent);
  });

  submissions.push({
    id: `assignment-submission-${Date.now()}`,
    assignmentId,
    classroom: selectedClassroom,
    studentId: currentStudent.id,
    studentName: currentStudent.name,
    essay,
    files: storedFiles,
    submittedAt: new Date().toISOString()
  });

  saveStoredItems("gthAssignmentSubmissions", submissions);
  addNotification({
    type: "assignment",
    section: "courses",
    classroom: selectedClassroom,
    studentId: currentStudent.id,
    studentName: currentStudent.name,
    audience: { role: "admin" },
    title: `Assignment submitted by ${currentStudent.name}`,
    message: `Submitted ${getAssignmentTitle(assignment)} in ${getClassroomTitle(selectedClassroom)}`,
    createdAt: new Date().toISOString()
  });
  refreshAssignmentSurfaces(assignmentId);
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-student-grade-form]");
  if (!form) return;

  event.preventDefault();

  const grades = getStudentGrades().filter((grade) => {
    return !(grade.courseId === form.dataset.studentGradeForm && grade.studentId === form.dataset.studentId);
  });

  const readGrade = (name) => {
    const value = form.querySelector(`[name='${name}']`)?.value.trim();
    return value === "" ? "" : Math.max(0, Math.min(100, Number(value)));
  };

  const grade = {
    id: `student-grade-${Date.now()}`,
    courseId: form.dataset.studentGradeForm,
    studentId: form.dataset.studentId,
    studentName: form.dataset.studentName,
    classroom: form.dataset.classroom,
    prelim: readGrade("prelim"),
    midterm: readGrade("midterm"),
    final: readGrade("final"),
    updatedAt: new Date().toISOString()
  };

  grade.finalGrade = calculateFinalGrade(grade);
  grades.push(grade);

  saveStoredItems("gthStudentGrades", grades);
  renderAssignments();
  renderGradebook();

  const activeCourseCard = document.querySelector(`.course-card-active[data-course='${form.dataset.studentGradeForm}']`);
  if (activeCourseCard) renderCourseWorkspace(form.dataset.studentGradeForm, activeCourseCard);
});

function getInvitations() {
  const stored = getStoredItems("gthInvitations", null);
  if (stored) {
    const cleaned = removeDeprecatedSubjectItems(stored);
    if (cleaned.length !== stored.length) saveStoredItems("gthInvitations", cleaned);
    return cleaned;
  }

  saveStoredItems("gthInvitations", demoInvitations);
  return demoInvitations;
}

function renderInvitationCard(invitation, options = {}) {
  const article = document.createElement("article");
  article.className = options.admin ? "announcement-item meeting-link-card" : "announcement-item meeting-link-card student-meeting-card";

  const meta = document.createElement("div");
  meta.className = "d-flex flex-wrap gap-2 align-items-center mb-2";

  const classroom = document.createElement("span");
  classroom.className = "badge text-bg-info";
  classroom.textContent = getClassroomTitle(invitation.classroom);

  const time = document.createElement("small");
  time.className = "text-secondary";
  time.textContent = formatDate(invitation.createdAt);

  meta.append(classroom, time);

  const title = document.createElement("h3");
  title.className = "h6 mb-2";
  title.textContent = invitation.title;

  const link = document.createElement("a");
  link.className = "btn btn-primary btn-sm";
  link.href = invitation.link;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "Open GMeet";

  const linkText = document.createElement("p");
  linkText.className = "small text-secondary mb-3 text-break meeting-link-url";
  linkText.textContent = invitation.link;

  const sessionDetails = document.createElement("div");
  sessionDetails.className = "meeting-session-details";
  sessionDetails.append(
    createTextElement("span", "", "Live consultation"),
    createTextElement("span", "", "Google Meet"),
    createTextElement("span", "", options.admin ? "Shared with learners" : "Ready to join")
  );

  const actions = document.createElement("div");
  actions.className = "d-flex flex-wrap gap-2";
  actions.appendChild(link);

  if (options.admin) {
    const removeButton = document.createElement("button");
    removeButton.className = "btn btn-outline-danger btn-sm";
    removeButton.type = "button";
    removeButton.dataset.invitationAction = "remove";
    removeButton.dataset.invitationId = invitation.id;
    removeButton.textContent = "Remove";
    actions.appendChild(removeButton);
  }

  if (options.admin) {
    article.append(meta, title, linkText, actions);
  } else {
    const content = document.createElement("div");
    content.className = "student-meeting-content";
    content.append(meta, title, sessionDetails, linkText);
    article.append(content, actions);
  }

  return article;
}

function renderInvitations() {
  const invitations = getInvitations().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (enrollmentRequests) {
    enrollmentRequests.replaceChildren();

    if (!invitations.length) {
      const empty = document.createElement("p");
      empty.className = "text-secondary mb-0";
      empty.textContent = "No GMeet links posted yet.";
      enrollmentRequests.appendChild(empty);
    } else {
      invitations.forEach((invitation) => {
        enrollmentRequests.appendChild(renderInvitationCard(invitation, { admin: true }));
      });
    }

    observeMotionElements(enrollmentRequests);
  }

}

invitationForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.querySelector("#invitationTitle").value.trim();
  const link = document.querySelector("#invitationLink").value.trim();
  if (!title || !link) return;

  const invitations = getInvitations();
  const invitation = {
    id: `invitation-${Date.now()}`,
    classroom: document.querySelector("#invitationClassroom").value,
    title,
    link,
    createdAt: new Date().toISOString()
  };
  invitations.unshift(invitation);

  saveStoredItems("gthInvitations", invitations);
  addNotification({
    type: "invitation",
    section: "gmeet",
    classroom: invitation.classroom,
    audience: { role: "student", classroom: invitation.classroom },
    title: `New live session: ${title}`,
    message: getClassroomTitle(invitation.classroom) || "Live session",
    createdAt: invitation.createdAt
  });
  invitationForm.reset();
  renderInvitations();
  refreshActiveCourseWorkspace();
});

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-invitation-action]");
  if (!actionButton) return;

  if (actionButton.dataset.invitationAction === "remove") {
    saveStoredItems("gthInvitations", getInvitations().filter((item) => item.id !== actionButton.dataset.invitationId));
    renderInvitations();
    refreshActiveCourseWorkspace();
  }
});

function getActiveChatClassroom() {
  if (chatClassroom) return chatClassroom.value || getSubjectTargets({ includeAll: false })[0]?.value || "";
  return selectedClassroom;
}

function getChatMessages() {
  return getStoredItems("gthChatMessages", []);
}

function getInitials(name) {
  return String(name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getMessageTimeLabel(message) {
  if (!message?.createdAt) return "Now";
  return new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function createRecentChatItem({ title, preview, time, initials, active, unreadCount = 0, onClick }) {
  const button = document.createElement("button");
  button.className = `recent-chat-item${active ? " active" : ""}`;
  button.type = "button";

  const avatar = createTextElement("span", "chat-avatar", initials || getInitials(title));
  const content = document.createElement("span");
  const name = createTextElement("strong", "", title);
  const latest = createTextElement("small", "text-secondary", preview || "No messages yet.");
  const timestamp = createTextElement("span", "recent-chat-time", time || "");
  const meta = document.createElement("span");
  meta.className = "recent-chat-meta";
  meta.appendChild(timestamp);
  if (unreadCount) {
    const badge = createTextElement("span", "recent-unread-count", unreadCount > 9 ? "9+" : String(unreadCount));
    badge.setAttribute("aria-label", `${unreadCount} unread`);
    meta.appendChild(badge);
  }

  content.append(name, latest);
  button.append(avatar, content, meta);
  if (onClick) button.addEventListener("click", onClick);

  return button;
}

function createChatInfoEmpty(text) {
  return createTextElement("p", "chat-info-empty mb-0", text);
}

function createChatInfoPerson(name, detail, initials = getInitials(name)) {
  const item = document.createElement("div");
  item.className = "chat-info-person";
  item.append(
    createTextElement("span", "chat-avatar", initials),
    createTextElement("strong", "", name),
    createTextElement("small", "text-secondary", detail)
  );
  return item;
}

function getSharedCourseResources() {
  const courses = getCustomCourses().filter((course) => adminApp || isCourseJoined(course));
  const resources = getCourseResources();
  return courses.flatMap((course) => {
    return getCourseItems(resources, course.id)
      .filter((resource) => resource.file?.name || resource.link)
      .map((resource) => ({ ...resource, courseTitle: course.title }));
  });
}

function createSharedResourceRow(resource) {
  const row = document.createElement("div");
  row.className = "chat-info-resource";
  const meta = document.createElement("div");
  meta.append(
    createTextElement("strong", "", resource.title),
    createTextElement("small", "text-secondary d-block", resource.courseTitle || "Shared resource")
  );

  const actions = document.createElement("div");
  actions.className = "chat-info-resource-actions";
  if (resource.file?.data) {
    const file = document.createElement("a");
    file.href = resource.file.data;
    file.download = resource.file.name;
    file.textContent = resource.file.name || "Download file";
    actions.appendChild(file);
  } else if (resource.file?.name) {
    actions.appendChild(createTextElement("span", "text-secondary", resource.file.name));
  }

  if (resource.link) {
    const link = document.createElement("a");
    link.href = resource.link;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Open link";
    actions.appendChild(link);
  }

  row.append(meta, actions);
  return row;
}

function getChatAttachmentResources(panel) {
  const isPrivatePanel = Boolean(panel?.closest(".private-message-panel"));
  const messages = isPrivatePanel
    ? getPrivateMessages().filter((message) => message.studentId === getActivePrivateStudentId())
    : getChatMessages().filter((message) => message.classroom === getActiveChatClassroom());

  return messages.flatMap((message) => {
    return (message.attachments || []).map((file) => ({
      id: `${message.id}-${file.name}`,
      title: file.name,
      courseTitle: `${message.author} - ${formatDate(message.createdAt)}`,
      file,
      createdAt: message.createdAt
    }));
  });
}

function renderChatMembersDetail(detail) {
  const classroom = getActiveChatClassroom();
  const students = classroomStudents[classroom] || [];
  detail.appendChild(createTextElement("h4", "chat-info-detail-title", "Chat members"));
  detail.appendChild(createChatInfoPerson("Admin", getClassroomTitle(classroom), "A"));
  students.forEach((student) => {
    detail.appendChild(createChatInfoPerson(student.name, getClassroomTitle(classroom)));
  });
}

function renderSharedFilesDetail(detail) {
  const resources = [
    ...getSharedCourseResources(),
    ...getChatAttachmentResources(detail.closest(".chat-info-panel"))
  ];
  detail.appendChild(createTextElement("h4", "chat-info-detail-title", "Shared files and links"));
  if (!resources.length) {
    detail.appendChild(createChatInfoEmpty("No shared files or links yet."));
    return;
  }

  resources.forEach((resource) => detail.appendChild(createSharedResourceRow(resource)));
}

function renderStudentInfoDetail(detail) {
  const student = getStudentById(getActivePrivateStudentId());
  const studentCourses = getCustomCourses().filter((course) => adminApp || isCourseJoined(course));
  detail.appendChild(createTextElement("h4", "chat-info-detail-title", "Student info"));
  detail.appendChild(createChatInfoPerson(student.name, getClassroomTitle(student.classroom)));

  const stats = document.createElement("div");
  stats.className = "chat-info-stats";
  stats.append(
    createTextElement("span", "", "Classroom"),
    createTextElement("strong", "", getClassroomTitle(student.classroom)),
    createTextElement("span", "", "Student ID"),
    createTextElement("strong", "", student.id)
  );
  detail.appendChild(stats);

  const gradeRows = studentCourses
    .map((course) => ({ course, grade: calculateFinalGrade(getStudentGrade(course.id, student.id) || {}) }))
    .filter(({ grade }) => grade !== null);

  if (!gradeRows.length) {
    detail.appendChild(createChatInfoEmpty("No recorded grades yet."));
    return;
  }

  gradeRows.forEach(({ course, grade }) => {
    const row = document.createElement("div");
    row.className = "chat-info-grade-row";
    row.append(
      createTextElement("span", "", course.title),
      createTextElement("strong", "", `${grade}%`)
    );
    detail.appendChild(row);
  });
}

function renderChatInfoDetail(actionButton) {
  const panel = actionButton.closest(".chat-info-panel");
  const detail = panel?.querySelector("[data-chat-info-detail]");
  if (!detail) return;

  panel.querySelectorAll("[data-chat-info-action]").forEach((button) => {
    button.classList.toggle("active", button === actionButton);
  });
  detail.replaceChildren();

  if (actionButton.dataset.chatInfoAction === "members") renderChatMembersDetail(detail);
  if (actionButton.dataset.chatInfoAction === "shared") renderSharedFilesDetail(detail);
  if (actionButton.dataset.chatInfoAction === "student") renderStudentInfoDetail(detail);
}

function refreshOpenChatInfoDetails(root = document) {
  root.querySelectorAll("[data-chat-info-action].active").forEach(renderChatInfoDetail);
}

function renderChatAttachment(file) {
  const item = document.createElement(file.data ? "a" : "span");
  item.className = "chat-attachment";
  if (file.data) {
    item.href = file.data;
    item.download = file.name;
  }
  item.append(
    createTextElement("strong", "", file.name || "Attachment"),
    createTextElement("small", "", formatFileSize(file.size || 0))
  );
  return item;
}

function createChatBubble({ author, text, attachments = [], createdAt, own, group }) {
  const row = document.createElement("div");
  row.className = `chat-row${own ? " chat-row-own" : ""}`;

  const avatar = createTextElement("span", `chat-avatar${group ? " chat-avatar-group" : ""}`, getInitials(author));
  const item = document.createElement("div");
  item.className = "chat-message";
  if (own) item.classList.add("chat-message-own");

  const meta = document.createElement("small");
  meta.className = "text-secondary d-block mb-1";
  meta.textContent = `${author} - ${formatDate(createdAt)}`;

  if (text) item.appendChild(createTextElement("p", "mb-0", text));
  if (attachments.length) {
    const attachmentList = document.createElement("div");
    attachmentList.className = "chat-attachment-list";
    attachments.forEach((file) => attachmentList.appendChild(renderChatAttachment(file)));
    item.appendChild(attachmentList);
  }

  item.prepend(meta);
  row.append(avatar, item);

  return row;
}

function renderClassChatRecents() {
  if (!chatRecentList) return;

  const allMessages = getChatMessages();
  const activeClassroom = getActiveChatClassroom();
  chatRecentList.replaceChildren();

  getSubjectTargets({ includeAll: false })
    .forEach(({ value: classroom, label }) => {
      const classroomMessages = allMessages.filter((message) => message.classroom === classroom);
      const latest = classroomMessages[classroomMessages.length - 1];
      chatRecentList.appendChild(createRecentChatItem({
        title: label,
        preview: latest ? `${latest.author}: ${latest.text || `${latest.attachments?.length || 0} attachment(s)`}` : "Start the class conversation.",
        time: latest ? getMessageTimeLabel(latest) : "",
        initials: "G",
        active: classroom === activeClassroom,
        unreadCount: getUnreadNotificationCount(getNotificationSectionId({ section: "class-chat" }), { classroom }),
        onClick: () => {
          if (chatClassroom) chatClassroom.value = classroom;
          renderChatMessages();
        }
      }));
    });
}

function renderChatMessages() {
  if (!chatMessages) return;

  const activeClassroom = getActiveChatClassroom();
  const messages = getChatMessages().filter((message) => message.classroom === activeClassroom);
  chatMessages.replaceChildren();
  if (chatThreadTitle) chatThreadTitle.textContent = getClassroomTitle(activeClassroom) || "Class Chat";
  if (chatInfoTitle) chatInfoTitle.textContent = getClassroomTitle(activeClassroom) || "Class Chat";
  const classChatSectionId = getNotificationSectionId({ section: "class-chat" });
  if (isSectionCurrentlyOpen(classChatSectionId)) {
    markNotificationsRead((notification) => {
      return getNotificationSectionId(notification) === classChatSectionId
        && notification.classroom === activeClassroom;
    }, { render: false });
  }
  renderClassChatRecents();
  renderNotificationCenter();
  refreshOpenChatInfoDetails(chatbox || document);

  if (!messages.length) {
    const empty = document.createElement("p");
    empty.className = "chat-empty text-secondary small mb-0";
    empty.textContent = "No messages yet.";
    chatMessages.appendChild(empty);
    return;
  }

  const currentAuthor = chatbox?.dataset.role === "admin" ? "Admin" : "Student";

  messages.slice(-20).forEach((message) => {
    chatMessages.appendChild(createChatBubble({
      author: message.author,
      text: message.text,
      attachments: message.attachments || [],
      createdAt: message.createdAt,
      own: message.author === currentAuthor,
      group: true
    }));
  });

  observeMotionElements(chatMessages);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatClassroom?.addEventListener("change", renderChatMessages);

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-chat-info-action]");
  if (!actionButton) return;
  renderChatInfoDetail(actionButton);
});

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-chat-attachment-trigger]");
  if (!trigger) return;

  const input = trigger.dataset.chatAttachmentTrigger === "private" ? privateMessageAttachment : chatAttachment;
  input?.click();
});

async function readChatAttachments(input) {
  const files = await Promise.all(Array.from(input?.files || []).map(readStorageFile));
  return files.filter(Boolean);
}

chatForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = chatMessage.value.trim();
  const attachments = await readChatAttachments(chatAttachment);
  if (!text && !attachments.length) return;

  const messages = getChatMessages();
  const message = {
    id: `chat-${Date.now()}`,
    classroom: getActiveChatClassroom(),
    author: chatbox?.dataset.role === "admin" ? "Admin" : "Student",
    text,
    attachments,
    createdAt: new Date().toISOString()
  };
  messages.push(message);

  saveStoredItems("gthChatMessages", messages);
  addNotification({
    type: "class-chat",
    section: "class-chat",
    classroom: message.classroom,
    audience: { role: message.author === "Admin" ? "student" : "admin", classroom: message.classroom },
    title: message.author === "Admin" ? "Admin sent a class message" : `${message.author} sent a class message`,
    message: `${getClassroomTitle(message.classroom) || "Class Chat"} - ${message.text || `${message.attachments.length} attachment(s)`}`,
    createdAt: message.createdAt
  });
  chatMessage.value = "";
  if (chatAttachment) chatAttachment.value = "";
  renderChatMessages();
});

chatToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    chatbox?.classList.toggle("chatbox-collapsed");
    toggle.textContent = chatbox?.classList.contains("chatbox-collapsed") ? "Open" : "Minimize";
  });
});

function getPrivateMessages() {
  return getStoredItems("gthPrivateMessages", []);
}

function getActivePrivateStudentId() {
  if (privateMessageStudent) return privateMessageStudent.value;
  return currentStudent.id;
}

function getStudentById(studentId) {
  return getAllStudents().find((student) => student.id === studentId) || currentStudent;
}

function setupPrivateMessageStudents() {
  if (!privateMessageStudent) return;

  privateMessageStudent.replaceChildren();
  getAllStudents().forEach((student) => {
    const option = document.createElement("option");
    option.value = student.id;
    option.textContent = `${student.name} - ${getClassroomTitle(student.classroom)}`;
    privateMessageStudent.appendChild(option);
  });
}

function renderPrivateMessageRecents() {
  if (!privateRecentList) return;

  const messages = getPrivateMessages();
  const activeStudentId = getActivePrivateStudentId();
  const isAdmin = privateMessagePanel?.dataset.privateRole === "admin";
  const students = isAdmin ? getAllStudents() : [currentStudent];

  privateRecentList.replaceChildren();
  students.forEach((student) => {
    const studentMessages = messages.filter((message) => message.studentId === student.id);
    const latest = studentMessages[studentMessages.length - 1];
    privateRecentList.appendChild(createRecentChatItem({
      title: isAdmin ? student.name : "Admin Support",
      preview: latest ? `${latest.author}: ${latest.text || `${latest.attachments?.length || 0} attachment(s)`}` : "No private messages yet.",
      time: latest ? getMessageTimeLabel(latest) : "",
      initials: isAdmin ? getInitials(student.name) : "A",
      active: student.id === activeStudentId,
      unreadCount: getUnreadNotificationCount("private-messages", { studentId: student.id }),
      onClick: () => {
        if (privateMessageStudent) privateMessageStudent.value = student.id;
        renderPrivateMessages();
      }
    }));
  });
}

function renderPrivateMessages() {
  if (!privateMessages) return;

  const studentId = getActivePrivateStudentId();
  const student = getStudentById(studentId);
  const messages = getPrivateMessages().filter((message) => message.studentId === studentId);
  const currentRole = privateMessagePanel?.dataset.privateRole === "admin" ? "admin" : "student";
  const isAdmin = currentRole === "admin";
  const threadName = isAdmin ? student.name : "Admin Support";

  if (privateMessageStudentName) privateMessageStudentName.textContent = threadName;
  if (privateInfoTitle) privateInfoTitle.textContent = threadName;
  if (isSectionCurrentlyOpen("private-messages")) {
    markNotificationsRead((notification) => {
      return getNotificationSectionId(notification) === "private-messages"
        && notification.studentId === studentId;
    }, { render: false });
  }
  renderPrivateMessageRecents();
  renderNotificationCenter();
  refreshOpenChatInfoDetails(privateMessagePanel || document);
  privateMessages.replaceChildren();

  if (!messages.length) {
    const empty = createTextElement("p", "chat-empty text-secondary small mb-0", "No private messages yet.");
    privateMessages.appendChild(empty);
    return;
  }

  messages.forEach((message) => {
    privateMessages.appendChild(createChatBubble({
      author: message.author,
      text: message.text,
      attachments: message.attachments || [],
      createdAt: message.createdAt,
      own: message.role === currentRole
    }));
  });

  observeMotionElements(privateMessages);
  privateMessages.scrollTop = privateMessages.scrollHeight;
}

privateMessageStudent?.addEventListener("change", renderPrivateMessages);

privateMessageForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = privateMessageText?.value.trim() || "";
  const attachments = await readChatAttachments(privateMessageAttachment);
  const studentId = getActivePrivateStudentId();
  const student = getStudentById(studentId);
  if (!text && !attachments.length) return;

  const isAdmin = privateMessagePanel?.dataset.privateRole === "admin";
  const messages = getPrivateMessages();
  const message = {
    id: `private-message-${Date.now()}`,
    studentId,
    classroom: student.classroom,
    role: isAdmin ? "admin" : "student",
    author: isAdmin ? "Admin" : student.name,
    text,
    attachments,
    createdAt: new Date().toISOString()
  };
  messages.push(message);

  saveStoredItems("gthPrivateMessages", messages);
  addNotification({
    type: "private-message",
    section: "private-messages",
    studentId,
    studentName: student.name,
    classroom: student.classroom,
    audience: isAdmin ? { role: "student", studentId } : { role: "admin", studentId },
    title: isAdmin ? "Admin sent you a private message" : `${student.name} sent a private message`,
    message: message.text || `${message.attachments.length} attachment(s)`,
    createdAt: message.createdAt
  });
  privateMessageText.value = "";
  if (privateMessageAttachment) privateMessageAttachment.value = "";
  renderPrivateMessages();
});

function redirectAdminIfLoggedOut() {
  if (adminApp && sessionStorage.getItem("gthAdminLoggedIn") !== "true") {
    window.location.replace("login.html");
  }
}

redirectAdminIfLoggedOut();
window.addEventListener("pageshow", redirectAdminIfLoggedOut);

adminLogout?.addEventListener("click", () => {
  sessionStorage.removeItem("gthAdminLoggedIn");
  sessionStorage.removeItem("gthCurrentUser");
  window.location.replace("index.html");
});

portalLoginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.querySelector("#portalUsername").value.trim();
  const password = document.querySelector("#portalPassword").value;

  portalLoginError?.classList.add("d-none");

  try {
    const response = await fetch(getApiUrl("/users/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || "Login failed.");
    }

    if (result.data?.role === "admin") {
      sessionStorage.setItem("gthCurrentUser", JSON.stringify(result.data));
      sessionStorage.setItem("gthAdminLoggedIn", "true");
      sessionStorage.removeItem("gthClientLoggedIn");
      window.location.replace("admin.html");
      return;
    }

    sessionStorage.setItem("gthCurrentUser", JSON.stringify(result.data));
    sessionStorage.setItem("gthClientLoggedIn", "true");
    sessionStorage.removeItem("gthAdminLoggedIn");
    window.location.replace("client.html");
  } catch (error) {
    portalLoginError.textContent = error.message === "Failed to fetch"
      ? "Unable to connect to the server. Please open the app at http://localhost:3000/login or start the Node server."
      : error.message || "Invalid username or password.";
    portalLoginError?.classList.remove("d-none");
  }
});

clientLogout?.addEventListener("click", () => {
  sessionStorage.removeItem("gthClientLoggedIn");
  sessionStorage.removeItem("gthCurrentUser");
  window.location.replace("index.html");
});

if ((document.body.contains(clientLogout) || classroomName) && sessionStorage.getItem("gthClientLoggedIn") !== "true") {
  window.location.replace("login.html");
}

if (selectedClassroomTitle) {
  if (classroomName) classroomName.textContent = selectedClassroomTitle;
  if (classroomLabel) classroomLabel.textContent = selectedClassroomTitle;
}

renderAnnouncements();
renderVideos();
renderAssignments();
renderInvitations();
renderChatMessages();
const currentUserForCourses = JSON.parse(sessionStorage.getItem("gthCurrentUser") || "null");
loadServerCourses(adminApp ? "" : currentUserForCourses?._id || "").then(async () => {
  await syncCurrentStudentFromServer();
  const courseId = getCustomCourses()[0]?._id || getCustomCourses()[0]?.id || "";
  if (courseId) {
    await loadServerQuizzes(courseId);
    await loadServerQuizSubmissions(courseId);
  }
  renderCustomCourses();
  renderGradebook();
  setupPrivateMessageStudents();
  renderPrivateMessages();
  renderNotificationCenter();
  observeMotionElements();
});
