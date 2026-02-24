import { AuthLayout } from "@/components/layout/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export default function LecturerSignupPage() {
  return (
    <AuthLayout
      video="https://ouq07ad0ckrnn7nu.public.blob.vercel-storage.com/lecturer%20cover.mp4"
      testimonial={{
        quote:
          "Calabash has revolutionized how I communicate with my students and manage course materials. It's the digital archive we've always needed.",
        author: "Prof. Michael Chen",
        role: "Head of Engineering, PlanetTech",
        avatar: "https://i.pravatar.cc/150?u=michael",
      }}
    >
      <SignupForm
        title="Faculty Access."
        description="Join our network of educators and contribute to the collective knowledge."
        defaultRole="lecturer"
      />
    </AuthLayout>
  );
}
