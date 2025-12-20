import PodcastAnalysis from './pages/PodcastAnalysis';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'EchoSense 播客分析',
    path: '/',
    element: <PodcastAnalysis />
  }
];

export default routes;
