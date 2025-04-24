import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../../services/api';

interface PreScreeningContentProps {
  driveId?: string;
}

interface EvaluationJob {
  jobId: string;
  driveId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  progress?: {
    overall: {
      percentage: number;
      status: string;
    };
    github?: {
      total: number;
      completed: number;
      success: number;
      failed: number;
    };
    resume?: {
      total: number;
      completed: number;
      success: number;
      failed: number;
    };
  };
  error?: string;
  createdAt: string;
  updatedAt: string;
}

const PreScreeningContent: React.FC<PreScreeningContentProps> = ({ driveId }) => {
  const [jobs, setJobs] = useState<EvaluationJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Fetch evaluation jobs
  const fetchJobs = async () => {
    if (!driveId) return;

    try {
      // In a real implementation, you would call your API
      // This is a mock call, replace with your actual endpoint
      const response = await api.get(`/profile-evaluator/jobs?driveId=${driveId}`);
      setJobs(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching evaluation jobs:', err);
      setError('Failed to load evaluation jobs');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and set up auto-refresh
  useEffect(() => {
    fetchJobs();
    
    // Set up auto-refresh every 30 seconds if there are in-progress jobs
    const interval = setInterval(() => {
      const hasInProgressJobs = jobs.some(job => job.status === 'IN_PROGRESS' || job.status === 'PENDING');
      if (hasInProgressJobs) {
        fetchJobs();
      }
    }, 30000);
    
    setRefreshInterval(interval);
    
    // Clean up
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [driveId]);

  // Update refresh interval when jobs change
  useEffect(() => {
    const hasInProgressJobs = jobs.some(job => job.status === 'IN_PROGRESS' || job.status === 'PENDING');
    if (!hasInProgressJobs && refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [jobs]);

  // Submit new evaluation job
  const handleSubmitEvaluation = async () => {
    if (!driveId || submitting) return;
    
    setSubmitting(true);
    try {
      // Mock implementation - replace with your actual endpoint
      await api.post(`/profile-evaluator/drives/${driveId}/submit-evaluation`);
      
      // Refresh jobs list
      await fetchJobs();
      
      // Set up auto-refresh again
      if (!refreshInterval) {
        const interval = setInterval(() => {
          fetchJobs();
        }, 30000);
        setRefreshInterval(interval);
      }
    } catch (err) {
      console.error('Failed to submit evaluation job:', err);
      setError('Failed to submit evaluation job');
    } finally {
      setSubmitting(false);
    }
  };

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Pre-screening Evaluation</h3>
        <button 
          onClick={handleSubmitEvaluation}
          disabled={submitting || jobs.some(job => job.status === 'IN_PROGRESS' || job.status === 'PENDING')}
          className={`px-4 py-2 rounded-md ${
            submitting || jobs.some(job => job.status === 'IN_PROGRESS' || job.status === 'PENDING')
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {submitting ? 'Submitting...' : 'Run Evaluation'}
        </button>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Pre-screening evaluates student profiles by analyzing their GitHub contributions and resume content. The process helps identify candidates with the strongest technical backgrounds.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <h4 className="text-lg font-medium mb-2">No evaluations have been run</h4>
          <p className="text-gray-500 mb-4">
            Run an evaluation to pre-screen candidates based on their GitHub profiles and resumes.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.jobId} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Job ID: {job.jobId.substring(0, 8)}...</h4>
                  <p className="text-sm text-gray-500">
                    Created {formatRelativeTime(job.createdAt)}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  job.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  job.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                  job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {job.status}
                </span>
              </div>
              
              {(job.status === 'IN_PROGRESS' || job.status === 'PENDING') && job.progress && (
                <div className="p-4 bg-gray-50">
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-medium">{job.progress.overall.status}</span>
                    <span className="text-sm">{job.progress.overall.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${job.progress.overall.percentage}%` }}
                    ></div>
                  </div>
                  
                  {job.progress.github && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>GitHub Analysis: {job.progress.github.completed}/{job.progress.github.total}</span>
                        <span>
                          Success: {job.progress.github.success} | 
                          Failed: {job.progress.github.failed}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {job.progress.resume && (
                    <div className="mt-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Resume Analysis: {job.progress.resume.completed}/{job.progress.resume.total}</span>
                        <span>
                          Success: {job.progress.resume.success} | 
                          Failed: {job.progress.resume.failed}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {job.status === 'FAILED' && job.error && (
                <div className="p-4 bg-red-50">
                  <p className="text-sm text-red-700">Error: {job.error}</p>
                </div>
              )}
              
              {job.status === 'COMPLETED' && (
                <div className="p-4">
                  <p className="text-sm text-gray-600">
                    Evaluation completed successfully. Students have been ranked based on their GitHub activity and resume content.
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    {job.progress?.github && (
                      <div>GitHub profiles processed: {job.progress.github.completed}</div>
                    )}
                    {job.progress?.resume && (
                      <div>Resumes processed: {job.progress.resume.completed}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreScreeningContent;