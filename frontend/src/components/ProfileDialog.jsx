import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const ProfileDialog = ({ user }) => {
  return (
    <Dialog>
      <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
        <div>
          <DialogTrigger asChild>
            <button className="w-full text-left">Profile</button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Profile</DialogTitle>
              <DialogDescription>Profile Information</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Avatar className="h-20 w-20 mx-auto">
                  <AvatarImage src={user?.picture} alt={user?.fullName} />
                  <AvatarFallback>{user?.fullName?.[0] ?? "U"}</AvatarFallback>
                </Avatar>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={user?.fullName || ""} disabled />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ""} disabled/>
              </div>
            </div>
          </DialogContent>
        </div>
      </DropdownMenuItem>
    </Dialog>
  );
};

export default ProfileDialog;
