# RecruitHub - Campus Recruitment Management System

## Project Overview
RecruitHub is a comprehensive web application designed to streamline the campus recruitment process, providing tools for managing drives, students, and recruitment rounds.

## Tech Stack
- Frontend: React with TypeScript
- Styling: Tailwind CSS
- State Management: React Hooks
- Routing: React Router
- Backend Communication: Axios

## Project Structure

### Directory Layout
```
src/
├── assets/            # Static assets (images, logos)
├── components/        # Reusable React components
│   ├── common/        # Generic UI components
│   ├── drives/        # Drive-specific components
│   ├── layout/        # Layout components
│   ├── navigation/    # Navigation-related components
│   ├── rounds/        # Round-related components
│   └── students/      # Student-related components
├── hooks/             # Custom React hooks
├── pages/             # Page-level components
│   ├── auth/          # Authentication pages
│   ├── drives/        # Drive management pages
│   ├── students/      # Student management pages
│   └── settings/      # Application settings pages
├── services/          # API service layers
│   ├── api.ts         # Base API configuration
│   ├── driveService.ts
│   ├── studentService.ts
│   └── ...
├── types/             # TypeScript type definitions
│   ├── drives.ts
│   ├── students.ts
│   └── ...
└── utils/             # Utility functions
```

### Key Components
- **Button**: Flexible, customizable button component
- **Table**: Generic table component with pagination
- **Modal**: Reusable modal with configurable content
- **Form Inputs**: Standardized form input and select components
- **Alert**: Configurable alert/notification component
- **Spinner**: Loading state indicator

## Development Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation
1. Clone the repository
2. Run `npm install`
3. Start development server: `npm start`

## Available Scripts
- `npm start`: Run development server
- `npm run build`: Create production build
- `npm test`: Run test suite
- `npm run lint`: Run code linting

## Best Practices
- Modular component design
- TypeScript for type safety
- Tailwind CSS for responsive styling
- Consistent naming conventions
- Separation of concerns

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License
[Specify your license]

## Contact
[Your contact information]
