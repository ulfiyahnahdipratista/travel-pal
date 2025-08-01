import { RegisterFormNew } from "@/components/register-form-new"
import { Link } from "react-router"

const Register = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-0 font-medium">
            <div className="bg-white text-primary-foreground flex size-10 items-center justify-center rounded-md">
              <img className="size-10" src="/img/logo.png" alt="" />
            </div>
            Travel Pal
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterFormNew />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/img/background.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

export default Register
