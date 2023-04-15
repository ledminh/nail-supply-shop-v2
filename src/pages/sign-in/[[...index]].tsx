import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
    <SignIn path="/sign-in" routing="path" afterSignInUrl='/admin' signUpUrl="/" />
);

export default SignInPage;