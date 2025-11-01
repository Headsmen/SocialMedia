import { Header } from "@/widgets/header/ui/Header";
import { Sidebar } from "@/widgets/sidebar/ui/Sidebar";
import { useInfiniteComments } from "@/entities/comment";
import { useEffect, useRef } from "react";
import { Loader } from "@mantine/core";

function NewsPageAutoScroll() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteComments();

  const observerTarget = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allComments = data?.pages.flatMap((page) => page.comments) ?? [];

  return (
    <div>
      <Header />
      <Sidebar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",

          // marginLeft: "220px",
          padding: "20px",
        }}
      >
        <h2>Лента постов</h2>

        {isLoading && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Loader />
          </div>
        )}

        {error && <p>Ошибка: {error.message}</p>}

        {allComments.map((comment, index) => (
          <div
            key={`${comment.email}-${index}`}
            style={{
              width: "30%",
              margin: "10px 0",
              padding: "10px",
            }}
          >
            <p>{comment.email}</p>
            <img
              style={{
                display: "flex",
                // flexDirection: "column",
                
                height: "450px",
                width: "100%",
              }}
              src="smile.jpg"
              alt=""
            />
            <p>{comment.body}</p>
          </div>
        ))}

        {/* Элемент-триггер для загрузки следующей страницы */}
        <div ref={observerTarget} style={{ height: "20px", margin: "20px 0" }}>
          {isFetchingNextPage && (
            <div style={{ textAlign: "center" }}>
              <Loader size="sm" />
            </div>
          )}
        </div>

        {!hasNextPage && allComments.length > 0 && (
          <p style={{ textAlign: "center", marginTop: "20px", color: "#888" }}>
            Все комментарии загружены
          </p>
        )}
      </div>
    </div>
  );
}

export default NewsPageAutoScroll;
