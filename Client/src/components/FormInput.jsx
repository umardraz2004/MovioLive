import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const FormInput = ({ id, label, type, placeholder, register, errors }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Change input type dynamically for password fields
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="block text-sm font-semibold font-WorkSans text-red-500 dark:text-gray-300 mb-1"
      >
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          id={id}
          placeholder={placeholder}
          {...register(id)}
          className={`w-full px-4 py-2 rounded-lg border pr-10
            ${
              errors[id]
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } 
            bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
            focus:outline-none focus:ring-2 focus:ring-red-500`}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            tabIndex={-1}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </button>
        )}
      </div>

      {errors[id] && (
        <p className="text-red-500 text-sm mt-1">{errors[id].message}</p>
      )}
    </div>
  );
};

export default FormInput;
