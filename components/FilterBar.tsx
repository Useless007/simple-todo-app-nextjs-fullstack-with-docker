import { Priority } from '@prisma/client'

interface FilterBarProps {
  filter: 'all' | 'completed' | 'pending'
  priorityFilter: Priority | 'all'
  onFilterChange: (filter: 'all' | 'completed' | 'pending') => void
  onPriorityFilterChange: (priority: Priority | 'all') => void
}

const priorityOptions = [
  { value: 'all', label: 'ทุกลำดับ', color: 'text-gray-600' },
  { value: 'LOW', label: 'ต่ำ', color: 'text-green-600' },
  { value: 'MEDIUM', label: 'ปานกลาง', color: 'text-yellow-600' },
  { value: 'HIGH', label: 'สูง', color: 'text-orange-600' },
  { value: 'URGENT', label: 'เร่งด่วน', color: 'text-red-600' }
]

export default function FilterBar({ filter, priorityFilter, onFilterChange, onPriorityFilterChange }: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex space-x-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => onFilterChange('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ยังไม่เสร็จ
          </button>
          <button
            onClick={() => onFilterChange('completed')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            เสร็จแล้ว
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            ลำดับความสำคัญ:
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value as Priority | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
