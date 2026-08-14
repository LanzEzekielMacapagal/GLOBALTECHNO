const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { test } = require("node:test");

test("reviewer upload form includes the description field in the admin form", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");

  assert.match(appSource, /description\.name = "description"/);
  assert.match(
    appSource,
    /form\.append\(\s*createTextElement\("strong", "small", "Upload reviewer"\),[\s\S]*description,[\s\S]*button,/m
  );
});

test("quiz manual grading panel shows an empty-state notice when there are no pending submissions", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");

  assert.match(
    appSource,
    /if \(!manualTasks\.length\) \{[\s\S]*No pending submissions need grading for this course yet\./m
  );
});

test("teacher registration submits the teacher role from the admin form", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");

  assert.match(appSource, /role:\s*"teacher"/);
});

test("user schema accepts teacher role", () => {
  const serverSource = fs.readFileSync(path.join(__dirname, "server.js"), "utf8");

  assert.match(serverSource, /enum:\s*\[\s*"admin"\s*,\s*"teacher"\s*,\s*"user"\s*\]/);
});

test("grade reveal action toggles to revealed state with red styling", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");

  assert.match(appSource, /"Revealed Grades"/);
  assert.match(appSource, /classList\.toggle\("gradebook-course-action-revealed"/);
});

test("score reveal action keeps the red revealed styling after toggling", () => {
  const stylesSource = fs.readFileSync(path.join(__dirname, "styles.css"), "utf8");

  assert.match(stylesSource, /\.gradebook-course-action-secondary\.gradebook-course-action-revealed\s*\{/);
});
