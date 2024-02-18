import { AvatarProps } from "@radix-ui/react-avatar";
import Image from "next/image";
import React from "react";
import { Icons } from "./icons";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface UserAvatarProps extends AvatarProps {
  username: string;
  image?: string;
}

function UserAvatar({ username, image }: UserAvatarProps) {
  return (
    <Avatar>
      {image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            src={image}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{username}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}

export default UserAvatar;
