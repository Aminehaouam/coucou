import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque';
import '../index.css';
import './lesson.css';
import Lesson from './Lesson.jsx';

createRoot(document.getElementById('root')).render(<Lesson />);
