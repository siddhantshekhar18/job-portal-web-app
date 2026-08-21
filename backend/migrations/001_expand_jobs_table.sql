-- Migration: Expand jobs table with professional job details
-- Safe additive migration: no table drop/recreate, existing rows preserved.

ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS requirements JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS responsibilities JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS employment_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS experience_level VARCHAR(100),
ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::JSONB;

-- Seed realistic professional details for the original/known jobs first.
UPDATE jobs
SET
  description = CASE title
    WHEN 'Frontend Developer' THEN
      'We are looking for a creative Frontend Developer to craft elegant, high-performance user interfaces for our product at TechCorp. You will work closely with designers and backend engineers to translate wireframes into responsive, accessible web applications used by thousands of users every day.'
    WHEN 'Backend Developer' THEN
      'CodeLabs is seeking a Backend Developer to design and maintain scalable server-side applications. You will own microservices, REST APIs, and database integrations that power our core platform, ensuring reliability, performance, and security.'
    WHEN 'Full Stack Developer' THEN
      'InnovateTech is hiring a Full Stack Developer to build end-to-end web solutions. In this role, you will contribute across the entire stack, from polished React interfaces to robust Node.js services and PostgreSQL data models.'
    WHEN 'Software Developer Intern' THEN
      'LinkWorks Labs is looking for a motivated Software Developer Intern to join our engineering team. This is a hands-on learning opportunity where you will contribute to real projects, pair with senior engineers, and grow your full-stack skills.'
  END,
  requirements = CASE title
    WHEN 'Frontend Developer' THEN
      '["Strong knowledge of HTML, CSS, and JavaScript","Experience with React and modern frontend tooling","Understanding of responsive design and accessibility standards","Familiarity with REST APIs and asynchronous programming"]'::JSONB
    WHEN 'Backend Developer' THEN
      '["Strong knowledge of JavaScript and Node.js","Experience designing RESTful APIs","Understanding of relational databases such as PostgreSQL","Familiarity with Docker and CI/CD pipelines"]'::JSONB
    WHEN 'Full Stack Developer' THEN
      '["Strong knowledge of JavaScript","Experience with React and Node.js","Understanding of REST APIs and database design","Ability to work independently across frontend and backend tasks"]'::JSONB
    WHEN 'Software Developer Intern' THEN
      '["Basic knowledge of programming fundamentals","Willingness to learn React, Node.js, and PostgreSQL","Good communication and teamwork skills","Enthusiasm for building real-world applications"]'::JSONB
  END,
  responsibilities = CASE title
    WHEN 'Frontend Developer' THEN
      '["Develop responsive and accessible user interfaces","Collaborate with UX/UI designers to implement designs","Optimize frontend performance and loading times","Maintain and improve the component library"]'::JSONB
    WHEN 'Backend Developer' THEN
      '["Design and develop scalable REST APIs","Build and optimize database schemas and queries","Implement authentication, authorization, and security best practices","Collaborate with DevOps on deployment and monitoring"]'::JSONB
    WHEN 'Full Stack Developer' THEN
      '["Build scalable web applications from frontend to backend","Develop and document REST APIs","Design efficient database schemas","Collaborate with frontend and backend teams on feature delivery"]'::JSONB
    WHEN 'Software Developer Intern' THEN
      '["Assist in building frontend and backend features","Write clean, maintainable code under mentorship","Participate in code reviews and team standups","Learn and apply modern web development practices"]'::JSONB
  END,
  employment_type = CASE title
    WHEN 'Software Developer Intern' THEN 'Internship'
    ELSE 'Full-time'
  END,
  experience_level = CASE title
    WHEN 'Frontend Developer' THEN 'Mid-level'
    WHEN 'Backend Developer' THEN 'Mid-level'
    WHEN 'Full Stack Developer' THEN 'Mid-level'
    WHEN 'Software Developer Intern' THEN 'Entry-level'
  END,
  skills = CASE title
    WHEN 'Frontend Developer' THEN
      '["JavaScript","React","HTML","CSS","Tailwind CSS","Git"]'::JSONB
    WHEN 'Backend Developer' THEN
      '["Node.js","Express","PostgreSQL","REST APIs","Docker","Git"]'::JSONB
    WHEN 'Full Stack Developer' THEN
      '["JavaScript","React","Node.js","PostgreSQL","Express","Git"]'::JSONB
    WHEN 'Software Developer Intern' THEN
      '["JavaScript","React","Node.js","PostgreSQL","Git"]'::JSONB
  END
WHERE description IS NULL
  AND title IN (
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Software Developer Intern'
  );

-- Provide a professional generic fallback for any other existing jobs
-- that still have no description, so the Job Details page never breaks.
UPDATE jobs
SET
  description = COALESCE(
    description,
    CONCAT(
      'We are hiring a ',
      title,
      ' to join our growing team. In this role you will work on meaningful projects, collaborate with talented engineers, and help us deliver high-quality products that our users love.'
    )
  ),
  requirements = COALESCE(
    NULLIF(requirements, '[]'::JSONB),
    '["Relevant professional or academic experience in the field","Strong problem-solving and analytical abilities","Good communication and teamwork skills","Willingness to learn and adapt to new technologies"]'::JSONB
  ),
  responsibilities = COALESCE(
    NULLIF(responsibilities, '[]'::JSONB),
    '["Contribute to the design, development, and delivery of features","Collaborate with cross-functional teams to solve problems","Write clean, maintainable, and well-documented code","Participate in code reviews and continuous improvement initiatives"]'::JSONB
  ),
  employment_type = COALESCE(employment_type, 'Full-time'),
  experience_level = COALESCE(experience_level, 'Mid-level'),
  skills = COALESCE(
    NULLIF(skills, '[]'::JSONB),
    '["JavaScript","React","Node.js","PostgreSQL","Git"]'::JSONB
  )
WHERE description IS NULL;
