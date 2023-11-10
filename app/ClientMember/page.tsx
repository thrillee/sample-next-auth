"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const ClientMember = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/ClientMember");
    },
  });

  console.log(session);

  return (
    <div>
      <h1>Client Member</h1>
      <p>{session?.user?.name}</p>
      <p>{session?.user?.role}</p>
    </div>
  );
};

export default ClientMember;
