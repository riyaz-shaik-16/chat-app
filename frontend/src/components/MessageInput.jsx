import { Loader2, Paperclip, Send, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const MessageInput = ({ selectedUser, message, setMessage, handleMessageSend }) => {
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;

    setIsUploading(true);
    await handleMessageSend(e, imageFile);
    setImageFile(null);
    setIsUploading(false);
  };

  if (!selectedUser) return null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-t pt-4">
      {imageFile && (
        <Card className="relative w-fit p-1">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            className="w-24 h-24 object-cover rounded-md"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute -top-2 -right-2"
            onClick={() => setImageFile(null)}
          >
            <X className="w-4 h-4" />
          </Button>
        </Card>
      )}

      <div className="flex items-center gap-2">
        <label className="cursor-pointer">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.type.startsWith("image/")) {
                setImageFile(file);
              }
            }}
          />
          <Button type="button" variant="outline" size="icon">
            <Paperclip size={18} />
          </Button>
        </label>

        <Input
          type="text"
          placeholder={imageFile ? "Add a caption..." : "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1"
        />

        <Button
          type="submit"
          disabled={(!imageFile && !message) || isUploading}
          className="gap-1"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
