import { AuthLayout } from "@/components/layout/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export default function StudentSignupPage() {
  return (
    <AuthLayout
      video="https://ouq07ad0ckrnn7nu.public.blob.vercel-storage.com/student%20cover.mp4"
      testimonial={{
        quote:
          "I'm the type of student who used to struggle with finding organized materials. Calabash is truly like a miracle for my grades.",
        author: "Sarah J. Benson",
        role: "Computer Science Undergraduate",
        avatar: "https://i.pravatar.cc/150?u=sarah",
      }}
    >
      <SignupForm
        title="Join Calabash."
        description="Access your course materials and collaborate with peers today."
        defaultRole="student"
      />
    </AuthLayout>
  );
}
