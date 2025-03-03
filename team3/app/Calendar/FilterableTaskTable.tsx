import React, { useState } from 'react';
import { ArrowUpDown } from "lucide-react";

interface Task {
    id: string;
    title: string;
    dueDate: string;
    status: string;
    priority: string;
  }
  
  interface FilterableTaskTableProps {
    initialTasks: Task[];
  }
  
  interface Filters {
    title: string;
    status: string;
    priority: string;
  }
  
  interface SortConfig {
    key: keyof Task | null;
    direction: 'asc' | 'desc';
  }
  
  const FilterableTaskTable: React.FC<FilterableTaskTableProps> = ({ initialTasks = [] }) => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [filters, setFilters] = useState<Filters>({
      title: '',
      status: '',
      priority: ''
    });
    const [sortConfig, setSortConfig] = useState<SortConfig>({
      key: null,
      direction: 'asc'
    });
  
    const handleSort = (key: keyof Task) => {
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
  
      const sortedTasks = [...tasks].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
      });
      setTasks(sortedTasks);
    };
  
    const handleFilter = (key: keyof Filters, value: string) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
  
      const filteredTasks = initialTasks.filter(task => {
        return Object.keys(newFilters).every(filterKey => {
          const filterValue = newFilters[filterKey as keyof Filters].toLowerCase();
          if (!filterValue) return true;
          return String(task[filterKey as keyof Task]).toLowerCase().includes(filterValue);
        });
      });
  
      setTasks(filteredTasks);
    };
  
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by title..."
          value={filters.title}
          onChange={(e) => handleFilter('title', e.target.value)}
          className="flex-1 max-w-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Filter by status..."
          value={filters.status}
          onChange={(e) => handleFilter('status', e.target.value)}
          className="flex-1 max-w-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Filter by priority..."
          value={filters.priority}
          onChange={(e) => handleFilter('priority', e.target.value)}
          className="flex-1 max-w-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <button 
                  onClick={() => handleSort('title')}
                  className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  Title
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button 
                  onClick={() => handleSort('dueDate')}
                  className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  Due Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button 
                  onClick={() => handleSort('status')}
                  className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button 
                  onClick={() => handleSort('priority')}
                  className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  Priority
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {task.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(task.dueDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {task.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FilterableTaskTable;