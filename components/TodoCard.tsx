import { Todo, Priority } from '@prisma/client'
import { format } from 'date-fns'
import { Calendar, Clock, Flag, Trash2, Edit, Check, X } from 'lucide-react'
import { clsx } from 'clsx'

interface TodoCardProps {
  todo: Todo
  onToggleComplete: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onEdit: (todo: Todo) => void
}

const priorityColors = {
  LOW: 'text-green-600 bg-green-50',
  MEDIUM: 'text-yellow-600 bg-yellow-50',
  HIGH: 'text-orange-600 bg-orange-50',
  URGENT: 'text-red-600 bg-red-50'
}

const priorityLabels = {
  LOW: 'ต่ำ',
  MEDIUM: 'ปานกลาง',
  HIGH: 'สูง',
  URGENT: 'เร่งด่วน'
}

export default function TodoCard({ todo, onToggleComplete, onDelete, onEdit }: TodoCardProps) {
  return (
    <div className={clsx(
      'bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md',
      todo.completed && 'opacity-60'
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggleComplete(todo.id, !todo.completed)}
            className={clsx(
              'mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
              todo.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-400'
            )}
          >
            {todo.completed && <Check size={14} />}
          </button>
          
          <div className="flex-1">
            <h3 className={clsx(
              'font-medium text-gray-900',
              todo.completed && 'line-through text-gray-500'
            )}>
              {todo.title}
            </h3>
            
            {todo.description && (
              <p className={clsx(
                'text-sm text-gray-600 mt-1',
                todo.completed && 'line-through'
              )}>
                {todo.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 mt-3">
              <span className={clsx(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                priorityColors[todo.priority]
              )}>
                <Flag size={12} className="mr-1" />
                {priorityLabels[todo.priority]}
              </span>
              
              {todo.startDate && (
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar size={12} className="mr-1" />
                  เริ่ม: {format(new Date(todo.startDate), 'dd/MM/yyyy')}
                </div>
              )}
              
              {todo.endDate && (
                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  สิ้นสุด: {format(new Date(todo.endDate), 'dd/MM/yyyy')}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(todo)}
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
