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
const dashboardBackButtons = document.querySelectorAll(".dashboard-back");
const dashboardJumps = document.querySelectorAll("[data-open-section]");
const announcementForm = document.querySelector("#announcementForm");
const adminAnnouncements = document.querySelector("#adminAnnouncements");
const studentAnnouncements = document.querySelector("#studentAnnouncements");
const studentAnnouncementClass = document.querySelector("#studentAnnouncementClass");
const chatbox = document.querySelector("#chatbox");
const chatForm = document.querySelector("#chatForm");
const chatMessage = document.querySelector("#chatMessage");
const chatMessages = document.querySelector("#chatMessages");
const chatClassroom = document.querySelector("#chatClassroom");
const chatToggles = document.querySelectorAll(".chat-toggle");
const videoForm = document.querySelector("#videoForm");
const videoError = document.querySelector("#videoError");
const adminVideos = document.querySelector("#adminVideos");
const studentVideos = document.querySelector("#studentVideos");
const studentVideoClass = document.querySelector("#studentVideoClass");
const assignmentForm = document.querySelector("#assignmentForm");
const adminAssignments = document.querySelector("#adminAssignments");
const studentAssignments = document.querySelector("#studentAssignments");
const studentAssignmentClass = document.querySelector("#studentAssignmentClass");
const videoModal = document.querySelector("#videoModal");
const videoModalFrame = document.querySelector("#videoModalFrame");
const videoModalLabel = document.querySelector("#videoModalLabel");
const invitationForm = document.querySelector("#invitationForm");
const studentInvitations = document.querySelector("#studentInvitations");
const studentInvitationClass = document.querySelector("#studentInvitationClass");
const enrollmentRequests = document.querySelector("#enrollmentRequests");
const studentSectionLinks = document.querySelectorAll("[data-student-section-link]");
const studentSections = document.querySelectorAll("[data-student-section]");
const sectionMenuToggle = document.querySelector("#sectionMenuToggle");
const sectionMenuBackdrop = document.querySelector("#sectionMenuBackdrop");
const sectionNav = document.querySelector("#sectionNav");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobileSectionQuery = window.matchMedia("(max-width: 991.98px)");

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
  const elements = root.querySelectorAll(".card, .announcement-item, .grade-tile, .chat-message, .student-section-nav");

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
});

const classroomTitles = {
  ict: "ICT OJT Classroom",
  css: "Computer Systems Servicing",
  all: "All Classrooms"
};

const requestedClassroom = new URLSearchParams(window.location.search).get("classroom") || "ict";
const selectedClassroom = classroomTitles[requestedClassroom] ? requestedClassroom : "ict";
const selectedClassroomTitle = classroomTitles[selectedClassroom];

const demoAnnouncements = [
  {
    id: "demo-ict-pinned",
    classroom: "ict",
    subject: "OJT Onboarding Essentials",
    message: "Please complete your onboarding checklist before Friday.",
    pinned: true,
    createdAt: "2026-06-11T08:00:00.000Z"
  },
  {
    id: "demo-css-safety",
    classroom: "css",
    subject: "Safety and Compliance",
    message: "Bring your lab tools and review the safety reminders before class.",
    pinned: false,
    createdAt: "2026-06-11T09:00:00.000Z"
  }
];

const demoVideos = [
  {
    id: "demo-video-ict",
    classroom: "ict",
    title: "OJT Orientation Walkthrough",
    youtubeId: "dQw4w9WgXcQ",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    createdAt: "2026-06-11T10:00:00.000Z"
  }
];

const demoAssignments = [
  {
    id: "demo-assignment-ict",
    classroom: "ict",
    title: "Onboarding Checklist Submission",
    instructions: "Upload your completed onboarding checklist and supervisor acknowledgment.",
    dueDate: "2026-06-18",
    createdAt: "2026-06-11T12:00:00.000Z"
  }
];

