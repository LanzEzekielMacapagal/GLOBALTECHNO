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
