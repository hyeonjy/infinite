export const fetchPhotos = async ({ pageParam = 1 }) => {
  const response = await fetch(
    `http://localhost:3001/photos?_page=${pageParam}&_per_page=5`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const result = await response.json();
  return {
    data: result.data,
    nextPage: result.next,
    hasMore: !!result.next,
  };
};
