'use server'

import prisma from './db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import dayjs from 'dayjs'

function authenticateAndRedirect() {
  const { userId } = auth()
  if (!userId) {
    redirect('/')
  }
  return userId
}

export async function createJobAction(values) {
  const userId = authenticateAndRedirect()
  try {
    // Assuming some validation happens here (remove if not applicable).
    const job = await prisma.job.create({
      data: {
        ...values,
        clerkId: userId,
      },
    })
    return job
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getAllJobsAction({
  search,
  jobStatus,
  page = 1,
  limit = 10,
}) {
  const userId = authenticateAndRedirect()

  try {
    let whereClause = {
      clerkId: userId,
    }
    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          { position: { contains: search } },
          { company: { contains: search } },
        ],
      }
    }
    if (jobStatus && jobStatus !== 'all') {
      whereClause.status = jobStatus
    }

    const skip = (page - 1) * limit

    const jobs = await prisma.job.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    const count = await prisma.job.count({ where: whereClause })

    const totalPages = Math.ceil(count / limit)

    return { jobs, count, page, totalPages }
  } catch (error) {
    console.error(error)
    return { jobs: [], count: 0, page: 1, totalPages: 0 }
  }
}

export async function deleteJobAction(id) {
  const userId = authenticateAndRedirect()

  try {
    const job = await prisma.job.delete({
      where: {
        id,
        clerkId: userId,
      },
    })
    return job
  } catch (error) {
    return null
  }
}

export async function getSingleJobAction(id) {
  let job = null
  const userId = authenticateAndRedirect()

  try {
    job = await prisma.job.findUnique({
      where: {
        id,
        clerkId: userId,
      },
    })
  } catch (error) {
    job = null
  }
  if (!job) {
    redirect('/jobs')
  }
  return job
}

export async function updateJobAction(id, values) {
  const userId = authenticateAndRedirect()

  try {
    const job = await prisma.job.update({
      where: {
        id,
        clerkId: userId,
      },
      data: { ...values },
    })
    return job
  } catch (error) {
    return null
  }
}

export async function getStatsAction() {
  const userId = authenticateAndRedirect()
  try {
    const stats = await prisma.job.groupBy({
      by: ['status'],
      _count: { status: true },
      where: { clerkId: userId },
    })
    const statsObject = stats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status
      return acc
    }, {})

    const defaultStats = {
      pending: 0,
      declined: 0,
      interview: 0,
      ...statsObject,
    }
    return defaultStats
  } catch (error) {
    redirect('/jobs')
  }
}

export async function getChartsDataAction() {
  const userId = authenticateAndRedirect()
  const sixMonthsAgo = dayjs().subtract(6, 'month').toDate()

  try {
    const jobs = await prisma.job.findMany({
      where: {
        clerkId: userId,
      },
      orderBy: { createdAt: 'asc' },
    })

    const applicationsPerMonth = jobs.reduce((acc, job) => {
      const date = dayjs(job.createdAt).format('MMM YY')
      const existingEntry = acc.find((entry) => entry.date === date)

      if (existingEntry) {
        existingEntry.count += 1
      } else {
        acc.push({ date, count: 1 })
      }

      return acc
    }, [])

    return applicationsPerMonth
  } catch (error) {
    redirect('/jobs')
  }
}