const demoInvitations = [
  {
    id: "demo-invite-ict",
    classroom: "ict",
    title: "ICT OJT GMeet Consultation",
    link: "https://meet.google.com/demo-ict-ojt",
    createdAt: "2026-06-11T11:00:00.000Z"
  }
];

const courseWorkspaces = {
  onboarding: {
    code: "01",
    title: "OJT Onboarding Essentials",
    status: "In Progress",
    progress: 92,
    accent: "primary",
    description: "Role orientation, workplace policies, and required first-week modules.",
    next: "Complete the onboarding checklist and upload supervisor acknowledgment.",
    modules: [
      ["Welcome orientation", "Done"],
      ["Workplace policies", "Done"],
      ["Supervisor acknowledgment", "Due soon"]
    ],
    resources: ["Orientation walkthrough", "OJT checklist PDF", "Company policy guide"],
    activity: ["Andrea Valdez completed the checklist", "New onboarding comment posted", "GMeet consultation available"]
  },
  safety: {
    code: "02",
    title: "Safety and Compliance",
    status: "In Progress",
    progress: 76,
    accent: "coral",
    description: "Incident reporting, lab safety, data privacy, and compliance checks.",
    next: "Review the safety reminders before class and submit the compliance quiz.",
    modules: [
      ["Lab safety briefing", "Done"],
      ["Incident reporting", "Open"],
      ["Data privacy basics", "Quiz"]
    ],
    resources: ["Safety reminders", "Incident report template", "Privacy policy notes"],
    activity: ["Jomar Mercado scored 81%", "Safety video posted", "Quiz deadline updated"]
  },
  supervisor: {
    code: "03",
    title: "Supervisor Skills Workshop",
    status: "Upcoming",
    progress: 48,
    accent: "sand",
    description: "Coaching checklists, feedback templates, and learner evaluation rubrics.",
    next: "Preview the workshop packet and prepare one coaching scenario.",
    modules: [
      ["Coaching checklist", "Preview"],
      ["Feedback templates", "Locked"],
      ["Learner evaluation", "Locked"]
    ],
    resources: ["Workshop overview", "Evaluation rubric", "Coaching scenario sample"],
    activity: ["Draft course prepared", "Resource packet added", "Learner evaluation rubric updated"]
  }
};

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function renderCourseWorkspace(courseId, triggerCard) {
  const course = courseWorkspaces[courseId];
  const courseList = triggerCard.closest("#courseList");
  if (!course || !courseList) return;

  courseCards.forEach((card) => {
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

  hero.append(heroText, heroMeta);

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
  stream.append(
    createTextElement("p", "section-label mb-1", "Next up"),
    createTextElement("h4", "h6 mb-2", course.next)
  );

  const moduleList = document.createElement("div");
  moduleList.className = "course-module-list";
  course.modules.forEach(([title, state], index) => {
    const item = document.createElement("div");
    item.className = "course-module-item";
    item.append(
      createTextElement("span", "course-module-number", String(index + 1).padStart(2, "0")),
      createTextElement("strong", "", title),
      createTextElement("span", "badge text-bg-info ms-auto", state)
    );
    moduleList.appendChild(item);
  });
  stream.appendChild(moduleList);

  const side = document.createElement("aside");
  side.className = "course-workspace-panel";

  const resourceTitle = createTextElement("h4", "h6 mb-2", "Classwork and resources");
  const resourceList = document.createElement("div");
  resourceList.className = "vstack gap-2";
  course.resources.forEach((resource) => {
    resourceList.appendChild(createTextElement("button", "btn btn-outline-secondary btn-sm text-start", resource));
  });

  const activityTitle = createTextElement("h4", "h6 mt-4 mb-2", adminApp ? "Learner activity" : "Recent activity");
  const activityList = document.createElement("div");
  activityList.className = "course-activity-list";
  course.activity.forEach((activity) => {
    activityList.appendChild(createTextElement("p", "small text-secondary mb-2", activity));
  });

  side.append(resourceTitle, resourceList, activityTitle, activityList);
  body.append(stream, side);
  workspace.append(hero, progress, body);
  courseList.insertAdjacentElement("afterend", workspace);
  observeMotionElements(workspace);
  workspace.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest" });
}

courseCards.forEach((card) => {
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
});

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

    courseCards.forEach((card) => {
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

dashboardBackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = "index.html";
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
  } catch {
    // Keep the demo usable if browser storage is unavailable.
  }
}

function getCurrentAuthor() {
  return adminApp ? "Admin" : "Student";
}

function isVisibleForSelectedClassroom(item) {
  return item.classroom === selectedClassroom || item.classroom === "all";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
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
  classroom.textContent = classroomTitles[announcement.classroom] || "Classroom";
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
  if (stored) return stored;

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
  if (stored) return stored;

  saveStoredItems("gthVideos", demoVideos);
  return demoVideos;
}

function extractYoutubeId(url) {
  try {
    const parsedUrl = new URL(url);
    let youtubeId = "";

    if (parsedUrl.hostname.includes("youtu.be")) {
      youtubeId = parsedUrl.pathname.replace("/", "");
    } else if (parsedUrl.searchParams.has("v")) {
      youtubeId = parsedUrl.searchParams.get("v");
    } else {
      const embedMatch = parsedUrl.pathname.match(/\/embed\/([^/?]+)/);
      youtubeId = embedMatch ? embedMatch[1] : "";
    }

    return /^[\w-]{11}$/.test(youtubeId) ? youtubeId : "";
  } catch {
    return "";
  }
}

function renderVideoCard(video, options = {}) {
  if (!options.admin) {
    const wrapper = document.createElement("article");
    wrapper.className = "col-12";

    const card = document.createElement("div");
    card.className = "announcement-item video-announcement-item";
    card.dataset.videoAction = "watch";
    card.dataset.videoId = video.id;
    card.role = "button";
    card.tabIndex = 0;

    const thumbnail = document.createElement("img");
    thumbnail.className = "video-announcement-thumb";
    thumbnail.src = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
    thumbnail.alt = "";

    const content = document.createElement("div");
    content.className = "video-announcement-content";

    const meta = document.createElement("div");
    meta.className = "d-flex flex-wrap gap-2 align-items-center mb-2";

    const classroom = document.createElement("span");
    classroom.className = "badge text-bg-info";
    classroom.textContent = classroomTitles[video.classroom] || "Classroom";

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
      createTextElement("span", "", "Watch anytime"),
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

  const thumbnail = document.createElement("img");
  thumbnail.className = "video-thumb";
  thumbnail.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
  thumbnail.alt = "";

  const body = document.createElement("div");
  body.className = "card-body";

  const meta = document.createElement("div");
  meta.className = "d-flex flex-wrap gap-2 align-items-center mb-2";

  const classroom = document.createElement("span");
  classroom.className = "badge text-bg-info";
  classroom.textContent = classroomTitles[video.classroom] || "Classroom";

  const time = document.createElement("small");
  time.className = "text-secondary";
  time.textContent = formatDate(video.createdAt);

  meta.append(classroom, time);

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

  if (studentVideos) {
    const classroomVideos = videos.filter(isVisibleForSelectedClassroom);

    studentVideos.replaceChildren();
    if (studentVideoClass) studentVideoClass.textContent = selectedClassroomTitle;

    if (!classroomVideos.length) {
      const empty = document.createElement("p");
      empty.className = "text-secondary mb-0";
      empty.textContent = "No videos for this classroom yet.";
      studentVideos.appendChild(empty);
      return;
    }

    classroomVideos.forEach((video) => {
      studentVideos.appendChild(renderVideoCard(video));
    });

    observeMotionElements(studentVideos);
  }
}

videoForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const url = document.querySelector("#videoUrl").value.trim();
  const youtubeId = extractYoutubeId(url);

  if (!youtubeId) {
    videoError?.classList.remove("d-none");
    return;
  }

  const videos = getVideos();
  videos.unshift({
    id: `video-${Date.now()}`,
    classroom: document.querySelector("#videoClassroom").value,
    title: document.querySelector("#videoTitle").value.trim(),
    youtubeId,
    url,
    createdAt: new Date().toISOString()
  });

  saveStoredItems("gthVideos", videos);
  videoError?.classList.add("d-none");
  videoForm.reset();
  renderVideos();
});

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-video-action]");
  if (!actionButton) return;

  const videos = getVideos();
  const video = videos.find((item) => item.id === actionButton.dataset.videoId);
  if (!video) return;

  if (actionButton.dataset.videoAction === "remove") {
    saveStoredItems("gthVideos", videos.filter((item) => item.id !== video.id));
    renderVideos();
    return;
  }

  if (actionButton.dataset.videoAction === "watch" && videoModal && videoModalFrame && window.bootstrap?.Modal) {
    videoModalFrame.src = `https://www.youtube.com/embed/${video.youtubeId}`;
    if (videoModalLabel) videoModalLabel.textContent = video.title;
    bootstrap.Modal.getOrCreateInstance(videoModal).show();
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
  if (videoModalFrame) videoModalFrame.src = "";
});

