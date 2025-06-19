import { QueryClient } from "@tanstack/react-query";

// KEYS
export const QUERY_LECTURES = 'lectures'
export const QUERY_MARKED_DATES = 'markedDates'
export const QUERY_COURSES_AND_GROUPS = 'coursesAndGroups'

export function invalidateLecturesQueries(querrClient: QueryClient) {
  return Promise.all([
    querrClient.invalidateQueries({ queryKey: [QUERY_LECTURES] }),
    querrClient.invalidateQueries({ queryKey: [QUERY_MARKED_DATES] }),
    querrClient.invalidateQueries({ queryKey: [QUERY_COURSES_AND_GROUPS] }),
  ])
}