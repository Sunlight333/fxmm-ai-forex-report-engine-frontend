export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-bg p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">FXMM</h1>
          <p className="mt-1 text-sm text-gray-500">AI Forex Report Engine</p>
        </div>
        {children}
      </div>
    </div>
  );
}
