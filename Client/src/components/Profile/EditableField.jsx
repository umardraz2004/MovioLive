import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const EditableField = ({
  field,
  value,
  editField,
  setEditField,
  handleChange,
  handleSave,
}) => {
  return (
    <div className="flex justify-between items-center bg-white dark:bg-black p-4 rounded-lg shadow-md">
      <div>
        <p className="text-sm font-semibold font-Kanit tracking-wider text-gray-500 dark:text-red-600 capitalize">
          {field}
        </p>
        {editField === field ? (
          <input
            type={"text"}
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            className="mt-1 px-3 py-1 rounded-md border border-gray-200 dark:border-gray-600 bg-gray-200 dark:bg-black text-gray-900 dark:outline-none outline-gray-300 dark:text-gray-100"
          />
        ) : field == "password" ? (
          <p className="text-lg">***********</p>
        ) : (
          <p className="text-lg">{value}</p>
        )}
      </div>
      <div className="flex gap-2">
        {editField === field ? (
          <>
            <button
              onClick={() => handleSave(field)}
              className="p-2 bg-green-600 hover:bg-green-700 rounded-md text-white"
            >
              <FaSave />
            </button>
            <button
              onClick={() => setEditField(null)}
              className="p-2 bg-gray-500 hover:bg-gray-600 rounded-md text-white"
            >
              <FaTimes />
            </button>
          </>
        ) : (
          field != "password" && (
            <button
              onClick={() => setEditField(field)}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
            >
              <FaEdit />
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default EditableField;
