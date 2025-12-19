import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('bg-gray-200 rounded-md animate-pulse', className)}
      {...props}
    />
  )
}

// Skeleton específico para TaskCard
export function TaskCardSkeleton() {
  return (
    <div className="bg-white shadow-sm hover:shadow-md p-4 border rounded-lg transition-shadow">
      {/* Header com título e prioridade */}
      <div className="flex justify-between items-start gap-3 mb-3">
        <Skeleton className="w-2/3 h-6" />
        <Skeleton className="rounded-full w-16 h-6" />
      </div>

      {/* Descrição */}
      <div className="space-y-2 mb-4">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-5/6 h-4" />
        <Skeleton className="w-4/6 h-4" />
      </div>

      {/* Footer com status e data */}
      <div className="flex justify-between items-center pt-3 border-t">
        <Skeleton className="w-24 h-5" />
        <Skeleton className="w-28 h-5" />
      </div>

      {/* Ações */}
      <div className="flex gap-2 mt-3">
        <Skeleton className="flex-1 h-8" />
        <Skeleton className="flex-1 h-8" />
      </div>
    </div>
  )
}
