import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Ongoing from "@/pages/Ongoing";
import Completed from "@/pages/Completed";
import Popular from "@/pages/Popular";
import Movies from "@/pages/Movies";
import Donghua from "@/pages/Donghua";
import Series from "@/pages/Series";
import Genres from "@/pages/Genres";
import GenreDetail from "@/pages/GenreDetail";
import Schedule from "@/pages/Schedule";
import AnimeDetail from "@/pages/AnimeDetail";
import Watch from "@/pages/Watch";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

function Router() {
  return (
    <div className="min-h-screen bg-[#0d0d14] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/ongoing" component={Ongoing} />
          <Route path="/completed" component={Completed} />
          <Route path="/popular" component={Popular} />
          <Route path="/movies" component={Movies} />
          <Route path="/donghua" component={Donghua} />
          <Route path="/series" component={Series} />
          <Route path="/genres" component={Genres} />
          <Route path="/genre/:slug" component={GenreDetail} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/anime/:slug" component={AnimeDetail} />
          <Route path="/series/:slug" component={AnimeDetail} />
          <Route path="/film/:slug" component={AnimeDetail} />
          <Route path="/watch/:slug" component={Watch} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
