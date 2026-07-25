function shouldShowPrivateMessageRecipient(user = {}, activeCourseIds = []) {
  if (!user) return false;
  if (String(user.role || "").toLowerCase() === "admin") return false;

  if (user.isActive !== false) return true;

  const enrolledCourses = Array.isArray(user.enrolledCourses) ? user.enrolledCourses : [];
  return enrolledCourses.some((courseId) => activeCourseIds.includes(String(courseId)));
}

module.exports = {
  shouldShowPrivateMessageRecipient,
};
