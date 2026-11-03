// Routes owned by the "platform" page group. Each entry: { path, element, chrome?: 'default' | 'none', title? }.
import Deployment from '../pages/platform/Deployment'
import Transformation from '../pages/platform/Transformation'
import Gateway from '../pages/platform/Gateway'

export default [
  { path: '/ai-gateway', element: <Gateway />, title: 'Wonderful AI Gateway | A command center for all enterprise AI' },
  { path: '/deployment', element: <Deployment />, title: 'Wonderful | The Enterprise AI OS ' },
  { path: '/ai-transformation', element: <Transformation />, title: 'Wonderful | The Enterprise AI OS ' },
]
