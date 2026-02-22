import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LecturerLoginPage() {
  return (
    <AuthLayout
      video="https://ouq07ad0ckrnn7nu.public.blob.vercel-storage.com/lecturer-login.mp4"
      testimonial={{
        quote:
          "Calabash has revolutionized how I communicate with my students and manage course materials. It's the digital archive we've always needed.",
        author: "Prof. Michael Chen",
        role: "Head of Engineering, PlanetTech",
        avatar: "https://i.pravatar.cc/150?u=michael",
      }}
    >
      <LoginForm role="lecturer" />
    </AuthLayout>
  );
}
