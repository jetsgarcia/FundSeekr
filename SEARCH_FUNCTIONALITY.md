# Search Functionality

## Overview

The search functionality allows users to find and filter their counterparts based on various criteria. The search is strictly role-based - Investors can ONLY search for Startups, and Startups can ONLY search for Investors. No switching between search types is allowed.

## Features

### Role-Based Search Restrictions

- **Investors**: Can only search for Startups (no option to search for other investors)
- **Startups**: Can only search for Investors (no option to search for other startups)
- **Fixed Search Type**: No tabs or switching - search type is determined by user role
- **Focused Experience**: Simplified interface tailored to each user's specific needs

### Search Interface

- **Full-text search**: Search by name, description, keywords, or organization
- **Advanced filters**: Multiple filter options based on user type
- **Real-time results**: Instant search with pagination
- **Responsive design**: Works on mobile and desktop

### Filters for Startups

- **Industry**: Filter by business industry
- **Location**: Filter by city/geographic location
- **Development Stage**: Filter by startup stage (e.g., Seed, Series A, etc.)

### Filters for Investors

- **Industry**: Filter by preferred investment industries
- **Location**: Filter by city or geographic focus
- **Check Size**: Filter by typical investment amount ranges
- **Business Model**: Filter by preferred business models
- **Funding Stage**: Filter by preferred funding stages

### Search Results

- **Card-based layout**: Clean, informative cards for each result
- **Key information**: Shows relevant details at a glance
- **Profile links**: Direct links to view full profiles
- **External links**: Links to websites when available
- **Pagination**: Load more results as needed

## Usage

### Navigation

- Access via the "Search" link in the navigation bar
- Available to verified users only

### Search Process

1. Enter search terms in the search box
2. Select search type (Startups/Investors) using tabs
3. Apply filters using the filter panel
4. Browse results and click to view profiles
5. Use pagination to load more results

### Filter Management

- Open filters panel using the "Filters" button
- Active filters are displayed as badges
- Individual filters can be removed by clicking the X
- "Clear all" option to remove all filters at once

## Technical Implementation

### Files Structure

```
src/
├── app/(with-nav-bar)/search/
│   └── page.tsx                 # Main search page
├── actions/
│   └── search.ts               # Server actions for search
└── components/search/
    ├── search-interface.tsx    # Main search component
    ├── search-filters.tsx      # Filter component
    ├── search-results.tsx      # Results display
    └── index.ts               # Exports
```

### Database Queries

- Searches only verified users (legalVerified = true)
- Full-text search across relevant fields
- Complex filtering with multiple criteria
- Efficient pagination with count queries

### Performance Features

- Server-side rendering for SEO
- Efficient database queries with proper indexing
- Client-side state management for smooth UX
- Optimized loading states and error handling
