import '../../index.css';
import { createRoot } from 'react-dom/client';
import TaxiScene from './TaxiScene.jsx';

const coco = new URLSearchParams(window.location.search).get('coco') ?? 'a';
createRoot(document.getElementById('root')).render(<TaxiScene coco={coco} />);
