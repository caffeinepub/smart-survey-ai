# Smart Survey AI

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Full landing page modeled after Nomantify but rebranded as "Smart Survey AI"
- Hero section with AI chat assistant demo (survey/feedback focused)
- Features section: Anonymous Feedback, AI Insights, Real-time Sentiment, Topic Modeling, Multiple Campaigns, Visual Analytics
- How It Works section (4 steps)
- Benefits section (6 benefits)
- Feedback Form Builder page: Google Forms-style interface for creating and sharing surveys
- Data Export page: View submitted responses in a spreadsheet/table view with CSV/Excel export functionality
- Footer with newsletter subscribe, quick links, resources
- Navigation: Features, Benefits, Pricing, Contact, Blog

### Modify
- Company name: Smart Survey AI (replacing Nomantify)
- Logo: human + robot + survey form illustration
- Color scheme: purple and teal gradient instead of original
- All brand references updated

### Remove
- eNPS-specific references replaced with general survey/feedback
- Nomantify branding

## Implementation Plan
1. Backend: store survey forms (title, questions), store responses, export responses as CSV
2. Frontend: Landing page with all sections, Form Builder page, Responses/Data page
3. Use hero with animated chat prompts, feature cards, step-by-step how it works
4. Form builder: add questions (text, multiple choice, rating), preview form, share link
5. Responses table: display submissions, export to CSV (Excel-compatible)
