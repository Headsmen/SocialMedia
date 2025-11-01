import { Header } from '@/widgets/header/ui/Header'
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar'
import { useInfiniteComments } from '@/entities/comment'
import { Button } from '@mantine/core'

function NewsPage() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteComments();

  // Объединяем все страницы в один массив
  const allComments = data?.pages.flatMap((page) => page.comments) ?? [];

  return (
    <div>
      <Header />
      <Sidebar />
      <div style={{ marginLeft: '220px', padding: '20px' }}>
        <h2>Лента комментариев</h2>

        {isLoading && <p>Загрузка...</p>}
        {error && <p>Ошибка: {error.message}</p>}

        {allComments.map((comment, index) => (
          <div
            key={`${comment.email}-${index}`}
            style={{
              border: '1px solid #ccc',
              margin: '10px 0',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            <p><strong></strong> {comment.email}</p>
            <p><strong></strong> {comment.body}</p>
          </div>
        ))}

        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            style={{ marginTop: '20px', width: '100%' }}
          >
            {isFetchingNextPage ? 'Загрузка...' : 'Загрузить ещё'}
          </Button>
        )}

        {!hasNextPage && allComments.length > 0 && (
          <p style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>
            Все комментарии загружены
          </p>
        )}
      </div>
    </div>
  )
}

export default NewsPage
