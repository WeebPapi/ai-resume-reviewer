import Navbar from "~/components/Navbar"
import type { Route } from "./+types/home"
import { resumes } from "../../constants"
import ResumeCard from "~/components/Resumecard"
import { usePuterStore } from "~/lib/puter"
import { useNavigate } from "react-router"
import { useEffect } from "react"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job" },
  ]
}

export default function Home() {
  const { auth } = usePuterStore()
  const navigate = useNavigate()
  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/")
  }, [auth.isAuthenticated])
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading capitalize py-16">
          <h1>Track your applications & resume ratings</h1>
          <h2>review your submissions and check AI-powered feedback</h2>
        </div>
        <section className="resumes-section">
          {resumes.length > 0 &&
            resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                id={resume.id}
                companyName={resume.companyName}
                jobTitle={resume.jobTitle}
                feedback={resume.feedback}
                imagePath={resume.imagePath}
                resumePath={resume.resumePath}
              />
            ))}
        </section>
      </section>
    </main>
  )
}