function getAssignments() {
  const stored = getStoredItems("gthAssignments", null);
  if (stored) return stored;

  saveStoredItems("gthAssignments", demoAssignments);
  return demoAssignments;
}

function formatDueDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getAssignmentSubmissions() {
  return getStoredItems("gthAssignmentSubmissions", []);
}

function getAssignmentSubmission(assignmentId) {
  return getAssignmentSubmissions().find((submission) => {
    return submission.assignmentId === assignmentId && submission.classroom === selectedClassroom;
  });
}

function renderAssignmentCard(assignment, options = {}) {
  const wrapper = document.createElement("article");
  wrapper.className = options.admin ? "col-12 col-md-6 col-xxl-4" : "col-12";

  const card = document.createElement("div");
  card.className = options.admin ? "card video-resource h-100" : "announcement-item";

  const body = document.createElement("div");
  body.className = options.admin ? "card-body" : "";

  const meta = document.createElement("div");
  meta.className = "d-flex flex-wrap gap-2 align-items-center mb-2";

  const classroom = document.createElement("span");
  classroom.className = "badge text-bg-info";
  classroom.textContent = classroomTitles[assignment.classroom] || "Classroom";

  const dueDate = document.createElement("span");
  dueDate.className = "badge text-bg-warning";
  dueDate.textContent = `Due ${formatDueDate(assignment.dueDate)}`;

  const created = document.createElement("small");
  created.className = "text-secondary";
  created.textContent = formatDate(assignment.createdAt);

  const title = document.createElement("h3");
  title.className = "h6 mb-2";
  title.textContent = assignment.title;

  const instructions = document.createElement("p");
  instructions.className = "text-secondary mb-0";
  instructions.textContent = assignment.instructions;

  meta.append(classroom, dueDate, created);
  body.append(meta, title, instructions);

  if (options.admin) {
    const actions = document.createElement("div");
    actions.className = "d-flex flex-wrap gap-2 mt-3";

    const removeButton = document.createElement("button");
    removeButton.className = "btn btn-outline-danger btn-sm";
    removeButton.type = "button";
    removeButton.dataset.assignmentAction = "remove";
    removeButton.dataset.assignmentId = assignment.id;
    removeButton.textContent = "Remove";

    actions.appendChild(removeButton);
    body.appendChild(actions);
  } else {
    const submission = getAssignmentSubmission(assignment.id);
    const uploadForm = document.createElement("form");
    uploadForm.className = "assignment-upload-form vstack gap-2 mt-3";
    uploadForm.dataset.assignmentUploadForm = assignment.id;

    const uploadLabel = document.createElement("label");
    uploadLabel.className = "form-label mb-0";
    uploadLabel.textContent = "Upload files";

    const fileInput = document.createElement("input");
    fileInput.className = "form-control mt-1";
    fileInput.name = "assignmentFiles";
    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.required = true;

    const submitButton = document.createElement("button");
    submitButton.className = "btn btn-primary btn-sm align-self-start";
    submitButton.type = "submit";
    submitButton.textContent = submission ? "Replace Upload" : "Upload";

    uploadLabel.appendChild(fileInput);
    uploadForm.append(uploadLabel, submitButton);
    body.appendChild(uploadForm);

    if (submission) {
      const submitted = document.createElement("div");
      submitted.className = "assignment-submission mt-3";

      const submittedTitle = document.createElement("strong");
      submittedTitle.className = "d-block mb-1";
      submittedTitle.textContent = "Submitted files";

      const submittedTime = document.createElement("small");
      submittedTime.className = "text-secondary d-block mb-2";
      submittedTime.textContent = formatDate(submission.submittedAt);

      const fileList = document.createElement("ul");
      fileList.className = "list-unstyled vstack gap-1 mb-0";

      submission.files.forEach((file) => {
        const fileItem = document.createElement("li");
        fileItem.className = "small";
        fileItem.textContent = `${file.name} (${formatFileSize(file.size)})`;
        fileList.appendChild(fileItem);
      });

      submitted.append(submittedTitle, submittedTime, fileList);
      body.appendChild(submitted);
    }
  }

  card.appendChild(body);
  wrapper.appendChild(card);
  return wrapper;
}

