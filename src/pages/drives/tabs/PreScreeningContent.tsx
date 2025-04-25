import React, { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';

interface PreScreeningContentProps {
  driveId?: string;
}

interface EvaluationJob {
  jobId: string;
  driveId: string;
  evaluationType: string;
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
  version?: number;
}

const EnhancedPreScreeningContent: React.FC<PreScreeningContentProps> = ({ driveId }) => {
  const [jobs, setJobs] = useState<EvaluationJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  // Fetch evaluation jobs
  const fetchJobs = async () => {
    if (!driveId) return;

    try {
      // Make the API call to fetch jobs for this drive
      const response = await api.get(`/profile-evaluator/jobs?driveId=${driveId}`);
      
      // Check if data exists and has the expected format
      if (response.data && response.data.data) {
        // Store the new jobs data
        setJobs(response.data.data);
        
        // Set active job ID to the one that's in progress or pending
        const inProgressJob = response.data.data.find((job: { status: string; }) => 
          job.status === 'IN_PROGRESS' || job.status === 'PENDING'
        );
        if (inProgressJob) {
          setActiveJobId(inProgressJob.jobId);
        }
      } else {
        console.error('Unexpected API response format:', response.data);
        setJobs([]);
      }
      
      setError(null);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching evaluation jobs:', err);
      setError('Failed to load evaluation jobs');
    } finally {
      setLoading(false);
    }
  };

  // Start polling
  const startPolling = () => {
    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    
    // Set up a new interval (polling every 2 seconds for more real-time updates)
    refreshIntervalRef.current = setInterval(() => {
      fetchJobs();
    }, 2000);
  };

  // Stop polling
  const stopPolling = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };

  // Initial fetch and set up polling
  useEffect(() => {
    if (driveId) {
      fetchJobs();
      startPolling();
    }
    
    // Clean up
    return () => {
      stopPolling();
    };
  }, [driveId]);

  // Update polling when jobs change
  useEffect(() => {
    const hasInProgressJobs = jobs.some(job => job.status === 'IN_PROGRESS' || job.status === 'PENDING');
    
    if (hasInProgressJobs && !refreshIntervalRef.current) {
      startPolling();
    } else if (!hasInProgressJobs && refreshIntervalRef.current) {
      stopPolling();
    }
  }, [jobs]);

  // Submit new evaluation job
  const handleSubmitEvaluation = async () => {
    if (!driveId || submitting) return;
    
    setSubmitting(true);
    try {
      // Call the API to start a new evaluation
      const response = await api.post(`/profile-evaluator/drives/${driveId}/submit-evaluation`);
      
      // Set the active job ID if the response includes it
      if (response.data && response.data.jobId) {
        setActiveJobId(response.data.jobId);
      }
      
      // Refresh jobs list immediately
      await fetchJobs();
      
      // Ensure polling is running
      startPolling();
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

  // Format date and time
  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Calculate duration between two timestamps
  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const diffInSeconds = Math.floor((end - start) / 1000);
    
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;
    
    return `${minutes}m ${seconds}s`;
  };

  // Calculate processing rate (items per minute)
  const calculateProcessingRate = (job: EvaluationJob) => {
    if (!job.progress?.github) return 'N/A';
    
    const startTime = new Date(job.createdAt).getTime();
    const now = new Date().getTime();
    const diffInMinutes = (now - startTime) / (1000 * 60);
    
    if (diffInMinutes < 0.1) return 'Calculating...';
    
    const itemsProcessed = job.progress.github.completed;
    const rate = itemsProcessed / diffInMinutes;
    
    return `${Math.round(rate)} profiles/minute`;
  };

  // Estimated time remaining
  const estimateTimeRemaining = (job: EvaluationJob) => {
    if (!job.progress?.github || job.progress.github.completed === 0) return 'Calculating...';
    
    const startTime = new Date(job.createdAt).getTime();
    const now = new Date().getTime();
    const elapsedSeconds = (now - startTime) / 1000;
    
    const percentComplete = job.progress.github.completed / job.progress.github.total;
    if (percentComplete < 0.05) return 'Calculating...';
    
    const totalEstimatedSeconds = elapsedSeconds / percentComplete;
    const remainingSeconds = totalEstimatedSeconds - elapsedSeconds;
    
    if (remainingSeconds < 60) return 'Less than a minute';
    if (remainingSeconds < 3600) return `About ${Math.round(remainingSeconds / 60)} minutes`;
    return `About ${Math.round(remainingSeconds / 3600)} hours`;
  };

  // Manual refresh
  const handleManualRefresh = () => {
    fetchJobs();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Pre-screening Evaluation</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleManualRefresh}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
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

      <div className="text-xs text-gray-500 mb-3">
        Last refreshed: {lastRefreshed.toLocaleTimeString()}
        {refreshIntervalRef.current && ' • Auto-refreshing every 2 seconds'}
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
                  <h4 className="font-medium">Job ID: {job.jobId}</h4>
                  <div className="flex text-sm text-gray-500 space-x-3 mt-1">
                    <span>Created: {formatDateTime(job.createdAt)}</span>
                    <span>•</span>
                    <span>Type: {job.evaluationType}</span>
                    {job.status === 'COMPLETED' && job.updatedAt && (
                      <>
                        <span>•</span>
                        <span>Duration: {calculateDuration(job.createdAt, job.updatedAt)}</span>
                      </>
                    )}
                  </div>
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
                  <div className="mb-2 flex justify-between items-center">
                    <span className="text-sm font-medium">{job.progress.overall.status}</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{job.progress.overall.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${job.progress.overall.percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {job.progress.github && (
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <h5 className="font-medium text-sm mb-2">GitHub Analysis</h5>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Profiles processed:</span>
                            <span className="font-medium">{job.progress.github.completed}/{job.progress.github.total}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Success rate:</span>
                            <span className="font-medium">
                              {job.progress.github.completed > 0 
                                ? Math.round((job.progress.github.success / job.progress.github.completed) * 100) 
                                : 0}%
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Processing rate:</span>
                            <span className="font-medium">{calculateProcessingRate(job)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {job.progress.resume && (
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <h5 className="font-medium text-sm mb-2">Resume Analysis</h5>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Resumes processed:</span>
                            <span className="font-medium">{job.progress.resume.completed}/{job.progress.resume.total}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Success rate:</span>
                            <span className="font-medium">
                              {job.progress.resume.completed > 0 
                                ? Math.round((job.progress.resume.success / job.progress.resume.completed) * 100) 
                                : 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded border border-blue-100 text-sm text-blue-800">
                    <div className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-medium">Estimated time remaining: {estimateTimeRemaining(job)}</p>
                        <p className="text-xs mt-1">
                          This analysis is processing student profiles and may take several minutes to complete.
                          The page will automatically refresh to show progress.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {job.status === 'FAILED' && job.error && (
                <div className="p-4 bg-red-50">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-red-700">Evaluation failed</p>
                      <p className="text-xs text-red-600 mt-1">Error: {job.error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {job.status === 'COMPLETED' && (
                <div className="p-4">
                  <div className="mb-4">
                    <h5 className="font-medium text-sm mb-2">Evaluation Summary</h5>
                    <p className="text-sm text-gray-600">
                      Evaluation completed successfully. Students have been ranked based on their GitHub activity and resume content.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {job.progress?.github && (
                      <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <h5 className="font-medium text-sm mb-2">GitHub Analysis Results</h5>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Total profiles:</span>
                            <span className="font-medium">{job.progress.github.total}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Successfully processed:</span>
                            <span className="font-medium">{job.progress.github.success}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Processing failed:</span>
                            <span className="font-medium">{job.progress.github.failed}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Success rate:</span>
                            <span className="font-medium">
                              {job.progress.github.completed > 0 
                                ? Math.round((job.progress.github.success / job.progress.github.completed) * 100) 
                                : 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {job.progress?.resume && (
                      <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <h5 className="font-medium text-sm mb-2">Resume Analysis Results</h5>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Total resumes:</span>
                            <span className="font-medium">{job.progress.resume.total}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Successfully processed:</span>
                            <span className="font-medium">{job.progress.resume.success}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Processing failed:</span>
                            <span className="font-medium">{job.progress.resume.failed}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Success rate:</span>
                            <span className="font-medium">
                              {job.progress.resume.completed > 0 
                                ? Math.round((job.progress.resume.success / job.progress.resume.completed) * 100) 
                                : 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 bg-green-50 p-3 rounded border border-green-100 text-sm">
                    <div className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-medium text-green-800">
                          Students have been successfully evaluated
                        </p>
                        <p className="text-xs mt-1 text-green-700">
                          The AI has analyzed student profiles and assigned scores based on GitHub activity and resume content.
                          You can now view and sort students by their evaluation scores.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-green-200 flex justify-end">
                      <button 
                        onClick={() => {
                          // This would navigate to student rankings or other relevant view
                          console.log('Navigate to student rankings');
                        }}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        View Student Rankings
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Last Updated: {formatDateTime(job.updatedAt)}</span>
                  {job.version !== undefined && <span>Version: {job.version}</span>}
                </div>
              </div>
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

export default EnhancedPreScreeningContent;