(function (root, factory) {
  const api = factory();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  root.courseLinking = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function normalizeCourseReference(value = "") {
    return String(value ?? "").trim();
  }

  function getCourseId(course = {}) {
    return normalizeCourseReference(course?._id || course?.id || course?.courseId || "");
  }

  function getCourseTitle(course = {}) {
    return normalizeCourseReference(course?.title || "");
  }

  function getCourseInvitationCode(course = {}) {
    return normalizeCourseReference(course?.invitationCode || "").toUpperCase();
  }

  function findCourseByReference(reference = "", courses = []) {
    const normalizedReference = normalizeCourseReference(reference);
    if (!normalizedReference) return null;

    const normalizedLower = normalizedReference.toLowerCase();
    const normalizedUpper = normalizedReference.toUpperCase();

    const directMatch = Array.isArray(courses)
      ? courses.find((course) => {
          const courseId = getCourseId(course);
          return courseId && (courseId === normalizedReference || courseId.toLowerCase() === normalizedLower);
        })
      : null;
    if (directMatch) return directMatch;

    return Array.isArray(courses)
      ? courses.find((course) => {
          const title = getCourseTitle(course).toLowerCase();
          const invitationCode = getCourseInvitationCode(course);
          return title === normalizedLower || invitationCode === normalizedUpper;
        }) || null
      : null;
  }

  function getCourseIdByReference(reference = "", courses = []) {
    return getCourseId(findCourseByReference(reference, courses));
  }

  function getCourseTitleByReference(reference = "", courses = [], fallback = "Subject") {
    const course = findCourseByReference(reference, courses);
    return getCourseTitle(course) || normalizeCourseReference(fallback);
  }

  return {
    normalizeCourseReference,
    getCourseId,
    getCourseTitle,
    getCourseInvitationCode,
    findCourseByReference,
    getCourseIdByReference,
    getCourseTitleByReference
  };
});
