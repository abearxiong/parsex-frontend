import App from '@/pages/DashboardCommon/RobotMarkdown/index';

import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(<App />);

export const render = (el: HTMLElement) => {
  createRoot(el).render(<App />);
};
