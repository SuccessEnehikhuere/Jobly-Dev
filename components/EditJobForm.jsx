'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

import { CustomFormField, CustomFormSelect } from './FormComponents'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { getSingleJobAction, updateJobAction } from '@/utils/actions'
import { createAndEditJobSchema, JobStatus, JobMode } from '@/utils/types'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

function EditJobForm({ jobId }) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const router = useRouter()

  const { data } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => getSingleJobAction(jobId),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (values) => updateJobAction(jobId, values),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: 'there was an error',
        })
        return
      }
      toast({ description: 'job updated' })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['job', jobId] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      router.push('/jobs')
    },
  })

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(createAndEditJobSchema),
    defaultValues: {
      position: data?.position || '',
      company: data?.company || '',
      location: data?.location || '',
       status: (data?.status) || JobStatus.Pending,
      mode: (data?.mode ) || JobMode.FullTime,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values) {
    mutate(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-muted p-8 rounded"
      >
        <h2 className="capitalize font-semibold text-4xl mb-6">edit job</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
          {/* position */}
          <CustomFormField name="position" control={form.control} />
          {/* company */}
          <CustomFormField name="company" control={form.control} />
          {/* location */}
          <CustomFormField name="location" control={form.control} />

          {/* job status */}
          <CustomFormSelect
            name="status"
            control={form.control}
            labelText="job status"
            items={Object.values(JobStatus)}
          />
          {/* job type */}
          <CustomFormSelect
            name="mode"
            control={form.control}
            labelText="job mode"
            items={Object.values(JobMode)}
          />

          <Button
            type="submit"
            className="self-end capitalize"
            disabled={isPending}
          >
            {isPending ? 'updating...' : 'edit job'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
export default EditJobForm