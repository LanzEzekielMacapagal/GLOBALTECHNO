const { test, expect } = require("@playwright/test");

test("admin assignment cards expose a visible details panel", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/admin.html");

  await page.evaluate(() => {
    const assignment = {
      id: "assignment-test-1",
      courseId: "course-test-1",
      title: "Research summary",
      instructions: "Prepare a short summary of the unit and upload your notes.",
      dueDate: "2025-12-31T23:59:00.000Z",
      classroom: "all",
      subject: "General Activity",
      type: "file",
      attachments: [{ name: "notes.pdf", type: "application/pdf", size: 2048, data: "data:application/pdf;base64,AA==" }],
      createdAt: new Date().toISOString()
    };

    const container = document.createElement("div");
    container.id = "assignment-test-root";
    document.body.appendChild(container);

    window.localStorage.setItem("gthAssignments", JSON.stringify([assignment]));
    window.expandedAssignmentId = assignment.id;
    container.appendChild(window.renderAssignmentCard(assignment, { admin: true }));
  });

  await expect(page.locator(".assignment-details-panel").first()).toBeVisible();
});

test("admin assignment form exposes a multi-file picker", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/admin.html");

  const pickerPresent = await page.evaluate(() => {
    const form = window.renderCourseAssignmentForm("course-test-1");
    document.body.appendChild(form);
    const picker = form.querySelector('[data-multi-file-picker="true"]');
    const input = form.querySelector('input[name="attachments"]');
    return Boolean(picker && input?.multiple);
  });

  expect(pickerPresent).toBe(true);
});

test("admin assignment form shows an add-file control", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/admin.html");

  const hasAddButton = await page.evaluate(() => {
    const form = window.renderCourseAssignmentForm("course-test-1");
    document.body.appendChild(form);
    const button = Array.from(form.querySelectorAll("button")).find((item) => item.textContent.includes("Add a file"));
    return Boolean(button);
  });

  expect(hasAddButton).toBe(true);
});

test("admin assignment edit button reveals the editing form", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/admin.html");

  const result = await page.evaluate(() => {
    const assignment = {
      id: "assignment-edit-visibility-test-1",
      courseId: "course-test-1",
      title: "Original title",
      instructions: "Original instructions",
      dueDate: "2025-12-31T23:59:00.000Z",
      classroom: "all",
      subject: "General Activity",
      type: "file",
      attachments: [],
      createdAt: new Date().toISOString()
    };

    const container = document.createElement("div");
    container.id = "assignment-edit-visibility-test-root";
    document.body.appendChild(container);
    container.appendChild(window.renderAssignmentCard(assignment, { admin: true }));

    const editButton = container.querySelector("[data-assignment-action='edit']");
    editButton.click();

    const form = container.querySelector("[data-assignment-edit-form]");
    return {
      formHidden: form?.hidden,
      titleValue: form?.querySelector('input[name="title"]').value,
      dueValue: form?.querySelector('input[name="dueDate"]').value
    };
  });

  expect(result.formHidden).toBe(false);
  expect(result.titleValue).toBe("Original title");
  expect(result.dueValue).toContain("2025-12-31T");
});

