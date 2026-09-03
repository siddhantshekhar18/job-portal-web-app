-- Initial jobs schema required by the job APIs and later migrations.
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  salary NUMERIC(12, 2) NOT NULL CHECK (salary >= 0)
);

INSERT INTO jobs (title, company, location, salary)
SELECT seed.title, seed.company, seed.location, seed.salary
FROM (
  VALUES
    ('Frontend Developer', 'TechCorp', 'Remote', 60000),
    ('Backend Developer', 'CodeLabs', 'Bangalore', 70000),
    ('Full Stack Developer', 'InnovateTech', 'Hyderabad', 80000),
    ('Software Developer Intern', 'LinkWorks Labs', 'Greater Chennai', 90000)
) AS seed(title, company, location, salary)
WHERE NOT EXISTS (SELECT 1 FROM jobs);
