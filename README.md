# PollApp

PollApp is a web application for creating, publishing and participating in surveys.

Users can create surveys with multiple questions and answer options, choose whether multiple answers are allowed, set an optional end date and organize surveys by category. Published surveys can be answered by other users and the results are displayed as percentages.

The application was built with Angular and uses Supabase as its backend and database.

## Features

### Create Surveys

- Create surveys with a custom name
- Add an optional description
- Select a survey category
- Set an optional end date
- Add multiple questions
- Add between 2 and 6 answers per question
- Allow single or multiple answers
- Remove questions and answers before publishing
- Form validation before publishing

### Participate in Surveys

Users can open published surveys and vote for their preferred answers.

Depending on the survey configuration, questions support:

- Single-choice answers
- Multiple-choice answers

Votes are stored in Supabase and assigned to the corresponding survey question.

### Survey Results

Results are calculated based on the number of votes for each answer and displayed as percentages.

If a survey has not received any votes yet, the results section displays:

> There are no answers yet.

### Survey Overview

Surveys can be filtered by:

- Active surveys
- Past surveys
- Category

The application also displays surveys that are ending soon, sorted by their end date.

Surveys without an end date remain active.

## Technologies

- Angular
- TypeScript
- HTML
- SCSS
- Supabase
- PostgreSQL
- Angular Router
- Angular Signals

## Database Structure

The application uses two main Supabase tables.

### `surveys`

Stores general information about a survey.

| Column | Description |
| --- | --- |
| `id` | Unique survey ID |
| `created_at` | Creation timestamp |
| `name` | Survey name |
| `description` | Optional description |
| `category` | Survey category |
| `enddate` | Optional end date |

### `survey_questions`

Stores the questions belonging to surveys.

| Column | Description |
| --- | --- |
| `id` | Unique question ID |
| `created_at` | Creation timestamp |
| `survey_id` | ID of the related survey |
| `question` | Question text |
| `multiple_answers` | Determines whether multiple answers are allowed |
| `A` - `F` | Answer options |
| `A_count` - `F_count` | Number of votes for each answer |

The `survey_id` connects each question to its corresponding survey.

## Project Structure

The application is divided into reusable Angular components.

Some of the main components are:

- `Home` – survey overview and filtering
- `SurveyForm` – creation of new surveys
- `QuestionForm` – reusable form for individual questions
- `SurveyView` – displays a survey and handles voting/results
- `PublishedOverlay` – confirmation after publishing a survey

Supabase communication is handled through a dedicated service.

## Installation

Clone the repository:

```bash
git clone <repository-url>