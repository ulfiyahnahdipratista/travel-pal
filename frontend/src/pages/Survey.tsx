import SurveyForm from "@/components/survey-form"

const Survey = () => {
  return (
    <div
      className="flex flex-col bg-no-repeat bg-cover filter bg-blend-darken items-center justify-center min-h-screen bg-gray-100 p-4"
      style={{ backgroundImage: "url('/img/background.png')" }}>
      <SurveyForm />
    </div>
  )
}

export default Survey