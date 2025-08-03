import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Results from '../components/Results';
import { AnalysisResult } from '../api/analyze/route';
import { FileText, AlertCircle } from 'lucide-react';

export default async function ResultsPage({ searchParams }: { searchParams: { data?: string } }) {
  // Check authentication
  const { userId } = await auth();
  if (!userId) {
    redirect('/api/auth/signin');
  }

  // Parse analysis data
  const analysisData = searchParams.data;
  let analysis: AnalysisResult | null = null;
  let error: string | null = null;

  if (!analysisData) {
    error = 'No analysis data provided.';
  } else {
    try {
      analysis = JSON.parse(decodeURIComponent(analysisData)) as AnalysisResult;
    } catch (err) {
      error = 'Failed to parse analysis data.';
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-xl border border-red-200 p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Error</h1>
          </div>
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  // Loading state (optional, as parsing is fast but included for UX consistency)
  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600 animate-pulse" />
          <p className="text-gray-600 font-medium">Loading analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <Results analysis={analysis} />
    </main>
  );
}