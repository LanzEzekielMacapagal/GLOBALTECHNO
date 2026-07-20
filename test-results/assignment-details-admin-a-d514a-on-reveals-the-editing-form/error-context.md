# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assignment-details.spec.js >> admin assignment edit button reveals the editing form
- Location: assignment-details.spec.js:59:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img "Global Techno Hub Learning Center logo" [ref=e6]
      - paragraph [ref=e7]: Portal access
      - heading "Global Techno Hub" [level=1] [ref=e8]
      - paragraph [ref=e9]: Sign in to continue to your dashboard.
    - generic [ref=e10]:
      - generic [ref=e11]:
        - text: Username
        - textbox "Username" [ref=e12]
      - generic [ref=e13]:
        - text: Password
        - generic [ref=e14]:
          - textbox "Password Toggle password visibility" [ref=e15]
          - button "Toggle password visibility" [ref=e16] [cursor=pointer]:
            - generic [ref=e17]: 
      - button "Login" [ref=e18] [cursor=pointer]
      - link "Create Account" [ref=e19] [cursor=pointer]:
        - /url: register.html
  - article [ref=e21]:
    - generic [ref=e23]:
      - generic [ref=e24]:
        - generic [ref=e25]: All Subjects
        - generic [ref=e26]: General Activity
        - generic [ref=e27]: File upload
        - generic [ref=e28]: Due Jan 1, 2026, 7:59 AM
        - generic [ref=e29]: Jul 20, 10:07 PM
      - generic [ref=e30]:
        - heading "Original title" [level=3] [ref=e31]
        - button "View details +" [ref=e32] [cursor=pointer]:
          - generic [ref=e33]: View details
          - generic [ref=e34]: +
      - paragraph [ref=e35]: Original instructions
      - generic [ref=e36]:
        - button "Edit" [ref=e37] [cursor=pointer]
        - button "Remove" [ref=e38] [cursor=pointer]
