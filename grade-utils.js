function normalizeNumber(value, fallback = 0) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function normalizeGradeValue(value, fallback = 0) {
  if (value === null || value === undefined || value === "") return fallback;
  return normalizeNumber(value, fallback);
}

function computeFinalGrade(grade = {}) {
  const finalValue = grade.final ?? grade.finals ?? grade.finalGrade;
  const values = [grade.prelim, grade.midterm, finalValue]
    .filter((value) => value !== null && value !== undefined && value !== "");

  if (!values.length) return normalizeGradeValue(grade.finalGrade, 0);

  const parts = values.map((value) => normalizeNumber(value, 0));
  if (parts.some((part) => Number.isNaN(part))) return normalizeGradeValue(grade.finalGrade, 0);

  return Math.round(parts.reduce((total, part) => total + part, 0) / parts.length);
}

function getQuestionPoints(question = {}) {
  return Number(question.points) > 0 ? Number(question.points) : 1;
}

function normalizeAnswer(value) {
  return String(value || "").trim().toLowerCase();
}

function calculateManualScore(submission = {}) {
  const manualScores = submission && typeof submission === "object" ? submission.manualScores || {} : {};
  return Object.values(manualScores).reduce((total, value) => {
    const numericValue = Number(value);
    return total + (Number.isFinite(numericValue) ? numericValue : 0);
  }, 0);
}

function calculateQuizAutoScore(quiz = {}, submission = {}) {
  const questions = Array.isArray(quiz?.questions) && quiz.questions.length ? quiz.questions : [];
  if (!questions.length) return 0;

  const submittedAnswers = submission?.answers || {};
  const fallbackAnswer = submission?.answer;

  return questions.reduce((total, question, index) => {
    const type = question.type || quiz.type || "multiple-choice";
    if (["essay", "enumeration", "modified-true-false"].includes(type)) return total;

    const questionId = question.id;
    const submittedAnswer = submittedAnswers[questionId] ?? (index === 0 ? fallbackAnswer : undefined);
    const points = getQuestionPoints(question);

    if (type === "matching") {
      const pairs = Array.isArray(question.pairs) ? question.pairs : [];
      if (!pairs.length || !submittedAnswer || typeof submittedAnswer !== "object") return total;

      const pairPoints = pairs.length ? points / pairs.length : 0;
      const matchedPairs = pairs.reduce((matches, pair, pairIndex) => {
        const studentChoice = submittedAnswer[pairIndex];
        return matches + (normalizeAnswer(studentChoice) === normalizeAnswer(pair.answer) ? 1 : 0);
      }, 0);

      return total + matchedPairs * pairPoints;
    }

    if (type === "multiple-choice" || type === "true-false") {
      return total + (normalizeAnswer(submittedAnswer) === normalizeAnswer(question.correctAnswer) ? points : 0);
    }

    return total;
  }, 0);
}

function calculateQuizSubmissionScore(quiz = {}, submission = {}) {
  return calculateQuizAutoScore(quiz, submission) + calculateManualScore(submission);
}

function calculateAssignmentScore(submissions = []) {
  return (Array.isArray(submissions) ? submissions : []).reduce((total, submission) => {
    const numericScore = Number(submission?.score);
    return total + (Number.isFinite(numericScore) ? numericScore : 0);
  }, 0);
}

module.exports = {
  calculateAssignmentScore,
  calculateManualScore,
  calculateQuizAutoScore,
  calculateQuizSubmissionScore,
  computeFinalGrade,
  normalizeGradeValue,
};
