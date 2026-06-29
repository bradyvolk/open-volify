import { authClient } from "@/lib/auth-client";
import { UserProfileMenu } from "@/components/auth/user-profile-menu";
import { Link } from "react-router-dom";
import type { User } from "better-auth";

import logoSmall from "@/assets/open-volify-icon-large.svg";

export const PlatformTopNav = ({ user }: { user: User }) => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex h-16 items-center justify-between">
        <Link to="/platform/projects" className="flex items-center gap-2">
          <img src={logoSmall} alt="OpenVolify" className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-6"></div>
          <div className="flex min-w-[100px]">
            <div className="flex items-center gap-2">
              <UserProfileMenu user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
