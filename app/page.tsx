'use client'

import { useState, useEffect } from 'react'
import { Todo, Priority } from '@prisma/client'
import TodoCard from '@/components/TodoCard'
import TodoForm from '@/components/TodoForm'
import FilterBar from '@/components/FilterBar'
import { Plus, CheckCircle } from 'lucide-react'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [isLoading, setIsLoading] = useState(true)

  const fetchTodos = async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') {
        params.append('completed', filter === 'completed' ? 'true' : 'false')
      }
      if (priorityFilter !== 'all') {
        params.append('priority', priorityFilter)
      }

      const response = await fetch(`/api/todos?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTodos(data)
      }
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [filter, priorityFilter])

  const handleCreateTodo = async (todoData: any) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoData)
      })

      if (response.ok) {
        await fetchTodos()
        setIsFormOpen(false)
      }
    } catch (error) {
      console.error('Error creating todo:', error)
    }
  }

  const handleUpdateTodo = async (todoData: any) => {
    if (!editingTodo) return

    try {
      const response = await fetch(`/api/todos/${editingTodo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoData)
      })

      if (response.ok) {
        await fetchTodos()
        setEditingTodo(null)
      }
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      })

      if (response.ok) {
        await fetchTodos()
      }
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  const handleDeleteTodo = async (id: string) => {
    if (!confirm('คุณแน่ใจว่าต้องการลบ todo นี้?')) return

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchTodos()
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed
    if (filter === 'pending') return !todo.completed
    return true
  })

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📝 Todo App
          </h1>
          <p className="text-gray-600">
            จัดการงานของคุณอย่างมีประสิทธิภาพ
          </p>
          
          {totalCount > 0 && (
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle size={16} className="text-green-500" />
                <span>เสร็จแล้ว {completedCount} จาก {totalCount} งาน</span>
              </div>
              <div className="w-48 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Add Todo Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2 shadow-lg"
          >
            <Plus size={20} />
            <span>เพิ่ม Todo ใหม่</span>
          </button>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filter={filter}
          priorityFilter={priorityFilter}
          onFilterChange={setFilter}
          onPriorityFilterChange={setPriorityFilter}
        />

        {/* Todo List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">กำลังโหลด...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'ยังไม่มี Todo' : `ไม่มี Todo ที่${filter === 'completed' ? 'เสร็จแล้ว' : 'ยังไม่เสร็จ'}`}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' ? 'เริ่มต้นเพิ่ม Todo แรกของคุณกันเลย!' : 'ลองเปลี่ยนตัวกรองดูนะ'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTodos.map(todo => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTodo}
                onEdit={setEditingTodo}
              />
            ))}
          </div>
        )}

        {/* Todo Form Modal */}
        {(isFormOpen || editingTodo) && (
          <TodoForm
            todo={editingTodo}
            onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingTodo(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
