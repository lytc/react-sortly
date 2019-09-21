import Component from './pages/api/Component';
import Helpers from './pages/api/Helpers';
import Simple from './pages/examples/Simple';
import Advanced from './pages/examples/Advanced/Advanced';
import TableSortable from './pages/examples/TableSortable/TableSortable';
import HorizontalList from './pages/examples/HorizontalList/HorizontalList';
import StressTest from './pages/examples/StressTest';
import FileTree from './pages/examples/FileTree/FileTree';

export default [
  {
    id: 'api',
    label: 'API',
    children: [
      { id: 'component', label: 'Component', component: Component },
      { id: 'helpers', label: 'Helpers', component: Helpers }
    ]
  },
  {
    id: 'examples',
    label: 'Examples',
    children: [
      { id: 'simple', label: 'Simple', component: Simple },
      { id: 'advanced', label: 'Advanced', component: Advanced },
      { id: 'table-sortable-row', label: 'Table Sortable Row', component: TableSortable },
      { id: 'horizontal-list', label: 'Horizontal List', component: HorizontalList },
      { id: 'file-tree', label: 'File Tree', component: FileTree },
      { id: 'stress-test', label: 'Stress Test', component: StressTest }
    ]
  }
];