function renderAssignments() {
  const assignments = getAssignments().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (adminAssignments) {
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
}

assignmentForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.querySelector("#assignmentTitle").value.trim();
  const instructions = document.querySelector("#assignmentInstructions").value.trim();
  const dueDate = document.querySelector("#assignmentDueDate").value;

  if (!title || !instructions || !dueDate) return;

  const assignments = getAssignments();
  assignments.unshift({
    id: `assignment-${Date.now()}`,
    classroom: document.querySelector("#assignmentClassroom").value,
    title,
    instructions,
    dueDate,
    createdAt: new Date().toISOString()
  });

  saveStoredItems("gthAssignments", assignments);
  assignmentForm.reset();
  renderAssignments();
});

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-assignment-action]");
  if (!actionButton) return;

  if (actionButton.dataset.assignmentAction === "remove") {
    saveStoredItems("gthAssignments", getAssignments().filter((item) => item.id !== actionButton.dataset.assignmentId));
    saveStoredItems("gthAssignmentSubmissions", getAssignmentSubmissions().filter((item) => item.assignmentId !== actionButton.dataset.assignmentId));
    renderAssignments();
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-assignment-upload-form]");
  if (!form) return;

  event.preventDefault();

  const fileInput = form.querySelector("input[type='file']");
  const files = Array.from(fileInput.files || []);
  if (!files.length) return;

  const assignmentId = form.dataset.assignmentUploadForm;
  const submissions = getAssignmentSubmissions().filter((submission) => {
    return !(submission.assignmentId === assignmentId && submission.classroom === selectedClassroom);
  });

  submissions.push({
    id: `assignment-submission-${Date.now()}`,
    assignmentId,
    classroom: selectedClassroom,
    files: files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type || "Unknown"
    })),
    submittedAt: new Date().toISOString()
  });

  saveStoredItems("gthAssignmentSubmissions", submissions);
  renderAssignments();
});

