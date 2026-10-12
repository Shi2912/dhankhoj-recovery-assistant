import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProcessingAnimation from './components/ProcessingAnimation';
import LandingPage from './pages/LandingPage';
import SearchAssistantPage from './pages/SearchAssistantPage';
import DocumentUploadPage from './pages/DocumentUploadPage';
import ResultsPage from './pages/ResultsPage';
import ResultDetailPage from './pages/ResultDetailPage';
import ClaimGuidancePage from './pages/ClaimGuidancePage';
import SearchHistoryPage from './pages/SearchHistoryPage';
import TrustSafetyPage from './pages/TrustSafetyPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { searchAssets } from './services/api';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchResponse, setSearchResponse] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [pendingCriteria, setPendingCriteria] = useState(null);
  const [currentQuery, setCurrentQuery] = useState(null);

  // Triggered when user submits a query from SearchAssistant or DocumentUpload
  const handleStartSearch = async (criteria) => {
    setPendingCriteria(criteria);
    setIsProcessing(true);

    try {
      // Execute the search API concurrently with the processing visualizer
      const response = await searchAssets(criteria);
      setSearchResponse(response);
      setCurrentQuery(response.query || criteria);
    } catch (err) {
      console.error('Search error:', err);
      alert('Search failed: ' + (err.message || 'Server error'));
      setIsProcessing(false);
    }
  };

  // Called when ProcessingAnimation finishes all its stages
  const handleProcessingComplete = () => {
    setIsProcessing(false);
    setActivePage('results');
  };

  // When judge selects a preset scenario from LandingPage
  const handleSelectPreset = (presetData) => {
    setPendingCriteria(presetData);
    setActivePage('search');
  };

  // Rerun search from History page
  const handleRerunSearch = (criteria) => {
    handleStartSearch(criteria);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intelligent Processing Experience Animation Modal/View */}
        {isProcessing && (
          <div className="py-12">
            <ProcessingAnimation
              duration={2600}
              onComplete={handleProcessingComplete}
            />
          </div>
        )}

        {/* Normal Page Views */}
        {!isProcessing && (
          <>
            {activePage === 'landing' && (
              <LandingPage
                setActivePage={setActivePage}
                onSelectPreset={handleSelectPreset}
              />
            )}

            {activePage === 'search' && (
              <SearchAssistantPage
                initialCriteria={pendingCriteria}
                setActivePage={setActivePage}
                onStartSearch={handleStartSearch}
              />
            )}

            {activePage === 'upload' && (
              <DocumentUploadPage
                setActivePage={setActivePage}
                onStartSearch={handleStartSearch}
              />
            )}

            {activePage === 'results' && (
              <ResultsPage
                searchResponse={searchResponse}
                onSelectResult={(result) => {
                  setSelectedResult(result);
                  setActivePage('detail');
                }}
                onBackToSearch={() => setActivePage('search')}
              />
            )}

            {activePage === 'detail' && (
              <ResultDetailPage
                result={selectedResult}
                onBackToResults={() => setActivePage('results')}
                onStartGuidance={(result) => {
                  setSelectedResult(result);
                  setActivePage('guidance');
                }}
              />
            )}

            {activePage === 'guidance' && (
              <ClaimGuidancePage
                result={selectedResult}
                query={currentQuery}
                onBackToDetail={() => setActivePage('detail')}
              />
            )}

            {activePage === 'history' && (
              <SearchHistoryPage onRerunSearch={handleRerunSearch} />
            )}

            {activePage === 'trust' && (
              <TrustSafetyPage />
            )}

            {activePage === 'admin' && (
              <AdminDashboardPage />
            )}
          </>
        )}
      </main>

      <Footer setActivePage={setActivePage} />
    </div>
  );
}
