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
