import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <AuthLayout
      image="https://images.unsplash.com/photo-1498243639359-2cee5e8254b3?q=80&w=2070&auto=format&fit=crop"
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
