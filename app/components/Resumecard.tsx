import React from "react"
import ScoreCircle from "./ScoreCircle"
import { Link } from "react-router"

interface Props {
  id: string
  companyName?: string
  jobTitle?: string
  imagePath: string
  resumePath: string
  feedback: Feedback
}

const ResumeCard: React.FC<Props> = ({
  id,
  companyName,
  jobTitle,
  imagePath,
  resumePath,
  feedback,
}) => {
  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="flex justify-between items-center ">
        <div className="flex flex-col gap-2 ">
          <h2 className="text-black font-bold break-words">{companyName}</h2>
          <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
        </div>
        <div className="flex-shrink-0 ">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      <div className="gradient-border animate-in fade-in duration-1000">
        <div className="w-full h-full">
          <img
            className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
            src={imagePath}
            alt="resume"
          />
        </div>
      </div>
    </Link>
  )
}

export default ResumeCard