function getInvitations() {
  const stored = getStoredItems("gthInvitations", null);
  if (stored) return stored;

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
  classroom.textContent = classroomTitles[invitation.classroom] || "Classroom";

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

  if (studentInvitations) {
    const classroomInvitations = invitations.filter(isVisibleForSelectedClassroom);

    studentInvitations.replaceChildren();
    if (studentInvitationClass) studentInvitationClass.textContent = selectedClassroomTitle;

    if (!classroomInvitations.length) {
      const empty = document.createElement("p");
      empty.className = "text-secondary mb-0";
      empty.textContent = "No GMeet links for this classroom yet.";
      studentInvitations.appendChild(empty);
      return;
    }

    classroomInvitations.forEach((invitation) => {
      studentInvitations.appendChild(renderInvitationCard(invitation));
    });

    observeMotionElements(studentInvitations);
  }
}

invitationForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.querySelector("#invitationTitle").value.trim();
  const link = document.querySelector("#invitationLink").value.trim();
  if (!title || !link) return;

  const invitations = getInvitations();
  invitations.unshift({
    id: `invitation-${Date.now()}`,
    classroom: document.querySelector("#invitationClassroom").value,
    title,
    link,
    createdAt: new Date().toISOString()
  });

  saveStoredItems("gthInvitations", invitations);
  invitationForm.reset();
  renderInvitations();
});

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-invitation-action]");
  if (!actionButton) return;

  if (actionButton.dataset.invitationAction === "remove") {
    saveStoredItems("gthInvitations", getInvitations().filter((item) => item.id !== actionButton.dataset.invitationId));
    renderInvitations();
  }
});

