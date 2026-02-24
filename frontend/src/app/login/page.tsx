import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      video="https://ouq07ad0ckrnn7nu.public.blob.vercel-storage.com/student-login.mp4"
      testimonial={{
        quote:
          "Calabash is the heartbeat of our academic community. It makes finding and sharing knowledge feel like a breeze.",
        author: "Amina K. Idris",
        role: "Student President, UNILAG",
        avatar: "https://i.pravatar.cc/150?u=amina",
      }}
    >
      <LoginForm />
    </AuthLayout>
  );
}