test("admin assignment edits submit multipart updates with files", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/admin.html");

  const result = await page.evaluate(async () => {
    const assignment = {
      id: "assignment-edit-test-1",
      courseId: "course-test-1",
      title: "Original title",
      instructions: "Original instructions",
      dueDate: "2025-12-31T23:59:00.000Z",
      classroom: "all",
      subject: "General Activity",
      type: "file",
      attachments: [{ name: "existing.pdf", type: "application/pdf", size: 2048 }],
      createdAt: new Date().toISOString()
    };

    const container = document.createElement("div");
    container.id = "assignment-edit-test-root";
    document.body.appendChild(container);
    container.appendChild(window.renderAssignmentCard(assignment, { admin: true }));

    const calls = [];
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (url, options = {}) => {
      calls.push({ url, method: options.method || "GET", body: options.body });
      return new Response(JSON.stringify({ code: 200, message: "ok", data: assignment }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    };

    const editButton = container.querySelector("[data-assignment-action='edit']");
    editButton.click();

    const form = container.querySelector("[data-assignment-edit-form]");
    form.querySelector('input[name="title"]').value = "Updated title";
    form.querySelector('input[name="title"]').dispatchEvent(new Event("input", { bubbles: true }));
    form.querySelector('textarea[name="instructions"]').value = "Updated instructions";
    form.querySelector('textarea[name="instructions"]').dispatchEvent(new Event("input", { bubbles: true }));
    form.querySelector('input[name="dueDate"]').value = "2026-08-01T09:00";
    form.querySelector('input[name="dueDate"]').dispatchEvent(new Event("input", { bubbles: true }));

    const fileInput = form.querySelector('input[name="attachments"]');
    const dataTransfer = new DataTransfer();
    const file = new File(["hello"], "notes.txt", { type: "text/plain" });
    dataTransfer.items.add(file);
    Object.defineProperty(fileInput, "files", { value: dataTransfer.files, configurable: true });
    fileInput.dispatchEvent(new Event("change", { bubbles: true }));

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await new Promise((resolve) => setTimeout(resolve, 5));

    window.fetch = originalFetch;

    const request = calls[0];
    return {
      bodyType: request?.body?.constructor?.name || typeof request?.body,
      hasAttachments: request?.body instanceof FormData && request.body.has("attachments"),
      title: request?.body instanceof FormData ? request.body.get("title") : null
    };
  });

  expect(result.bodyType).toBe("FormData");
  expect(result.hasAttachments).toBe(true);
  expect(result.title).toBe("Updated title");
});

test("admin assignment grading panel exposes score controls for submitted work", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/admin.html");

  const panelState = await page.evaluate(() => {
    const assignment = {
      id: "assignment-grading-test-1",
      courseId: "course-test-1",
      title: "Reflection report",
      instructions: "Write a short reflection.",
      dueDate: "2025-12-31T23:59:00.000Z",
      classroom: "all",
      subject: "General Activity",
      type: "essay",
      points: 20,
      attachments: [],
      createdAt: new Date().toISOString()
    };

    window.serverAssignments = [assignment];
    window.serverAssignmentSubmissions = [{
      id: "submission-test-1",
      assignmentId: assignment.id,
      courseId: assignment.courseId,
      studentId: "student-test-1",
      studentName: "Jordan Lee",
      submissionType: "essay",
      essay: "I learned a lot from the exercise.",
      attachments: [],
      submittedAt: new Date().toISOString()
    }];

    const panel = window.renderCourseAssignmentManualGradingPanel("course-test-1");
    document.body.appendChild(panel);
    const scoreInput = panel.querySelector('input[name="assignmentScore"]');
    const feedbackField = panel.querySelector('textarea[name="assignmentFeedback"]');
    return { hasPanel: Boolean(panel), hasScoreInput: Boolean(scoreInput), hasFeedbackField: Boolean(feedbackField) };
  });

  expect(panelState.hasPanel).toBe(true);
  expect(panelState.hasScoreInput).toBe(true);
  expect(panelState.hasFeedbackField).toBe(true);
});

test("student submissions are persisted to the shared assignment submission store", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/admin.html");

  const persisted = await page.evaluate(() => {
    if (typeof window.persistAssignmentSubmissionToStore !== "function") {
      return { ok: false, reason: "missing-helper" };
    }

    const submission = {
      id: "submission-store-test-1",
      assignmentId: "assignment-store-test-1",
      courseId: "course-test-1",
      studentId: "student-test-1",
      studentName: "Jordan Lee",
      submissionType: "essay",
      essay: "I completed the assignment.",
      attachments: [],
      submittedAt: new Date().toISOString()
    };

    window.persistAssignmentSubmissionToStore(submission);
    const stored = JSON.parse(window.localStorage.getItem("gthAssignmentSubmissions") || "[]");
    const match = stored.find((item) => item.id === submission.id);

    return {
      ok: true,
      storedCount: stored.length,
      hasMatch: Boolean(match),
      essay: match?.essay || ""
    };
  });

  expect(persisted.ok).toBe(true);
  expect(persisted.hasMatch).toBe(true);
  expect(persisted.storedCount).toBeGreaterThan(0);
  expect(persisted.essay).toBe("I completed the assignment.");
});
