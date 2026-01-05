import { NextResponse } from 'next/server'
import { notifyOverdueTasks } from '@/utils/notifications'
import { getClientIP } from '@/lib/ipUtils'
import { checkRateLimitByIP, recordAttemptByIP } from '@/lib/rateLimit'

export const runtime = 'nodejs'

/**
 * API endpoint to check for overdue tasks and send notifications
 * 
 * This endpoint can be called:
 * 1. Manually via POST request (with authentication)
 * 2. Via scheduled job (Vercel Cron, Firebase Cloud Scheduler, etc.)
 * 3. Via third-party cron service
 * 
 * Usage:
 * POST /api/check-overdue-tasks
 * 
 * Optional query parameters:
 * - projectId: Check only specific project (optional)
 * 
 * Response:
 * { success: true, message: "Overdue tasks check completed" }
 */
export async function POST(req) {
  try {
    // RATE LIMITING: Max 20 checks per IP per hour (for cron/external services)
    const ipAddress = getClientIP(req)
    const rateLimitCheck = await checkRateLimitByIP(ipAddress, 'check-overdue-tasks', 20, 60)
    
    if (!rateLimitCheck.allowed) {
      console.warn(`[SECURITY] Rate limit exceeded for check-overdue-tasks from IP: ${ipAddress}`)
      
      await recordAttemptByIP(ipAddress, 'check-overdue-tasks', {
        blocked: true,
        reason: 'rate-limit-exceeded'
      })
      
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          resetTime: rateLimitCheck.resetTime
        },
        { status: 429 }
      )
    }

    console.log('📋 Starting overdue tasks check...')
    
    // Optional: Add authentication check here
    // const auth = req.headers.get('authorization')
    // if (!auth || !auth.startsWith('Bearer ')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Get optional projectId from query params
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')

    // Call the overdue tasks notification function
    await notifyOverdueTasks()

    // Record successful attempt
    await recordAttemptByIP(ipAddress, 'check-overdue-tasks', {
      projectId: projectId || null,
      success: true
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Overdue tasks check completed successfully',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error in overdue tasks check:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to check overdue tasks'
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to trigger manual check (for testing)
 * Remove or secure this in production
 */
export async function GET(req) {
  try {
    // RATE LIMITING: Max 20 checks per IP per hour
    const ipAddress = getClientIP(req)
    const rateLimitCheck = await checkRateLimitByIP(ipAddress, 'check-overdue-tasks', 20, 60)
    
    if (!rateLimitCheck.allowed) {
      console.warn(`[SECURITY] Rate limit exceeded for check-overdue-tasks GET from IP: ${ipAddress}`)
      
      await recordAttemptByIP(ipAddress, 'check-overdue-tasks', {
        blocked: true,
        reason: 'rate-limit-exceeded',
        method: 'GET'
      })
      
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          resetTime: rateLimitCheck.resetTime
        },
        { status: 429 }
      )
    }

    console.log('📋 Starting manual overdue tasks check (GET)...')
    
    // Call the overdue tasks notification function
    await notifyOverdueTasks()

    // Record successful attempt
    await recordAttemptByIP(ipAddress, 'check-overdue-tasks', {
      method: 'GET',
      success: true
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Overdue tasks check completed successfully',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error in manual overdue tasks check:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to check overdue tasks'
      },
      { status: 500 }
    )
  }
}
