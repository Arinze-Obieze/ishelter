import ProjectsGrid from "@/components/Dashboard/LiveFeed/Grid";
import Header from "@/components/Dashboard/LiveFeed/Header";


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="px-4 py-8 md:px-6 md:py-12">
        <ProjectsGrid />
      </main>
    </div>
  )
}
