import { prepareInstructions, AIResponseFormat } from "../../constants"
import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import FileUploader from "~/components/FileUploader"
import Navbar from "~/components/Navbar"
import { convertPdfToImage } from "~/lib/pdf2img"
import { usePuterStore } from "~/lib/puter"
import { generateUUID } from "~/lib/utils"

export const meta = () => [
  { title: "Resumind | Upload" },
  { name: "description", content: "Upload your resume" },
]

const Upload = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusText, setStatusText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const puter = usePuterStore()
  const navigate = useNavigate()
  const handleFileSelect = (file: File | null) => {
    setFile(file)
  }
  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string
    jobTitle: string
    jobDescription: string
    file: File
  }) => {
    setIsProcessing(true)
    setStatusText("Uploading file...")
    const uploadedFile = await puter.fs.upload([file])
    if (!uploadedFile) return setStatusText("Error, failed to upload file")

    setStatusText("Converting to image...")
    const imageFile = await convertPdfToImage(file)
    if (!imageFile.file)
      return setStatusText("Error, failed to convert PDF to Image")
    setStatusText("Uploading image...")
    const uploadedImage = await puter.fs.upload([imageFile.file])
    if (!uploadedImage) return setStatusText("Error, failed to upload image")

    setStatusText("Preparing data...")

    const uuid = generateUUID()
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobDescription,
      jobTitle,
      feedback: "",
    }
    await puter.kv.set(`resume:${uuid}`, JSON.stringify(data))
    setStatusText("Analyzing...")
    const feedback = await puter.ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobDescription, jobTitle, AIResponseFormat })
    )
    if (!feedback) return setStatusText("Error, failed to analyze resume")

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text
    data.feedback = JSON.parse(feedbackText)
    await puter.kv.set(`resume:${uuid}`, JSON.stringify(data))
    setStatusText("Analysis complete!")
    console.log(data)
    navigate(`/resume/${uuid}`)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget.closest("form")
    if (!form) return
    const formData = new FormData(form)
    const companyName = formData.get("company-name") as string
    const jobTitle = formData.get("job-title") as string
    const jobDescription = formData.get("job-description") as string

    if (!file) return

    handleAnalyze({ companyName, jobDescription, jobTitle, file })
  }
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}
          {!isProcessing && (
            <form
              className="flex flex-col gap-4 mt-8"
              id="upload-form"
              onSubmit={handleSubmit}
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  name="company-name"
                  type="text"
                  placeholder="Company Name"
                  id="company-name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  name="job-title"
                  type="text"
                  placeholder="Job Title"
                  id="job-title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-desc">Job Description</label>
                <textarea
                  name="job-description"
                  placeholder="Job Description"
                  id="job-description"
                  rows={5}
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

export default Upload
