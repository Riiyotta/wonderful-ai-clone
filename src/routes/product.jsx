// Routes owned by the "product" page group. Each entry: { path, element, chrome?: 'default' | 'none', title? }.
// chrome 'none' renders the page without the shared Navbar/Footer (for pages that bring their own).
import AiOs from '../pages/product/AiOs'
import Agents from '../pages/product/Agents'
import Systems from '../pages/product/Systems'

export default [
  { path: '/ai-os', element: <AiOs />, title: 'Wonderful AI OS | The unified operating layer for the AI-native enterprise' },
  { path: '/agents', element: <Agents />, title: 'Wonderful Agents | Deploy agents anywhere work happens' },
  { path: '/systems', element: <Systems />, title: 'Wonderful Systems | Software built for the way you work' },
]
