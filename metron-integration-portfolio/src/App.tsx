import { lazy, Suspense, useState } from 'react';
import Navbar from './components/Navbar';
import EcosystemOverview from './components/EcosystemOverview';

const IntegrationDirectory = lazy(() => import('./components/IntegrationDirectory'));

type View = 'ecosystem' | 'directory';
export default function App() {
  const [view, setView] = useState<View>('ecosystem');
  const [directoryLoaded, setDirectoryLoaded] = useState(false);
  const openDirectory = () => {
    setDirectoryLoaded(true);
    setView('directory');
  };

  return <div className="app">
    <Navbar onIntegrations={openDirectory} />
    <div className={view === 'ecosystem' ? '' : 'view-hidden'}>
      <EcosystemOverview onExplore={openDirectory} />
    </div>
    {directoryLoaded && (
      <div className={view === 'directory' ? '' : 'view-hidden'}>
        <Suspense fallback={<div className="route-loading" role="status">Loading integration explorer...</div>}>
          <IntegrationDirectory onBack={() => setView('ecosystem')} />
        </Suspense>
      </div>
    )}
  </div>;
}
