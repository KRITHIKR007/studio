# **App Name**: AI Club Recruitment Hub

## Core Features:

- Application Form: Multi-step form to collect applicant details, role preferences, skills, experience, and motivation. Includes validation to ensure data quality.
- Skill Assessment: Structured input for applicants to rate their proficiency in different programming languages.
- Application Submission: Securely submit the application data to Firestore, including applicant details, skills, and timestamps.
- Admin Dashboard: View submitted applications with details like personal info, chosen roles, skills, experience, and conceptual answers. Display the data using a clear data table or card based layout with sorting, filtering and search functionality.
- AI-Powered Candidate Ranking: Use a generative AI tool to provide scores, used to assess and rank candidates, based on their qualifications, experience, and the roles they applied for.

## Style Guidelines:

- Primary color: Electric Blue (#7DF9FF) for a modern, tech-forward aesthetic.
- Background color: Dark gray (#23262F) for a sophisticated and clean background that ensures readability.
- Accent color: Cyan (#30D5C8) as a complementary hue to Electric Blue, offering enough contrast to highlight key UI elements.
- Body and headline font: 'Inter' (sans-serif) for a clean, modern, and readable UI. 'Inter' will be used throughout the application for consistency.
- Use minimalistic, consistent icons from Lucide to represent actions, sections, and data. Use icons with a thin stroke and rounded corners for a softer, more approachable feel.
- Use a grid-based layout for the application form and admin dashboard to ensure a consistent structure. Employ generous spacing to avoid clutter and improve readability.
- Implement subtle animations for transitions, form submissions, and data loading. For example, a fade-in effect when switching between form steps, and a spinner animation while the AI candidate ranking is computed.