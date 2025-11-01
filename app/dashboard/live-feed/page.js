import ProjectsGrid from "@/components/Dashboard/LiveFeed/Grid";
import Header from "@/components/Dashboard/LiveFeed/Header";


export default function LiveFeedHome() {
  return (
    <div className="min-h-screen md:max-w-7xl md:mx-auto">
      <Header />
      <main className="px-4 py-8 md:px-6 md:py-12">
        <ProjectsGrid />
      </main>
    </div>
  )
}
