import * as z from 'zod'

 export const JobStatus = {
  Pending: 'pending',
  Interview: 'interview',
  Declined: 'declined',
}

export const JobMode = {
  FullTime: 'full-time',
  PartTime: 'part-time',
  Internship: 'internship',
}

export const createAndEditJobSchema = z.object({
  position: z.string().min(2, {
    message: 'position must be at least 2 characters.',
  }),
  company: z.string().min(2, {
    message: 'company must be at least 2 characters.',
  }),
  location: z.string().min(2, {
    message: 'location must be at least 2 characters.',
  }),
  status: z.nativeEnum(JobStatus),
  mode: z.nativeEnum(JobMode),
})
