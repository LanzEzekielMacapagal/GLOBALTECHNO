const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/admin.html');
  const result = await page.evaluate(() => {
    const assignment = {
      id: 'assignment-grading-test-1',
      courseId: 'course-test-1',
      title: 'Reflection report',
      instructions: 'Write a short reflection.',
      dueDate: '2025-12-31T23:59:00.000Z',
      classroom: 'all',
      subject: 'General Activity',
      type: 'essay',
      points: 20,
      attachments: [],
      createdAt: new Date().toISOString()
    };
    window.serverAssignments = [assignment];
    window.serverAssignmentSubmissions = [{
      id: 'submission-test-1',
      assignmentId: assignment.id,
      courseId: assignment.courseId,
      studentId: 'student-test-1',
      studentName: 'Jordan Lee',
      submissionType: 'essay',
      essay: 'I learned a lot from the exercise.',
      attachments: [],
      submittedAt: new Date().toISOString()
    }];
    const panel = window.renderCourseAssignmentManualGradingPanel('course-test-1');
    document.body.appendChild(panel);
    return {
      innerText: panel.innerText,
      outerHTML: panel.outerHTML,
      scoreInputCount: panel.querySelectorAll('input[name="assignmentScore"]').length,
      feedbackInputCount: panel.querySelectorAll('textarea[name="assignmentFeedback"]').length,
      submissionEntries: window.renderCourseAssignmentManualGradingPanel ? 'ok' : 'missing'
    };
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
