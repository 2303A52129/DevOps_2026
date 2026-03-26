require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

const seed = async () => {
  await connectDB();
  await User.deleteMany({});
  await Job.deleteMany({});
  await Application.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Create recruiters
  const recruiter1 = await User.create({
    name: 'Priya Sharma', email: 'priya@techcorp.com', password: 'priya123',
    role: 'recruiter', company: 'TechCorp India', companyWebsite: 'https://techcorp.com',
  });
  const recruiter2 = await User.create({
    name: 'Rahul Mehta', email: 'rahul@startupxyz.com', password: 'rahul123',
    role: 'recruiter', company: 'StartupXYZ', companyWebsite: 'https://startupxyz.com',
  });

  // Create candidates
  const candidate1 = await User.create({
    name: 'Arun Kumar', email: 'arun@gmail.com', password: 'arun123',
    role: 'candidate', skills: ['React', 'Node.js', 'MongoDB'], experience: '2 years',
  });
  const candidate2 = await User.create({
    name: 'Sneha Patel', email: 'sneha@gmail.com', password: 'sneha123',
    role: 'candidate', skills: ['Python', 'Django', 'PostgreSQL'], experience: '3 years',
  });

  // Create jobs
  const job1 = await Job.create({
    title: 'Full Stack Developer', company: 'TechCorp India',
    location: 'Bangalore', jobType: 'Full-time', category: 'Technology',
    description: 'We are looking for a skilled Full Stack Developer to join our growing team.',
    requirements: 'Min 2 years experience with React and Node.js.',
    salary: '₹12-18 LPA', skills: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
    postedBy: recruiter1._id,
  });
  const job2 = await Job.create({
    title: 'Backend Engineer (Python)', company: 'TechCorp India',
    location: 'Remote', jobType: 'Full-time', category: 'Technology',
    description: 'Backend engineer to build scalable APIs and microservices.',
    salary: '₹10-15 LPA', skills: ['Python', 'Django', 'PostgreSQL'],
    postedBy: recruiter1._id,
  });
  const job3 = await Job.create({
    title: 'Frontend Intern', company: 'StartupXYZ',
    location: 'Hyderabad', jobType: 'Internship', category: 'Technology',
    description: 'Exciting internship opportunity for a frontend developer.',
    salary: '₹15,000/month', skills: ['React', 'CSS', 'JavaScript'],
    postedBy: recruiter2._id,
  });

  // Create applications
  await Application.create({ job: job1._id, candidate: candidate1._id, coverLetter: 'I am very excited about this role at TechCorp.', status: 'Reviewed' });
  await Application.create({ job: job2._id, candidate: candidate2._id, coverLetter: 'Python is my primary language and I have 3 years of experience.', status: 'Pending' });
  await Application.create({ job: job3._id, candidate: candidate1._id, status: 'Accepted', recruiterNote: 'Strong candidate, good React skills.' });

  console.log('✅ Seed data inserted!');
  console.log('--- Recruiter logins ---');
  console.log('priya@techcorp.com / priya123');
  console.log('rahul@startupxyz.com / rahul123');
  console.log('--- Candidate logins ---');
  console.log('arun@gmail.com / arun123');
  console.log('sneha@gmail.com / sneha123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
