'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  const session =  useSession();
  if(session.data?.user && session.status === "authenticated"){
    router.push(`/dashbord`);
  }
  return (
    <div className="min-h-screen bg-[--color-background] text-[--color-foreground] transition-colors duration-500">
      <h1 className="text-3xl font-bold">Main Page Content</h1>
    </div>

  );
}
