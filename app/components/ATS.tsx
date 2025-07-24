import React from "react"

interface Props {
  score: number
  suggestions: Feedback["ATS"]["tips"]
}

const ATS: React.FC<Props> = ({ score, suggestions }) => {
  return <div>ATS</div>
}

export default ATS
