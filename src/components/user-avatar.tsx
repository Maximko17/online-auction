import { AvatarProps } from "@radix-ui/react-avatar";
import React from "react";
import { Icons } from "./icons";
import { Avatar, AvatarFallback } from "./ui/avatar";
import NextImage from "./ui/next-image";
import { User } from "@/types";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "username" | "image">;
}

function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <NextImage
            layout="fill"
            src={user.image}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.username}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}

export default UserAvatar;
