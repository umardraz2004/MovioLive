const FormSubmittingBtn = ({ isDisabled, loadingText, BtnText }) => {
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg
                       font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-400
                       disabled:opacity-50"
    >
      {isDisabled ? loadingText : BtnText}
    </button>
  );
};

export default FormSubmittingBtn;
