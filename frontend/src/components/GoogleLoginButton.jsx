import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"

const GoogleLoginButton = ({ onClick,className }) => {
  return (
    <Button
      variant="outline"
      className={`w-full flex gap-2 items-center justify-center border-gray-300 shadow-sm ${className}`}
      onClick={onClick}
    >
      <FcGoogle className="text-xl" />
      Continue with Google
    </Button>
  );
}

export default GoogleLoginButton;
