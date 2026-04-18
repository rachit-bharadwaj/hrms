import { LoginForm } from "@/components/auth";
import { Logo } from "@/partials/common";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-100 rounded-full blur-[120px] opacity-60"></div>

      <div className="z-10 w-full max-w-[440px] flex flex-col justify-center items-center gap-8">
        <div className="flex items-center gap-3">
          <Logo />
          <h1 className="font-bricolage-grotesque text-4xl">Harbor</h1>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] border border-white shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col gap-6">
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-2xl font-bold text-slate-900 font-bricolage-grotesque">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm">
              Please enter your details to sign in
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
