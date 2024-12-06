import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPhotos } from "../api/api.js";

// const data = {
//   pages: [
//     {
//       data: [
//         {
//           id: 1,
//           title: "Byron Bay",
//           url: "https://cdn.pixabay.com/photo/2020/05/07/03/32/byron-bay-5140005_640.jpg",
//         },
//         {
//           id: 2,
//           title: "Melbouren",
//           url: "https://cdn.pixabay.com/photo/2018/12/31/13/45/australia-3905135_640.jpg",
//         },
//         {
//           id: 3,
//           title: "May",
//           url: "https://cdn.pixabay.com/photo/2019/02/24/12/58/maltese-4017525_640.jpg",
//         },
//         {
//           id: 4,
//           title: "The best soccer club in the world",
//           url: "https://cdn.pixabay.com/photo/2015/04/23/16/39/football-736305_640.jpg",
//         },
//         {
//           id: 5,
//           title: "Arizona",
//           url: "https://cdn.pixabay.com/photo/2024/11/22/10/03/canyon-9215914_640.jpg",
//         },
//       ],
//       nextPage: 2,
//       hasMore: true,
//     },
//   ],
//   pageParams: [null, 2],
// };

const PaginationPage = () => {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending,
    isError,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["photos"],
    queryFn: fetchPhotos,
    getNextPageParam: (lastPage) => lastPage.nextPage, // 다음 페이지의 파라미터
  });

  const handleNextPage = async () => {
    if (hasNextPage && currentPage === data.pages.length) {
      await fetchNextPage();
    }
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = async () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  const currentData = data.pages[currentPage - 1]?.data || []; // 현재 페이지의 데이터 배열

  return (
    <div>
      <h2>Pagination with useInfiniteQuery</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", // 한 줄에 세 개씩 표시
          gap: "10px", // 요소 간 간격
        }}
      >
        {currentData.map((photo) => (
          <div key={photo.id}>
            <img src={photo.url} alt={photo.title} style={{ width: "100%" }} />
            <p>{photo.title}</p> {/* 제목 표시 */}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {/* 이전 버튼 */}
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>Page {currentPage}</span>
        {/* 다음 버튼 */}
        <button
          // onClick={() => {
          //   if (currentPage === data.pages.length && hasNextPage) {
          //     fetchNextPage();
          //   }
          //   setCurrentPage((prev) => prev + 1);
          // }}
          onClick={handleNextPage}
          disabled={!hasNextPage && currentPage === data.pages.length}
        >
          {isFetchingNextPage ? "Loading..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default PaginationPage;
