import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignupSchema } from "../utils/schema";
import FormHeader from "../components/FormHeader";
import FormInput from "../components/FormInput";
import FormFooterLink from "../components/FormFooterLink";
import FormSubmittingBtn from "../components/FormSubmittingBtn";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(SignupSchema),
  });

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // simulating API call
    console.log("Done!");
  };
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4.5rem)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-full max-w-md bg-white dark:bg-black rounded-lg shadow-lg p-8 my-15"
      >
        {/* Logo + Title */}
        <FormHeader
          title={"Create Your Account"}
          subtitle={"Sign up to join MovioLive"}
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-5">
          {/* Name */}
          <FormInput
            id={"fullName"}
            label={"Full Name"}
            type="text"
            placeholder="Your full name"
            register={register}
            errors={errors}
          />

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

          {/* Confirm Password */}
          <FormInput
            id={"confirmPassword"}
            label={"Confirm Password"}
            type="password"
            placeholder="••••••••"
            register={register}
            errors={errors}
          />

          {/* Submit */}
          <FormSubmittingBtn
            BtnText={"Sign Up"}
            isDisabled={isSubmitting}
            loadingText={"Signing Up..."}
          />
        </form>

        {/* Footer Links */}
        <FormFooterLink
          to="/login"
          title="Login"
          text="Already have an account?"
        />
      </motion.div>
    </div>
  );
};

export default Signup;
