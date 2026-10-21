import { describe, it, expect } from 'vitest';
import { filterJobs, sortByNewest, formatPostedDate } from './jobs';
import type { Job } from '../types/job';

/** Create a small role fixture for job-helper tests. */
function makeJob(
  slug: string,
  postedDate: string,
  department = 'Technology',
  location = 'Remote',
): Job {
  return {
    slug,
    title: `Role ${slug}`,
    department,
    location,
    type: 'Full-time',
    remote: true,
    postedDate,
    summary: 'A role.',
  };
}

describe('filterJobs', () => {
  const jobs = [
    makeJob('frontend', '2027-01-01', 'Technology', 'Remote'),
    makeJob('analyst', '2027-02-01', 'Finance', 'Woodinville, WA, USA'),
    makeJob('scientist', '2027-03-01', 'Research & Development', 'Vancouver, Canada'),
    makeJob('accountant', '2027-04-01', 'Finance', 'Helsinki, Finland'),
  ];

  it('filters by department', () => {
    expect(filterJobs(jobs, { department: 'Finance' }).map((job) => job.slug)).toEqual([
      'analyst',
      'accountant',
    ]);
  });

  it('filters by location', () => {
    expect(
      filterJobs(jobs, { location: 'Woodinville, WA, USA' }).map((job) => job.slug),
    ).toEqual(['analyst']);
  });

  it('requires a role to match both selected filters', () => {
    expect(
      filterJobs(jobs, {
        department: 'Finance',
        location: 'Woodinville, WA, USA',
      }).map((job) => job.slug),
    ).toEqual(['analyst']);
    expect(
      filterJobs(jobs, {
        department: 'Technology',
        location: 'Woodinville, WA, USA',
      }),
    ).toEqual([]);
  });

  it('returns all roles when filters are reset or omitted', () => {
    expect(filterJobs(jobs, {}).map((job) => job.slug)).toEqual(
      jobs.map((job) => job.slug),
    );
    expect(filterJobs(jobs, { department: '', location: '' })).toEqual(jobs);
  });

  it('returns no roles for values that do not match', () => {
    expect(filterJobs(jobs, { department: 'Unknown' })).toEqual([]);
  });
});

describe('sortByNewest', () => {
  it('orders jobs by posted date, newest first', () => {
    const jobs = [
      makeJob('a', '2027-01-01'),
      makeJob('b', '2027-03-15'),
      makeJob('c', '2027-02-10'),
    ];
    expect(sortByNewest(jobs).map((j) => j.slug)).toEqual(['b', 'c', 'a']);
  });

  it('does not mutate the input array', () => {
    const jobs = [makeJob('a', '2027-01-01'), makeJob('b', '2027-03-15')];
    const original = jobs.map((j) => j.slug);
    sortByNewest(jobs);
    expect(jobs.map((j) => j.slug)).toEqual(original);
  });
});

describe('formatPostedDate', () => {
  it('formats an ISO date as a readable string', () => {
    expect(formatPostedDate('2027-01-05')).toBe('January 5, 2027');
  });

  it('returns the raw value when the date is unparseable', () => {
    expect(formatPostedDate('not-a-date')).toBe('not-a-date');
  });
});