```

# Test source

```ts
  1   | const { test, expect } = require("@playwright/test");
  2   | 
  3   | test("admin assignment cards expose a visible details panel", async ({ page }) => {
  4   |   await page.goto("http://127.0.0.1:3000/admin.html");
  5   | 
  6   |   await page.evaluate(() => {
  7   |     const assignment = {
  8   |       id: "assignment-test-1",
  9   |       courseId: "course-test-1",
  10  |       title: "Research summary",
  11  |       instructions: "Prepare a short summary of the unit and upload your notes.",
  12  |       dueDate: "2025-12-31T23:59:00.000Z",
  13  |       classroom: "all",
  14  |       subject: "General Activity",
  15  |       type: "file",
  16  |       attachments: [{ name: "notes.pdf", type: "application/pdf", size: 2048, data: "data:application/pdf;base64,AA==" }],
  17  |       createdAt: new Date().toISOString()
  18  |     };
  19  | 
  20  |     const container = document.createElement("div");
  21  |     container.id = "assignment-test-root";
  22  |     document.body.appendChild(container);
  23  | 
  24  |     window.localStorage.setItem("gthAssignments", JSON.stringify([assignment]));
  25  |     window.expandedAssignmentId = assignment.id;
  26  |     container.appendChild(window.renderAssignmentCard(assignment, { admin: true }));
  27  |   });
  28  | 
  29  |   await expect(page.locator(".assignment-details-panel").first()).toBeVisible();
  30  | });
  31  | 
  32  | test("admin assignment form exposes a multi-file picker", async ({ page }) => {
  33  |   await page.goto("http://127.0.0.1:3000/admin.html");
  34  | 
  35  |   const pickerPresent = await page.evaluate(() => {
  36  |     const form = window.renderCourseAssignmentForm("course-test-1");
  37  |     document.body.appendChild(form);
  38  |     const picker = form.querySelector('[data-multi-file-picker="true"]');
  39  |     const input = form.querySelector('input[name="attachments"]');
  40  |     return Boolean(picker && input?.multiple);
  41  |   });
  42  | 
  43  |   expect(pickerPresent).toBe(true);
  44  | });
  45  | 
  46  | test("admin assignment form shows an add-file control", async ({ page }) => {
  47  |   await page.goto("http://127.0.0.1:3000/admin.html");
  48  | 
  49  |   const hasAddButton = await page.evaluate(() => {
  50  |     const form = window.renderCourseAssignmentForm("course-test-1");
  51  |     document.body.appendChild(form);
  52  |     const button = Array.from(form.querySelectorAll("button")).find((item) => item.textContent.includes("Add a file"));
  53  |     return Boolean(button);
  54  |   });
  55  | 
  56  |   expect(hasAddButton).toBe(true);
  57  | });
  58  | 
  59  | test("admin assignment edit button reveals the editing form", async ({ page }) => {
  60  |   await page.goto("http://127.0.0.1:3000/admin.html");
  61  | 
  62  |   const result = await page.evaluate(() => {
  63  |     const assignment = {
  64  |       id: "assignment-edit-visibility-test-1",
  65  |       courseId: "course-test-1",
  66  |       title: "Original title",
  67  |       instructions: "Original instructions",
  68  |       dueDate: "2025-12-31T23:59:00.000Z",
  69  |       classroom: "all",
  70  |       subject: "General Activity",
  71  |       type: "file",
  72  |       attachments: [],
  73  |       createdAt: new Date().toISOString()
  74  |     };
  75  | 
  76  |     const container = document.createElement("div");
  77  |     container.id = "assignment-edit-visibility-test-root";
  78  |     document.body.appendChild(container);
  79  |     container.appendChild(window.renderAssignmentCard(assignment, { admin: true }));
  80  | 
  81  |     const editButton = container.querySelector("[data-assignment-action='edit']");
  82  |     editButton.click();
  83  | 
  84  |     const form = container.querySelector("[data-assignment-edit-form]");
  85  |     return {
  86  |       formHidden: form?.hidden,
  87  |       titleValue: form?.querySelector('input[name="title"]').value,
  88  |       dueValue: form?.querySelector('input[name="dueDate"]').value
  89  |     };
  90  |   });
  91  | 
> 92  |   expect(result.formHidden).toBe(false);
      |                             ^ Error: expect(received).toBe(expected) // Object.is equality
  93  |   expect(result.titleValue).toBe("Original title");
  94  |   expect(result.dueValue).toContain("2025-12-31T");
  95  | });
  96  | 
  97  | test("admin assignment edits submit multipart updates with files", async ({ page }) => {
  98  |   await page.goto("http://127.0.0.1:3000/admin.html");
  99  | 
  100 |   const result = await page.evaluate(async () => {
  101 |     const assignment = {
  102 |       id: "assignment-edit-test-1",
  103 |       courseId: "course-test-1",
  104 |       title: "Original title",
  105 |       instructions: "Original instructions",
  106 |       dueDate: "2025-12-31T23:59:00.000Z",
  107 |       classroom: "all",
  108 |       subject: "General Activity",
  109 |       type: "file",
  110 |       attachments: [{ name: "existing.pdf", type: "application/pdf", size: 2048 }],
  111 |       createdAt: new Date().toISOString()
  112 |     };
  113 | 
  114 |     const container = document.createElement("div");
  115 |     container.id = "assignment-edit-test-root";
  116 |     document.body.appendChild(container);
  117 |     container.appendChild(window.renderAssignmentCard(assignment, { admin: true }));
  118 | 
  119 |     const calls = [];
  120 |     const originalFetch = window.fetch.bind(window);
  121 |     window.fetch = async (url, options = {}) => {
  122 |       calls.push({ url, method: options.method || "GET", body: options.body });
  123 |       return new Response(JSON.stringify({ code: 200, message: "ok", data: assignment }), {
  124 |         status: 200,
  125 |         headers: { "Content-Type": "application/json" }
  126 |       });
  127 |     };
  128 | 
  129 |     const editButton = container.querySelector("[data-assignment-action='edit']");
  130 |     editButton.click();
  131 | 
  132 |     const form = container.querySelector("[data-assignment-edit-form]");
  133 |     form.querySelector('input[name="title"]').value = "Updated title";
  134 |     form.querySelector('input[name="title"]').dispatchEvent(new Event("input", { bubbles: true }));
  135 |     form.querySelector('textarea[name="instructions"]').value = "Updated instructions";
  136 |     form.querySelector('textarea[name="instructions"]').dispatchEvent(new Event("input", { bubbles: true }));
  137 |     form.querySelector('input[name="dueDate"]').value = "2026-08-01T09:00";
  138 |     form.querySelector('input[name="dueDate"]').dispatchEvent(new Event("input", { bubbles: true }));
  139 | 
  140 |     const fileInput = form.querySelector('input[name="attachments"]');
  141 |     const dataTransfer = new DataTransfer();
  142 |     const file = new File(["hello"], "notes.txt", { type: "text/plain" });
  143 |     dataTransfer.items.add(file);
  144 |     Object.defineProperty(fileInput, "files", { value: dataTransfer.files, configurable: true });
  145 |     fileInput.dispatchEvent(new Event("change", { bubbles: true }));
  146 | 
  147 |     form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  148 |     await new Promise((resolve) => setTimeout(resolve, 5));
  149 | 
  150 |     window.fetch = originalFetch;
  151 | 
  152 |     const request = calls[0];
  153 |     return {
  154 |       bodyType: request?.body?.constructor?.name || typeof request?.body,
  155 |       hasAttachments: request?.body instanceof FormData && request.body.has("attachments"),
  156 |       title: request?.body instanceof FormData ? request.body.get("title") : null
  157 |     };
  158 |   });
  159 | 
  160 |   expect(result.bodyType).toBe("FormData");
  161 |   expect(result.hasAttachments).toBe(true);
  162 |   expect(result.title).toBe("Updated title");
  163 | });
  164 | 
  165 | test("admin assignment grading panel exposes score controls for submitted work", async ({ page }) => {
  166 |   await page.goto("http://127.0.0.1:3000/admin.html");
  167 | 
  168 |   const panelState = await page.evaluate(() => {
  169 |     const assignment = {
  170 |       id: "assignment-grading-test-1",
  171 |       courseId: "course-test-1",
  172 |       title: "Reflection report",
  173 |       instructions: "Write a short reflection.",
  174 |       dueDate: "2025-12-31T23:59:00.000Z",
  175 |       classroom: "all",
  176 |       subject: "General Activity",
  177 |       type: "essay",
  178 |       points: 20,
  179 |       attachments: [],
  180 |       createdAt: new Date().toISOString()
  181 |     };
  182 | 
  183 |     window.serverAssignments = [assignment];
  184 |     window.serverAssignmentSubmissions = [{
  185 |       id: "submission-test-1",
  186 |       assignmentId: assignment.id,
  187 |       courseId: assignment.courseId,
  188 |       studentId: "student-test-1",
  189 |       studentName: "Jordan Lee",
  190 |       submissionType: "essay",
  191 |       essay: "I learned a lot from the exercise.",
  192 |       attachments: [],
```