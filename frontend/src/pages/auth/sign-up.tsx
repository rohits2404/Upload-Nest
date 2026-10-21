import { SignUpForm } from "@/components/auth/sign-up-form";
import { Logo } from "@/components/logo";

const SignUp = () => {
    return (
        <div className="w-full min-h-svh">
            <div className="flex flex-col gap-4 p-6 md:p-10 md:pt-6">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Logo url="/" />
                </div>
                <div className="flex items-center justify-center">
                    <div className="w-full max-w-xs">
                        <SignUpForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
