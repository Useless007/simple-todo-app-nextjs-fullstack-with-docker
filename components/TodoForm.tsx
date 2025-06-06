import { useState, useEffect, useRef } from 'react'
import { Todo, Priority } from '@prisma/client'
import { X, ChevronDown } from 'lucide-react'

interface TodoFormProps {
  todo?: Todo | null
  onSubmit: (todoData: {
    title: string
    description: string
    priority: Priority
    startDate: string
    endDate: string
  }) => void
  onCancel: () => void
}

const priorityOptions = [
  { 
    value: 'LOW', 
    label: 'ต่ำ', 
    color: 'text-green-600 bg-green-50',
    borderColor: 'border-green-200',
    hoverColor: 'hover:bg-green-100',
    dotColor: 'bg-green-500'
  },
  { 
    value: 'MEDIUM', 
    label: 'ปานกลาง', 
    color: 'text-yellow-600 bg-yellow-50',
    borderColor: 'border-yellow-200',
    hoverColor: 'hover:bg-yellow-100',
    dotColor: 'bg-yellow-500'
  },
  { 
    value: 'HIGH', 
    label: 'สูง', 
    color: 'text-orange-600 bg-orange-50',
    borderColor: 'border-orange-200',
    hoverColor: 'hover:bg-orange-100',
    dotColor: 'bg-orange-500'
  },
  { 
    value: 'URGENT', 
    label: 'เร่งด่วน', 
    color: 'text-red-600 bg-red-50',
    borderColor: 'border-red-200',
    hoverColor: 'hover:bg-red-100',
    dotColor: 'bg-red-500'
  }
]

export default function TodoForm({ todo, onSubmit, onCancel }: TodoFormProps) {
  const [formData, setFormData] = useState({
    title: todo?.title || '',
    description: todo?.description || '',
    priority: todo?.priority || 'MEDIUM' as Priority,
    startDate: todo?.startDate ? new Date(todo.startDate).toISOString().split('T')[0] : '',
    endDate: todo?.endDate ? new Date(todo.endDate).toISOString().split('T')[0] : ''
  })

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title.trim()) {
      onSubmit(formData)
    }
  }

  const selectedPriority = priorityOptions.find(p => p.value === formData.priority)

  const handlePrioritySelect = (priority: Priority) => {
    setFormData({ ...formData, priority })
    setIsDropdownOpen(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-black">
            {todo ? 'แก้ไข Todo' : 'เพิ่ม Todo ใหม่'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              หัวข้อ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ใส่หัวข้อ todo"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียด
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="ใส่รายละเอียด (ไม่บังคับ)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ลำดับความสำคัญ
            </label>
            
            {/* Custom Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full px-3 py-2 rounded-md border-2 text-left flex items-center justify-between transition-all ${
                  selectedPriority?.color || 'text-gray-700 bg-white'
                } ${selectedPriority?.borderColor || 'border-gray-300'} hover:${selectedPriority?.hoverColor || 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${selectedPriority?.dotColor || 'bg-gray-400'}`}></div>
                  <span className="font-medium">{selectedPriority?.label}</span>
                </div>
                <ChevronDown 
                  size={20} 
                  className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              
              {/* Dropdown Options */}
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  {priorityOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handlePrioritySelect(option.value as Priority)}
                      className={`w-full px-3 py-2 text-left flex items-center space-x-2 transition-all ${
                        formData.priority === option.value 
                          ? `${option.color} ${option.borderColor}` 
                          : `text-gray-700 bg-white hover:${option.color.replace('text-', 'hover:text-').replace('bg-', 'hover:bg-')}`
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${option.dotColor}`}></div>
                      <span className="font-medium">{option.label}</span>
                      {formData.priority === option.value && (
                        <span className="ml-auto text-blue-600">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Alternative Button Selection */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">หรือเลือกด่วน:</p>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: option.value as Priority })}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      formData.priority === option.value 
                        ? `${option.color} ${option.borderColor} ring-2 ring-blue-400 ring-offset-1`
                        : `text-gray-500 bg-gray-50 border-gray-200 ${option.hoverColor} hover:${option.color.replace('bg-', 'hover:bg-').replace('text-', 'hover:text-')}`
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${option.dotColor}`}></div>
                      <span>{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วันเริ่มต้น
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วันสิ้นสุด
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={formData.startDate}
              />
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
            >
              {todo ? 'อัปเดต' : 'เพิ่ม'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
