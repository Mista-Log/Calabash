import { AuthLayout } from "@/components/layout/AuthLayout";
import { SignupForm } from "@/components/signup-form";

export default function StudentSignupPage() {
  return (
    <AuthLayout
      image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
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
      />
    </AuthLayout>
  );
}
