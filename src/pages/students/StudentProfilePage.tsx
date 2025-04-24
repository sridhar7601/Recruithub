import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Dummy data for the student profile
const dummyStudentData = {
  name: 'Preethi Nair',
  registrationNumber: '21CIV104',
  department: 'BE - Computer Science Engineering',
  testBatch: 2,
  aiMatchScore: 78,
  domains: ['Energy', 'Data Science', 'Automation', 'Predictive Analytics'],
  technologies: ['TypeScript', 'Express.js', 'Prisma', 'HTML', 'CSS', 'JavaScript', 'Tailwind', 'GraphQL', 'Apollo', 'PostgreSQL'],
  email: 'preethi.nair@example.com',
  linkedIn: 'https://www.linkedin.com/in/preethinair',
  github: 'https://github.com/preethinair',
};

const StudentProfilePage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();

  // In a real scenario, we would fetch the student data using the studentId
  const student = dummyStudentData;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Link to="/students" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Students
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Student Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{student.registrationNumber}</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{student.name}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Department</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{student.department}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Test Batch</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{student.testBatch}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">AI Match Score</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{student.aiMatchScore}%</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Domains</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {student.domains.join(', ')}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Technologies</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {student.technologies.join(', ')}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{student.email}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">LinkedIn</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a href={student.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    {student.linkedIn.replace('https://www.linkedin.com/in/', '')}
                  </a>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">GitHub</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a href={student.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    {student.github.replace('https://github.com/', '')}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
