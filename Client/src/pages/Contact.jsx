import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormHeader from "../components/Form/FormHeader";
import FormInput from "../components/Form/FormInput";
import { contactSchema } from "../utils/schema";
import FormSubmittingBtn from "../components/Form/FormSubmittingBtn";
import { showToast } from "../utils/toast";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        showToast(result.message, "success");
        reset(); // Clear the form
      } else {
        showToast(result.message || "Failed to send message", "error");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      showToast("Failed to send message. Please try again.", "error");
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-full max-w-2xl bg-white dark:bg-black rounded-lg shadow-lg p-10 my-15"
      >
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header */}
          <FormHeader
            title="Contact Us"
            subtitle="Have a question or feedback? Fill out the form below and we’ll get back to you soon."
            showLogo={false}
          />

          {/* Name */}
          <FormInput
            id="name"
            label="Full Name"
            type="text"
            placeholder="Your full name"
            register={register}
            errors={errors}
          />

          {/* Email */}
          <FormInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            register={register}
            errors={errors}
          />

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold font-WorkSans text-red-500 dark:text-gray-300 mb-1"
            >
              Your Message
            </label>
            <textarea
              id="message"
              rows="4"
              placeholder="Write your message here..."
              {...register("message")}
              className={`w-full px-4 py-2 rounded-lg border 
                ${
                  errors.message
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } 
                bg-gray-50 dark:bg-black text-gray-900 dark:text-white 
                focus:outline-none focus:ring-2 focus:ring-red-500`}
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <FormSubmittingBtn
            isDisabled={isSubmitting}
            loadingText={"Sending..."}
            BtnText={"Send Message"}
          />
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;
