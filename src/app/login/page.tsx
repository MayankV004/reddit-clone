import { LoginForm } from "@/components/auth/LoginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
export default async function LoginPage() {
    const session = await getServerSession(authOptions);

    if(session) {
        redirect("/");
    }

    return (
        <div className="container mx-auto py-8">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-6 flex items-center gap-2">
          <Image src="/Reddit_Logo.webp" alt="Reddit Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold">reddit</h1>
        </div>
        <LoginForm />
      </div>
    </div>
    )

}