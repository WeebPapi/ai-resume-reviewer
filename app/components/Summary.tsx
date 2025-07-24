import React from "react"
import ScoreGauge from "./ScoreGauge"

interface Props {
  feedback: Feedback
}

interface ScoreBadgeProps {
  score: number
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeColor = "bg-red-100 text-red-700"
  let label = "Needs Work"

  if (score > 69) {
    badgeColor = "bg-green-100 text-green-700 "
    label = "Strong"
  } else if (score > 49) {
    badgeColor = "bg-yellow-100 text-yellow-700"
    label = "Good Start"
  }

  return (
    <span
      className={`px-3 py-1 rounded-full  text-xs font-semibold ${badgeColor}`}
    >
      {label}
    </span>
  )
}

const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score >= 70
      ? "text-green-600"
      : score > 49
      ? "text-yellow-600"
      : "text-red-600"
  return (
    <div className="resume-summary">
      <div className="category">
        <div className="flex gap-2 items-center justify-center">
          <p className="text-2xl">{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="text-2xl">
          <span className={textColor}>{score}</span>/100
        </p>
      </div>
    </div>
  )
}

const Summary: React.FC<Props> = ({ feedback }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      <div className="flex flex-row items-center p-4 gap-8">
        <ScoreGauge score={feedback.overallScore} />
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Your Resume Score</h2>
          <p className="text-sm text-gray-500">
            This score is calculated through the following metrics.
          </p>
        </div>
      </div>
      <Category title="Tone and Style" score={feedback.toneAndStyle.score} />
      <Category title="Content" score={feedback.content.score} />
      <Category title="Structure" score={feedback.structure.score} />
      <Category title="Skills" score={feedback.skills.score} />
    </div>
  )
}

export default Summary
