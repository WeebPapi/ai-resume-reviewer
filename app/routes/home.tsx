import Navbar from "~/components/Navbar"
import type { Route } from "./+types/home"
// import { resumes } from "../../constants"
import ResumeCard from "~/components/Resumecard"
import { usePuterStore } from "~/lib/puter"
import { Link, useNavigate } from "react-router"
import { useEffect, useState } from "react"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job" },
  ]
}

export default function Home() {
  const { auth, kv, fs, isLoading } = usePuterStore()
  const navigate = useNavigate()

  const [resumes, setResumes] = useState<Resume[]>([])
  const [loadingResumes, setLoadingResumes] = useState(false)
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) navigate("/auth?next=/")
    // const loadImages = async () => {
    //   const resumeList = (await kv.list("resume")) as string[]
    //   const imagesListPromises = resumeList?.map(async (resumeKey) => {
    //     const loadImagePath = async () => {
    //       return JSON.parse((await kv.get(resumeKey)) as string) as Resume
    //     }
    //     const resume = await loadImagePath()
    //     let imageUrl = resume.imagePath
    //     setResumes((prev) => {
    //       if (!prev.find((res) => res.id === resume.id))
    //         return [...prev, resume]
    //       return prev
    //     })
    //     return imageUrl
    //   })
    //   const imagesListPaths = await Promise.all(imagesListPromises)
    //   const imagesList = await Promise.all(
    //     imagesListPaths.map(async (imgPath) => {
    //       return URL.createObjectURL((await fs.read(imgPath)) as Blob)
    //     })
    //   )
    //   setImages(imagesList)
    // }
    // loadImages()
  }, [auth.isAuthenticated, kv, isLoading])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true)

      const resumes = (await kv.list("resume:*", true)) as KVItem[]

      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      )

      setResumes(parsedResumes || [])
      setLoadingResumes(false)
    }

    loadResumes()
  }, [])

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