function getActiveChatClassroom() {
  if (chatClassroom) return chatClassroom.value;
  return selectedClassroom;
}

function getChatMessages() {
  return getStoredItems("gthChatMessages", []);
}

function renderChatMessages() {
  if (!chatMessages) return;

  const activeClassroom = getActiveChatClassroom();
  const messages = getChatMessages().filter((message) => message.classroom === activeClassroom);
  chatMessages.replaceChildren();

  if (!messages.length) {
    const empty = document.createElement("p");
    empty.className = "chat-empty text-secondary small mb-0";
    empty.textContent = "No messages yet.";
    chatMessages.appendChild(empty);
    return;
  }

  const currentAuthor = chatbox?.dataset.role === "admin" ? "Admin" : "Student";

  messages.slice(-20).forEach((message) => {
    const item = document.createElement("div");
    item.className = "chat-message";
    if (message.author === currentAuthor) {
      item.classList.add("chat-message-own");
    }

    const meta = document.createElement("small");
    meta.className = "text-secondary d-block";
    meta.textContent = `${message.author} - ${formatDate(message.createdAt)}`;

    const text = document.createElement("p");
    text.className = "mb-0";
    text.textContent = message.text;

    item.append(meta, text);
    chatMessages.appendChild(item);
  });

  observeMotionElements(chatMessages);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatClassroom?.addEventListener("change", renderChatMessages);

chatForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = chatMessage.value.trim();
  if (!text) return;

  const messages = getChatMessages();
  messages.push({
    id: `chat-${Date.now()}`,
    classroom: getActiveChatClassroom(),
    author: chatbox?.dataset.role === "admin" ? "Admin" : "Student",
    text,
    createdAt: new Date().toISOString()
  });

  saveStoredItems("gthChatMessages", messages);
  chatMessage.value = "";
  renderChatMessages();
});

chatToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    chatbox?.classList.toggle("chatbox-collapsed");
    toggle.textContent = chatbox?.classList.contains("chatbox-collapsed") ? "Open" : "Minimize";
  });
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
  window.location.replace("login.html");
});

portalLoginForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.querySelector("#portalUsername").value.trim();
  const password = document.querySelector("#portalPassword").value;

  if (username.toLowerCase() === "admin" && password === "123") {
    sessionStorage.setItem("gthAdminLoggedIn", "true");
    window.location.replace("admin.html");
    return;
  }

  if (username.toLowerCase() === "user" && password === "321") {
    sessionStorage.setItem("gthClientLoggedIn", "true");
    window.location.replace("classrooms.html");
    return;
  }

  portalLoginError?.classList.remove("d-none");
});

clientLogout?.addEventListener("click", () => {
  sessionStorage.removeItem("gthClientLoggedIn");
  window.location.replace("login.html");
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
observeMotionElements();
