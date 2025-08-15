import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const RoleSelector = ({
  roles,
  editField,
  setEditField,
  handleChange,
  handleSave,
}) => {
  return (
    <div className="flex justify-between items-center bg-white dark:bg-black p-4 rounded-lg shadow-md">
      <div>
        <p className="text-sm font-semibold font-Kanit tracking-wider text-gray-500 dark:text-red-600">
          Roles
        </p>
        {editField === "roles" ? (
          <select
            value={roles[0]}
            onChange={(e) => handleChange("roles", e.target.value)}
            className="mt-1 px-3 py-1 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100"
          >
            {roles.map((role, index) => (
              <option key={index + 1} value={role}>
                {role}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-lg">{roles}</p>
        )}
      </div>
      <div className="flex gap-2">
        {editField === "roles" ? (
          <>
            <button
              onClick={() => handleSave("roles")}
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
          <button
            onClick={() => setEditField("roles")}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
          >
            <FaEdit />
          </button>
        )}
      </div>
    </div>
  );
};

export default RoleSelector;
