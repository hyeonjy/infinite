import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PaginationPage from "./pages/PaginationPage";
import InfiniteScrollPage from "./pages/InfiniteScrollPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <nav>
          <Link to="/">Pagination</Link> |{" "}
          <Link to="/infinite-scroll">Infinite Scroll</Link>
        </nav>
        <Routes>
          <Route path="/" element={<PaginationPage />} />
          <Route path="/infinite-scroll" element={<InfiniteScrollPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
