import Navbar from "~/components/Navbar"
import type { Route } from "./+types/home"
// import { resumes } from "../../constants"
import ResumeCard from "~/components/Resumecard"
import { usePuterStore } from "~/lib/puter"
import { useNavigate } from "react-router"
import { useEffect, useState } from "react"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job" },
  ]
}

export default function Home() {
  const { auth, kv, fs } = usePuterStore()
  const navigate = useNavigate()

  const [resumes, setResumes] = useState<Resume[]>([])
  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/")
    else
      (kv.list("resume") as Promise<string[]>).then((resumeList: string[]) => {
        resumeList?.map((resumeId: string) =>
          kv.get(resumeId).then((result) => {
            const parsedRes = JSON.parse(result!)
            setResumes((prev) => {
              if (!prev.find((item) => item.id === parsedRes.id))
                return [...prev, parsedRes]
              return prev
            })
          })
        )
      })
  }, [auth.isAuthenticated])

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <button onClick={() => console.log(resumes)}>click</button>
      <Navbar />
      <section className="main-section">
        <div className="page-heading capitalize py-16">
          <h1>Track your applications & resume ratings</h1>
          <h2>review your submissions and check AI-powered feedback</h2>
        </div>
        <section className="resumes-section">
          {/* TODO: An issue with images being loaded, likely having to do with %20 expressing a space in file names */}
          {resumes &&
            resumes.length > 0 &&
            resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                id={resume.id}
                companyName={resume.companyName}
                jobTitle={resume.jobTitle}
                feedback={resume.feedback}
                imagePath={`https://api.puter.com/read?file=${resume.imagePath}`}
                resumePath={resume.resumePath}
              />
            ))}
        </section>
      </section>
    </main>
  )
}
