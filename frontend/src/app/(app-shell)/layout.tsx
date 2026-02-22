import { MainLayout } from "@/components/layout/MainLayout";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout showFooter={false}>{children}</MainLayout>;
}
