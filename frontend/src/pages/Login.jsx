import GoogleLoginButton from "../components/GoogleLoginButton"
import { Toaster } from "@/components/ui/sonner"

const Login = () => {

  const handleOnClick = () => {
    window.location.href = "http://localhost:9000/api/auth/google";
  }
  return (
    <div className="h-screen flex justify-center items-center">
      <GoogleLoginButton className="w-sm cursor-pointer" onClick={handleOnClick}/>
      <Toaster position="top-center"/>
    </div>
  )
}

export default Login
