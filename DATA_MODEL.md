# Data Model & Backend Architecture

## Overview
The application will utilize Supabase (PostgreSQL) for relational data storage, authentication, and image storage. Server components will be used for database access to ensure security and performance.

## Authentication
- **Admin Users**: Supabase Auth (Email/Password).
- Public users have no authentication or write access.
- **Security**: Row Level Security (RLS) policies will enforce read-only access for the public and full CRUD access for authenticated admins.

## Database Schema (Proposed)

### Table: `services`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `title` | Text | Name of the service/product |
| `slug` | Text | URL-friendly slug |
| `description` | Text | Detailed description |
| `features` | JSONB | List of features or specifications |
| `category` | Text | e.g., 'Elevator', 'Modernization', 'Building Service' |
| `image_url` | Text | Reference to Supabase Storage |
| `order_index` | Integer | Display order |
| `status` | Text | 'published' or 'draft' |
| `created_at` | Timestamp | |
| `updated_at` | Timestamp | |

### Table: `gallery`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `title` | Text | Image title/alt text |
| `image_url` | Text | Reference to Supabase Storage |
| `category` | Text | e.g., 'Cabins', 'Installations', 'Doors' |
| `order_index` | Integer | Display order |
| `status` | Text | 'published' or 'draft' |
| `created_at` | Timestamp | |

## Storage Architecture
- **Supabase Storage Bucket (`public_assets`)**: Used for gallery and service images.
- Images will be uploaded via the secure admin panel, stored persistently, and served with a public URL.

## Admin Panel State
- Client-side validation using Zod and React Hook Form.
- Server Actions for secure data mutations.
- Appropriate loading states, error boundaries, and toast notifications for user feedback.
