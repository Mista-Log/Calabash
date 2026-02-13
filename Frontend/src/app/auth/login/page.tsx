import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/login-form";

export default function AuthLoginPage() {
  return (
    <AuthLayout
      image="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop"
      testimonial={{
        quote:
          "The seamless login and access to resources have made my research workflow much more efficient. Calabash is a game-changer.",
        author: "David Olumide",
        role: "Postgraduate Researcher",
        avatar: "https://i.pravatar.cc/150?u=david",
      }}
    >
      <LoginForm />
    </AuthLayout>
  );
}
