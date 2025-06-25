
# Pet Care Application - Technical Architecture

## Project Overview
A comprehensive pet care management system built with modern web technologies, serving both pet owners and veterinary staff with role-based access control and real-time features.

## Quick Start Architecture Guide

### Key Files & Their Roles
```
src/
├── App.tsx                 # Main app component with routing
├── contexts/
│   ├── AuthContext.tsx     # Authentication & user management
│   └── NotificationContext.tsx # Real-time notifications
├── components/
│   ├── ProtectedRoute.tsx  # Route-level access control
│   ├── pets/              # Pet management components
│   └── ui/                # Reusable UI components
├── pages/
│   ├── Index.tsx          # Landing page
│   ├── Login.tsx          # Authentication
│   └── admin/             # Admin panel pages
└── types/
    └── auth.ts            # TypeScript type definitions
```

### Core Concepts

#### 1. Authentication Flow
1. Users log in via `Login.tsx` → Supabase Auth
2. `AuthContext` manages authentication state
3. `ProtectedRoute` controls access to protected pages
4. Role-based UI rendering based on user.role

#### 2. Data Management
- **Supabase**: Backend database and authentication
- **React Context**: Global state (auth, notifications)
- **TanStack Query**: Server state caching and synchronization
- **Local State**: Component-specific UI state

#### 3. Component Architecture
- **Pages**: Route-level components
- **Contexts**: Global state providers
- **Components**: Reusable UI and business logic
- **Hooks**: Shared stateful logic

## Development Guidelines

### Adding New Features
1. Create memory file in `lovable-memories/feature-[name].md`
2. Plan component structure (keep components small)
3. Add necessary types to `src/types/`
4. Implement with proper error handling
5. Add to routing in `App.tsx`
6. Update architecture documentation

### Code Organization
- Keep components under 100 lines when possible
- Use contexts for global state, local state for UI
- Implement proper TypeScript typing
- Follow established patterns for consistency

### Security Considerations
- All protected routes use `ProtectedRoute` wrapper
- Database access controlled by Supabase RLS policies
- No sensitive data stored in client-side code
- Input validation on all forms

## Getting Started for Developers
1. Review this architecture document
2. Check `lovable-memories/` for project context
3. Start with `src/App.tsx` to understand routing
4. Examine `AuthContext` for authentication patterns
5. Look at existing components for styling patterns

## Architecture Decisions
- **React Context over Redux**: Simpler state management for app size
- **shadcn/ui over custom components**: Consistent, accessible UI
- **Supabase over custom backend**: Rapid development with built-in auth
- **File-based routing**: Clear page organization
- **TypeScript throughout**: Better developer experience and fewer bugs
