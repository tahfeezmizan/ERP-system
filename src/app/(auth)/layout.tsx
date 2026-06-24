export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#17233F] via-[#22325C] to-[#2847A4] p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
