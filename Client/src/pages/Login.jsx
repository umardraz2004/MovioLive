import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema } from "../utils/schema";
import FormHeader from "../components/FormHeader";
import FormInput from "../components/FormInput";
import FormFooterLink from "../components/FormFooterLink";
import FormSubmittingBtn from "../components/FormSubmittingBtn";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  // ✅ Form submit handler
 const onSubmit = async (data) => {
    console.log("Form data:", data);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // simulating API call
    console.log("Done!");
  };

  return (
    <div className="flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-full max-w-md bg-white dark:bg-black rounded-lg shadow-lg p-8 my-15"
      >
        {/* Logo + Title */}
        <FormHeader
          title={"Welcome Back"}
          subtitle={"Please sign in to continue"}
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          {/* Email */}
          <FormInput
            id={"email"}
            label={"Email Address"}
            type="email"
            placeholder="you@example.com"
            register={register}
            errors={errors}
          />

          {/* Password */}
          <FormInput
            id={"password"}
            label={"Password"}
            type="password"
            placeholder="••••••••"
            register={register}
            errors={errors}
          />

          {/* Submit */}
          <FormSubmittingBtn
            BtnText={"Login"}
            isDisabled={isSubmitting}
            loadingText={"Loging In..."}
          />
        </form>

        {/* Footer Links */}
        <FormFooterLink
          to="/signup"
          title="Signup"
          text="Don't have an account?"
        />
      </motion.div>
    </div>
  );
};

export default Login;
