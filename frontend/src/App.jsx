import { Button } from "@/components/ui/button"
import { toast, Toaster } from "sonner"

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Toaster position="top-center" richColors theme="dark"/>
      <Button onClick={()=>(toast("Hey its Clicked!"))}>Click me</Button>
    </div>
  )
}

export default App