# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assignment-details.spec.js >> student assignment cards reopen after an approved extra attempt is loaded
- Location: assignment-details.spec.js:365:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
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
  - generic [ref=e22]:
    - generic [ref=e23]:
      - heading "Course" [level=3] [ref=e24]
      - text: 1 assignment
    - group [ref=e26]:
      - generic "Reflection report Due Jan 1, 2026, 7:59 AM Submitted +" [ref=e27] [cursor=pointer]:
        - generic [ref=e28]:
          - strong [ref=e29]: Reflection report
          - generic [ref=e30]: Due Jan 1, 2026, 7:59 AM
        - generic [ref=e31]: Submitted
        - text: +
```

# Test source

```ts
  359 |   });
  360 | 
  361 |   expect(renderedState.hasApprovalPanel).toBe(true);
  362 |   expect(renderedState.approvalText).toContain("Add attempt approvals");
  363 | });
  364 | 
  365 | test("student assignment cards reopen after an approved extra attempt is loaded", async ({ page }) => {
  366 |   await page.addInitScript(() => {
  367 |     sessionStorage.setItem("gthCurrentUser", JSON.stringify({
  368 |       _id: "student-extra-open-1",
  369 |       id: "student-extra-open-1",
  370 |       username: "ava",
  371 |       fullName: "Ava Reyes",
  372 |       enrolledCourses: ["course-test-1"]
  373 |     }));
  374 |   });
  375 | 
  376 |   await page.goto("http://127.0.0.1:3000/client.html");
  377 | 
  378 |   const renderedState = await page.evaluate(async () => {
  379 |     const assignment = {
  380 |       id: "assignment-extra-open-test-1",
  381 |       courseId: "course-test-1",
  382 |       title: "Reflection report",
  383 |       instructions: "Write a short reflection.",
  384 |       dueDate: "2025-12-31T23:59:00.000Z",
  385 |       classroom: "all",
  386 |       subject: "General Activity",
  387 |       type: "essay",
  388 |       points: 20,
  389 |       attachments: [],
  390 |       createdAt: new Date().toISOString()
  391 |     };
  392 | 
  393 |     console.log("=== Test Debug ===");
  394 |     console.log("currentStudent:", window.currentStudent);
  395 |     console.log("assignment:", assignment);
  396 |     
  397 |     window.serverAssignments = [assignment];
  398 |     window.serverCourseEnrolledStudents = {
  399 |       "course-test-1": [
  400 |         { id: "student-extra-open-1", fullName: "Ava Reyes", classroom: "all" }
  401 |       ]
  402 |     };
  403 |     window.serverAssignmentExtraChances = [];
  404 |     window.serverAssignmentSubmissions = [];
  405 |     window.studentAssignments = document.createElement("div");
  406 |     window.studentAssignments.id = "studentAssignments";
  407 |     document.body.appendChild(window.studentAssignments);
  408 | 
  409 |     window.fetch = async (url) => {
  410 |       const requestUrl = String(url || "");
  411 |       console.log("Mock fetch called with URL:", requestUrl);
  412 |       
  413 |       if (requestUrl.includes("/assignment-extra-chances")) {
  414 |         console.log("Returning extra chance data");
  415 |         return {
  416 |           ok: true,
  417 |           json: async () => ({
  418 |             code: 200,
  419 |             data: [{
  420 |               id: "chance-extra-open-1",
  421 |               courseId: "course-test-1",
  422 |               assignmentId: assignment.id,
  423 |               studentId: "student-extra-open-1",
  424 |               studentName: "Ava Reyes",
  425 |               grantedAt: new Date().toISOString(),
  426 |               usedAt: null
  427 |             }]
  428 |           })
  429 |         };
  430 |       }
  431 | 
  432 |       if (requestUrl.includes("/assignments")) {
  433 |         console.log("Returning assignments data");
  434 |         return {
  435 |           ok: true,
  436 |           json: async () => ({ code: 200, data: [assignment] })
  437 |         };
  438 |       }
  439 | 
  440 |       console.log("Returning empty data");
  441 |       return {
  442 |         ok: true,
  443 |         json: async () => ({ code: 200, data: [] })
  444 |       };
  445 |     };
  446 | 
  447 |     console.log("Calling renderStudentAssignmentsByCourse");
  448 |     await window.renderStudentAssignmentsByCourse();
  449 |     console.log("Render complete");
  450 |     console.log("serverAssignmentExtraChances:", window.serverAssignmentExtraChances);
  451 |     console.log("studentAssignments HTML:", window.studentAssignments.innerHTML);
  452 |     
  453 |     return {
  454 |       hasSubmitForm: Boolean(window.studentAssignments.querySelector(".course-assignment-answer")),
  455 |       text: (window.studentAssignments.textContent || "").trim()
  456 |     };
  457 |   });
  458 | 
> 459 |   expect(renderedState.hasSubmitForm).toBe(true);
      |                                       ^ Error: expect(received).toBe(expected) // Object.is equality
  460 |   expect(renderedState.text).toContain("Reflection report");
  461 | });
  462 | 
  463 | test("student assignment cards display grade and feedback from shared submission data", async ({ page }) => {
  464 |   await page.goto("http://127.0.0.1:3000/admin.html");
  465 | 
  466 |   const renderedState = await page.evaluate(() => {
  467 |     const assignment = {
  468 |       id: "assignment-student-display-test-1",
  469 |       courseId: "course-test-1",
  470 |       title: "Reflection report",
  471 |       instructions: "Write a short reflection.",
  472 |       dueDate: "2025-12-31T23:59:00.000Z",
  473 |       classroom: "all",
  474 |       subject: "General Activity",
  475 |       type: "essay",
  476 |       points: 25,
  477 |       attachments: [],
  478 |       createdAt: new Date().toISOString()
  479 |     };
  480 | 
  481 |     window.currentStudent = { id: "student-test-2", _id: "student-test-2", name: "Jordan", enrolledCourses: ["course-test-1"] };
  482 |     window.studentAssignmentSubmissions = {};
  483 |     window.serverAssignmentSubmissions = [{
  484 |       id: "submission-student-display-test-1",
  485 |       assignmentId: assignment.id,
  486 |       courseId: assignment.courseId,
  487 |       studentId: "student-test-2",
  488 |       studentName: "Jordan",
  489 |       submissionType: "essay",
  490 |       essay: "I learned a lot from the exercise.",
  491 |       score: 18,
  492 |       feedback: "Great work",
  493 |       submittedAt: new Date().toISOString()
  494 |     }];
  495 | 
  496 |     const card = window.renderCourseAssignmentItem(assignment);
  497 |     document.body.appendChild(card);
  498 |     const text = card.textContent || "";
  499 |     return {
  500 |       hasScoreBadge: text.includes("18/25 pts"),
  501 |       hasFeedbackText: text.includes("Feedback: Great work"),
  502 |       hasPointsBadge: text.includes("25 pts")
  503 |     };
  504 |   });
  505 | 
  506 |   expect(renderedState.hasScoreBadge).toBe(true);
  507 |   expect(renderedState.hasFeedbackText).toBe(true);
  508 |   expect(renderedState.hasPointsBadge).toBe(true);
  509 | });
  510 | 
  511 | test("student submissions are persisted to the shared assignment submission store", async ({ page }) => {
  512 |   await page.goto("http://127.0.0.1:3000/admin.html");
  513 | 
  514 |   const persisted = await page.evaluate(() => {
  515 |     if (typeof window.persistAssignmentSubmissionToStore !== "function") {
  516 |       return { ok: false, reason: "missing-helper" };
  517 |     }
  518 | 
  519 |     const submission = {
  520 |       id: "submission-store-test-1",
  521 |       assignmentId: "assignment-store-test-1",
  522 |       courseId: "course-test-1",
  523 |       studentId: "student-test-1",
  524 |       studentName: "Jordan Lee",
  525 |       submissionType: "essay",
  526 |       essay: "I completed the assignment.",
  527 |       attachments: [],
  528 |       submittedAt: new Date().toISOString()
  529 |     };
  530 | 
  531 |     window.persistAssignmentSubmissionToStore(submission);
  532 |     const stored = JSON.parse(window.localStorage.getItem("gthAssignmentSubmissions") || "[]");
  533 |     const match = stored.find((item) => item.id === submission.id);
  534 | 
  535 |     return {
  536 |       ok: true,
  537 |       storedCount: stored.length,
  538 |       hasMatch: Boolean(match),
  539 |       essay: match?.essay || ""
  540 |     };
  541 |   });
  542 | 
  543 |   expect(persisted.ok).toBe(true);
  544 |   expect(persisted.hasMatch).toBe(true);
  545 |   expect(persisted.storedCount).toBeGreaterThan(0);
  546 |   expect(persisted.essay).toBe("I completed the assignment.");
  547 | });
  548 | 
```