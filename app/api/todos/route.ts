import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

const todoUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

// GET /api/todos - Get all todos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const completed = searchParams.get('completed')
    const priority = searchParams.get('priority')
    
    const where: any = {}
    
    if (completed !== null) {
      where.completed = completed === 'true'
    }
    
    if (priority && priority !== 'all') {
      where.priority = priority
    }

    const todos = await prisma.todo.findMany({
      where,
      orderBy: [
        { completed: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(todos)
  } catch (error) {
    console.error('Error fetching todos:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/todos - Create a new todo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validatedData = todoSchema.parse(body)
    
    const todoData: any = {
      title: validatedData.title,
      description: validatedData.description,
      priority: validatedData.priority || 'MEDIUM',
    }
    
    if (validatedData.startDate) {
      todoData.startDate = new Date(validatedData.startDate)
    }
    
    if (validatedData.endDate) {
      todoData.endDate = new Date(validatedData.endDate)
    }

    const todo = await prisma.todo.create({
      data: todoData
    })

    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error('Error creating todo:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
