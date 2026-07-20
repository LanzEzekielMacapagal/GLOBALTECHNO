# Assignment Submission Feature Guide

## Overview
Students can now view assignments posted by admins organized by course, and submit files or essays for each assignment.

## Features

### 1. Student Assignment View
- **Course Organization**: Assignments are displayed grouped by the courses the student is enrolled in
- **Per-Course Display**: Each course shows the number of assignments available
- **Easy Navigation**: Students can expand/collapse assignment details to view instructions and materials

### 2. Assignment Details
When a student clicks "View details" on an assignment, they can see:
- Assignment title
- Due date
- Instructions/description
- Attached materials (downloadable files)
- Current submission status (if any)

### 3. File Upload
For file-based assignments, students can:
- **Add Multiple Files**: Click "Add files" to select one or more files
- **File Preview**: See a list of selected files before submission
- **Replace Upload**: If they've already submitted, they can upload new files to replace the old ones
- **File Types Supported**: PDF, DOCX, images, ZIP, presentations, spreadsheets, text files, and more

### 4. Essay Submission
For essay-based assignments, students can:
- **Write Directly**: Type their essay response in a text area
- **Save Drafts**: Submit multiple times to update their essay
- **Update Essay**: Click "Update Essay" to replace their previous submission

## Backend API Endpoints

### Submit/Update Assignment
```
POST /courses/:courseId/assignments/:assignmentId/submit
```
**Request Body**:
- `studentId` (required): Student's user ID
- `studentName` (required): Student's full name or username
- `submissionType` (required): Either "file" or "essay"
- `essay` (optional): Essay text for essay submissions
- `submissionFiles` (optional): File(s) for file-based submissions

**Response**:
```json
{
  "code": 201,
  "message": "Assignment submitted successfully.",
  "data": {
    "id": "submission-...",
    "assignmentId": "assignment-...",
    "courseId": "...",
    "studentId": "...",
    "studentName": "...",
    "submissionType": "file|essay",
    "essay": "...",
    "attachments": [...],
    "submittedAt": "2024-...",
    "updatedAt": "2024-..."
  }
}
```

### Get Submissions
```
GET /courses/:courseId/assignments/:assignmentId/submissions?studentId=:studentId
```
**Query Parameters**:
- `studentId` (optional): Get specific student's submission

**Response**:
```json
{
  "code": 200,
  "data": { /* submission object or null */ }
}
```

### Get All Student Submissions in Course
```
GET /courses/:courseId/student/:studentId/submissions
```

**Response**:
```json
{
  "code": 200,
  "data": [ /* array of submissions */ ]
}
```

### Delete Submission
```
DELETE /courses/:courseId/assignments/:assignmentId/submissions/:submissionId
```

## Database Schema

### AssignmentSubmission
```javascript
{
  id: String (unique),
  assignmentId: String (indexed),
  courseId: String (indexed),
  studentId: String (indexed),
  studentName: String,
  submissionType: String, // 'file' or 'essay'
  essay: String,
  attachments: Array, // File metadata
  submittedAt: Date,
  updatedAt: Date
}
```

## Frontend Functions

### Load Assignments by Course
```javascript
loadStudentAssignmentsByAllCourses(enrolledCourseIds)
```
Loads all assignments for the student's enrolled courses.

### Load Student Submission
```javascript
loadStudentAssignmentSubmission(courseId, assignmentId, studentId)
```
Fetches a student's submission for a specific assignment.

### Get Submission
```javascript
getStudentAssignmentSubmission(assignmentId, studentId)
```
Returns cached submission data.

### Render Assignments by Course
```javascript
renderStudentAssignmentsByCourse()
```
Renders the UI showing assignments organized by course with submission forms.

## UI Components

### Assignment Course Section
- Shows course title and count of assignments
- Displays all assignments for that course
- Responsive layout with clean spacing

### Assignment Card (Student View)
- Shows title, due date, subject, and type
- Expandable details panel
- File attachment preview
- Submission form (for file or essay)
- Submission status display

### Submission Form
- **File Upload**: Multiple file selector with preview list
- **Essay Form**: Textarea for writing essays
- **Submit Button**: Changes text based on submission state ("Submit"/"Update")

## Usage Flow

### For Students:
1. Log into the student portal
2. Navigate to "Assignments" section
3. View assignments organized by course
4. Click "View details" to expand an assignment
5. For file submissions:
   - Click "Add files"
   - Select one or more files
   - Click "Upload"
6. For essay submissions:
   - Write your essay in the text area
   - Click "Submit Essay"
7. To update: Click "Replace Upload" or "Update Essay" and submit again

### For Admins:
1. Create assignments with titles, instructions, and due dates
2. Optionally attach materials for students
3. Specify assignment type (file upload or essay)
4. Students will see assignments organized by course
5. View submissions through the admin panel (feature to be added)

## File Storage
- Submitted files are stored in `/uploads/assignments/`
- Files are renamed with unique identifiers to prevent conflicts
- File metadata is stored in the database

## Error Handling
- Validates student enrollment before allowing submission
- Checks file size limits (20MB per file)
- Validates required fields (essay text or files)
- Provides user-friendly error messages

## Future Enhancements
- Admin submission review interface
- Submission grading and feedback
- Deadline enforcement (late submissions)
- Plagiarism detection
- Bulk submission download
- Email notifications for new assignments
