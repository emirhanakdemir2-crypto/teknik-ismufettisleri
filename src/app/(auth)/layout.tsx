export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="auth-page">
      <div className="site-container auth-page__inner">{children}</div>
    </div>
  );
}
