import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function StudentLoginPage() {
  return (
    <AuthLayout
      video="https://ouq07ad0ckrnn7nu.public.blob.vercel-storage.com/student-login.mp4"
      testimonial={{
        quote:
          "The seamless login and access to resources have made my research workflow much more efficient. Calabash is a game-changer.",
        author: "David Olumide",
        role: "Postgraduate Researcher",
        avatar: "https://i.pravatar.cc/150?u=david",
      }}
    >
      <LoginForm role="student" />
    </AuthLayout>
  );
}
