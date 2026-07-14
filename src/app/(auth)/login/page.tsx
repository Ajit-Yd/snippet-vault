import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Snippet Vault
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
