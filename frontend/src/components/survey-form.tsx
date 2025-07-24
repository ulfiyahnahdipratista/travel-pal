import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useNavigate } from "react-router"
import { ApiSurvey } from "@/api/rekomendasi"

const formSchema = z.object({
  question1: z.array(z.string()).min(1, "Pilih setidaknya satu aktivitas."),
  question2: z.string().min(1, "Mohon pilih preferensi jarak."),
  question3: z.string().min(1, "Mohon pilih range usia anda."),
  question4: z.string().min(1, "Mohon pilih frekuensi."),
})

type FormValues = z.infer<typeof formSchema>

export default function SurveyForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question1: [],
      question2: "",
      question3: "",
      question4: "",
    },
    mode: "onChange", // Validasi saat ada perubahan
  })

  const answer = {
    question1: ["Belanja", "Edukasi", "Santai", "Aktifitas keluarga", "Interaksi dengan hewan", "Sejarah dan budaya", "Petualangan"],
    question2: ["Dekat dari tempat tinggal (sekitar kota/kabupaten)", "Sedikit lebih jauh (antar kota di Jawa Tengah)", "Sebebasnya, asal masih di Jawa Tengah"],
    question3: ["Di bawah 18 tahun", "18 - 25 tahun", "26 - 34 tahun", "35 - 50 tahun", "Di atas 50 tahun"],
    question4: ["Jarang (1-2 Kali)", "Kadang - kadang (3-5 Kali)", "Sering (lebih dari 5 kali)"],
  }

  const onSubmit = async (values: FormValues) => {
    console.log("Hasil Survei:", values)
    toast.success("Survei berhasil diserahkan!")

    const SumbitSurvey = await ApiSurvey({
      survey: values.question1,
      max_recom: 2,
      treshold: 0.5
    })

    console.log("SumbitSurvey: ", SumbitSurvey);

    // Di sini Anda bisa mengirim data ke API atau melakukan hal lain setelah submit
    navigate("/")
  }

  // const activities = ["Hiking", "Beach", "Museum", "Shopping", "Food Tour"]
  const totalSteps = 4 // Jumlah total pertanyaan

  const handleNext = async () => {
    // Validasi hanya field pada langkah saat ini
    const fieldToValidate =
      currentStep === 0 ? "question1" :
        currentStep === 1 ? "question2" :
          currentStep === 2 ? "question3" :
            "question4";

    const isValid = await form.trigger(fieldToValidate as keyof FormValues, { shouldFocus: true });

    if (isValid && currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const progressValue = ((currentStep + 1) / totalSteps) * 100;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl bg-white/50 border-white backdrop-blur-lg border-2 rounded-xl mx-auto space-y-8 p-4">
        <Progress value={progressValue} className="w-full mb-6" />
        <Card className="shadow-2xl border-gray-200">
          <CardHeader>
            <CardTitle>Survei Preferensi Perjalanan</CardTitle>
            <CardDescription>Mohon lengkapi survei singkat ini untuk membantu kami memahami preferensi destinasi Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question 1 - Checkbox Group */}
            {currentStep === 0 && (
              <FormField
                control={form.control}
                name="question1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      <p>
                        1. Kalau liburan, kamu lebih suka aktivitas seperti apa? (Pilih semua yang sesuai)
                        <span className="text-red-500">*</span>
                      </p>
                    </FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {answer.question1.map((activity) => (
                        <Label key={activity} htmlFor={activity} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                          <Checkbox
                            id={activity}
                            checked={field.value?.includes(activity)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, activity])
                                : field.onChange(field.value.filter((v: string) => v !== activity))
                            }}
                          />
                          <span className="text-base font-normal">{activity}</span>
                        </Label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Question 2 - Radio Group */}
            {currentStep === 1 && (
              <FormField
                control={form.control}
                name="question2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      2. Seberapa jauh kamu ingin berlibur di Jawa Tengah?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-1 gap-3 mt-2">
                        {answer.question2.map((weather) => (
                          <Label key={weather} htmlFor={weather.toLowerCase()} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                            <RadioGroupItem value={weather} id={weather.toLowerCase()} />
                            <span className="text-base font-normal cursor-pointer">{weather}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Question 3 - Radio Group */}
            {currentStep === 2 && (
              <FormField
                control={form.control}
                name="question3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">3. Berapa usia kamu sekarang?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        {answer.question3.map((budget) => (
                          <Label key={budget} htmlFor={budget.toLowerCase()} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                            <RadioGroupItem value={budget} id={budget.toLowerCase()} />
                            <span className="text-base font-normal cursor-pointer">
                              {budget}
                            </span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Question 4 - Radio Group */}
            {currentStep === 3 && (
              <FormField
                control={form.control}
                name="question4"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">4. Seberapa sering kamu liburan dalam setahun?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-1 gap-3 mt-2">
                        {answer.question4.map((duration, index) => (
                          <Label key={index} htmlFor={`duration-${index}`} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                            <RadioGroupItem value={duration} id={`duration-${index}`} />
                            <span className="text-base font-normal cursor-pointer">{duration}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Sebelumnya
            </Button>
            {currentStep < totalSteps - 1 && (
              <Button type="button" onClick={handleNext}>
                Selanjutnya
              </Button>
            )}
            {currentStep === totalSteps - 1 && (
              <Button type="submit">
                Kirim Survei
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}