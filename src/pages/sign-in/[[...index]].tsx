import { SignIn } from "@clerk/nextjs";
import styles from "@styles/pages/SignIn.module.scss";

const SignInPage = () => (
  <div className={styles.signInPage}>
    <SignIn
      path="/sign-in"
      routing="path"
      afterSignInUrl="/admin"
      signUpUrl="/"
    />
  </div>
);

export default SignInPage;
