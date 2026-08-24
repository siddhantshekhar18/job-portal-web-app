-- Migration: Add user roles and job ownership

-- Add role column to users with default candidate
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'candidate';

-- Create user role type if not exists and validate values
UPDATE users
SET role = 'candidate'
WHERE role IS NULL OR role NOT IN ('candidate', 'employer', 'admin');

-- Add employer_id to jobs
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS employer_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);

-- Add updated_at trigger-like default behavior is handled by application layer
