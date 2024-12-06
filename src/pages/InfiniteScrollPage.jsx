import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPhotos } from "../api/api.js";

const InfiniteScrollPage = () => {
  const observerRef = useRef(null); // 무한 스크롤 감지용 ref

  const {
    data, // 가져온 모든 페이지 데이터
    fetchNextPage, // 다음 페이지 데이터를 가져오는 함수
    hasNextPage, // 다음 페이지가 존재하는지 여부
    isFetchingNextPage, // 다음 페이지를 가져오는 중인지 여부
    isLoading, // 첫 로딩 상태 여부
    isError, // 에러 발생 여부
    error, // 에러 정보
  } = useInfiniteQuery({
    queryKey: ["photos"], // 캐싱을 위한 키 설정
    queryFn: fetchPhotos, // 데이터를 가져오는 함수 (API 호출 함수)
    getNextPageParam: (lastPage) => lastPage.nextPage, // 다음 페이지 번호를 결정하는 로직
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          // 감지 대상이 뷰포트와 교차 상태가 되고, 다음 페이지가 존재하면
          fetchNextPage(); // 다음 페이지 데이터를 가져옴
        }
      },
      { threshold: 0.5 } // 50% 이상 보이면 트리거
    );

    if (observerRef.current) {
      observer.observe(observerRef.current); // ref로 연결된 요소를 감지
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current); // 컴포넌트 언마운트 시 관찰 해제
      }
    };
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) return <p>Loading...</p>; // 첫 로딩 상태 표시
  if (isError) return <p>Error: {error.message}</p>; // 에러 발생 시 메시지 표시

  return (
    <div>
      <h2>Infinite Scroll with useInfiniteQuery</h2>
      <div
        style={{
          display: "grid", // 그리드 레이아웃 사용
          gridTemplateColumns: "repeat(1, 1fr)", // 한 줄에 하나씩 표시
          gap: "10px", // 각 항목 간격
        }}
      >
        {data.pages.map(
          (
            page,
            index // 페이지 데이터를 반복하여 렌더링
          ) => (
            <div key={index}>
              {page.data.map(
                (
                  photo // 각 페이지의 사진 데이터 반복 렌더링
                ) => (
                  <div key={photo.id}>
                    <img
                      src={photo.url} // 이미지 URL 설정
                      alt={photo.title} // 이미지 제목 (대체 텍스트)
                      style={{ width: "100%" }} // 이미지 너비를 100%로 설정
                    />
                    <p style={{ textAlign: "center" }}>{photo.id}</p>{" "}
                    {/* 사진 ID 표시 */}
                  </div>
                )
              )}
            </div>
          )
        )}
      </div>
      <div
        ref={observerRef} // 무한 스크롤 감지용 ref 연결
        style={{
          height: "20px", // 감지 영역 높이
          background: "lightgray", // 감지 영역 배경색
          textAlign: "center", // 텍스트 가운데 정렬
        }}
      >
        {isFetchingNextPage ? (
          <p>Loading more...</p> // 다음 페이지 로딩 중일 때 표시
        ) : hasNextPage ? (
          <p>Scroll down</p> // 다음 페이지가 존재할 때 안내 메시지
        ) : (
          <p>No more photos</p> // 더 이상 데이터가 없을 때 메시지
        )}
      </div>
    </div>
  );
};

export default InfiniteScrollPage;
