import JobsList from '@/components/JobsList'
import SearchForm from '@/components/SearchForm'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getAllJobsAction } from '@/utils/actions'

async function Jobs() {
 const queryClient = new QueryClient()

 await queryClient.prefetchQuery({
   queryKey: ['jobs', '', 'all', 1],
   queryFn: () => getAllJobsAction({}),
 })
 return (
   <HydrationBoundary state={dehydrate(queryClient)}>
     <SearchForm />
     <JobsList />
   </HydrationBoundary>
 )
}

export default Jobs
