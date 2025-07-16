'use client';
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Pagination from "./Pagination";
import { AddNewRole, updateRoleDetails, checkRoleExists, checkRoleActive, deleteRole, AddNewSkill } from "../../firebase/actions/general.action"; // Import deleteRole

import Button from "../ui/button/Button";
import { LoaderIcon } from "lucide-react"; // Only LoaderIcon is used from lucide-react now
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import { toast } from "sonner";
import { PencilIcon, TrashBinIcon } from "@/icons";
import CreatableSelect from "react-select/creatable";
import { StylesConfig, GroupBase } from 'react-select';
interface Role {
  id: string;
  role: string;
  createdAt: string;
  flag: boolean;
   skillsetIds?: string[];
  skillsetNames?: string[];
}
interface Skill {
  id: string;
  skill: string;
}

interface SelectOption {
  value: string;
  label: string;
}
interface PageProps {
  fdata: Role[];
  total: string;
  refetch: () => void;
  loading: boolean;
  skills: Skill[];
}

export default function TableRoles({ fdata,skills, refetch, loading }: PageProps) {
  const [selectedSkills, setSelectedSkills] = useState<SelectOption[]>([]);
const skillOptions: SelectOption[] = skills.map((s) => ({
  value: s.id,
  label: s.skill,
}));
  const [isOpen, setIsOpen] = useState(false); // For update modal
  const [isAddOpen, setIsAddOpen] = useState(false); // For add new modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // For delete confirmation modal

  const [roleName, setRoleName] = useState("");
  const [flag, setFlag] = useState(true);
  const [roleId, setRoleId] = useState("");
  const [roleToDeleteName, setRoleToDeleteName] = useState(""); // To display in delete confirmation
  const [isUpdating, setIsUpdating] = useState(false); // For add/update operations
  const [isDeleting, setIsDeleting] = useState(false); // For delete operation

  // --- Add Modal Handlers ---
  const openAddModal = () => {
    setRoleName("");
    setFlag(true);
    setIsAddOpen(true);
    setSelectedSkills([]);
  };

  const closeAddModal = () => {
    setIsAddOpen(false);
    setSelectedSkills([]);
  };

  // --- Update Modal Handlers ---
  const openModal = (
    id: string,
  name: string,
  activeFlag: boolean,
  skillNames: string[] = [],
  skillIds: string[] = []
  ) => {
  setRoleId(id);
  setRoleName(name);
  setFlag(activeFlag);
  setSelectedSkills(
    skillIds.map((id, index) => ({
      value: id,
      label: skillNames[index] || "",
    }))
  );
  setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // --- Delete Modal Handlers ---
  const openDeleteModal = (id: string, name: string) => {
    setRoleId(id);
    setRoleToDeleteName(name);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setRoleId(""); // Clear the ID after closing
    setRoleToDeleteName(""); // Clear the name after closing
  };

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(fdata.length / pageSize);

  const fdataWithPage = fdata.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // --- Firebase Action Handlers ---
const handleCreateSkill = async (inputValue: string) => {
  if (!inputValue.trim()) return;

  const exists = selectedSkills.some(
    (s) => s.label.toLowerCase() == inputValue.toLowerCase()
  );
  if (exists) {
    // toast.warning("Skill already selected.");
    return;
  }

  try {
    const result = await AddNewSkill({ skill: inputValue });

    if (result.success && result.id) {
      const newSkill = { label: inputValue, value: result.id };

      setSelectedSkills((prev) => [...prev, newSkill]);

      toast.success(`New skill "${inputValue}" added!`);
    } else {
      // toast.error("Failed to add new skill.");
    }
  } catch (error) {
    console.error("Skill creation error:", error);
    // toast.error("Error while creating skill.");
  }
};
  const handleAddRole = async () => {
    if (!roleName.trim()) {
      toast.error("Role name cannot be empty.", {
        duration: 2000,
        style: { background: "#ff3f3f" },
      });
      return;
    }

    setIsUpdating(true);
    try {
      toast("Adding New Role, Please wait...", {
        style: {},
        duration: 1000,
        icon: <LoaderIcon />,
        id: "feedback-toast",
      });

      const foundRole = await checkRoleExists({
        role: roleName,
        flag: flag,
      });

      if (!foundRole.success) {
        console.log("🚀 SkillsetIds:", selectedSkills.map((s) => s.value));
      console.log("🚀 SkillsetNames:", selectedSkills.map((s) => s.label));
        const result = await AddNewRole({
          role: roleName,
          flag: flag,
          skillsetIds: selectedSkills.map((s) => s.value),
          skillsetNames: selectedSkills.map((s) => s.label),
        });

        if (result.success) {
          toast.success("Role added successfully!", {
            style: { background: "#309f60", color: "white" },
          });
          closeAddModal();
          refetch();
        } else {
          toast.error("Failed to add role.");
        }
      } else {
        if (flag) {
          toast.error("Already existing " + roleName + " role available with status Active", {
            duration: 2000,
            style: { background: "#ff3f3f" },
          });
        } else {
          toast.error("Already existing " + roleName + " role available with status Inactive", {
            duration: 2000,
            style: { background: "#ff3f3f" },
          });
        }
      }
    } catch (error) {
      console.error("Failed to add new role information:", error);
      toast.error("Failed to add new role information.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!roleName.trim()) {
      toast.error("Role name cannot be empty.", {
        duration: 2000,
        style: { background: "#ff3f3f" },
      });
      return;
    }

    setIsUpdating(true);
    try {
      toast("Updating role details, please wait...", {
        style: {},
        duration: 1000,
        icon: <LoaderIcon />,
        id: "feedback-toast",
      });

      const foundRole = await checkRoleActive({
        roleId,
        role: roleName,
        flag: flag,
      });

      if (!foundRole.success) {
        const result = await updateRoleDetails({
       roleId,
        role: roleName,
        flag: flag,
        skillsetIds: selectedSkills.map((s) => s.value),
        skillsetNames: selectedSkills.map((s) => s.label),
        });

        if (result.success) {
          toast.success("Role details updated successfully!", {
            style: { background: "#309f60", color: "white" },
          });
          closeModal();
          refetch();
        } else {
          toast.error("Failed to update information.");
        }
      } else {
        if (flag) {
          toast.error("Already existing " + roleName + " role available with status Active", {
            duration: 2000,
            style: { background: "#ff3f3f" },
          });
        } else {
          toast.error("Already existing " + roleName + " role available with status Inactive", {
            duration: 2000,
            style: { background: "#ff3f3f" },
          });
        }
      }
    } catch (error) {
      console.error("Failed to update information:", error);
      toast.error("Failed to update information.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!roleId) {
      toast.error("No role selected for deletion.", {
        duration: 2000,
        style: { background: "#ff3f3f" },
      });
      return;
    }

    setIsDeleting(true);
    try {
      toast("Deleting role, please wait...", {
        style: {},
        duration: 1000,
        icon: <LoaderIcon />,
        id: "feedback-toast",
      });

      const result = await deleteRole(roleId);

      if (result.success) {
        toast.success("Role deleted successfully!", {
          style: { background: "#309f60", color: "white" },
        });
        closeDeleteModal();
        refetch();
      } else {
        toast.error("Failed to delete role.");
      }
    } catch (error) {
      console.error("Failed to delete role:", error);
      toast.error("Failed to delete role.");
    } finally {
      setIsDeleting(false);
    }
  };

const getCustomSelectStyles = (
  hasError: boolean
): StylesConfig<SelectOption, true, GroupBase<SelectOption>> => ({
  control: (provided, state) => ({
    ...provided,
    minHeight: '44px',
    borderRadius: '0.5rem',
    backgroundColor: 'transparent',
    borderColor: hasError ? '#f87171' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
    '&:hover': {
      borderColor: '#3b82f6',
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#3b82f6'
      : state.isFocused
      ? '#e0e7ff'
      : 'white',
    color: state.isSelected ? 'white' : 'black',
    cursor: 'pointer',
  }),
});
  
  return (
    <div>
      <div className="flex flex-row-reverse">
        <button
          type="button"
          onClick={openAddModal}
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Add New Role
        </button>
      </div>
     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
  <div className="max-w-full overflow-x-auto">
    <div className="min-w-[900px]">
      <Table className="table-fixed w-full">
        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
          <TableRow>
            <TableCell isHeader className="w-[30%] px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
              Role Name
            </TableCell>
            <TableCell isHeader className="w-[55%] px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
              Skillset
            </TableCell>
            <TableCell isHeader className="w-[15%] px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
              Actions
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                  Loading data...
                </div>
              </TableCell>
            </TableRow>
          ) : fdataWithPage.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                  No data found
                </div>
              </TableCell>
            </TableRow>
          ) : (
            fdataWithPage.map((data) => (
              <TableRow key={data.id}>
                <TableCell className="w-[30%] px-5 py-4">
                  <div className="font-medium text-base text-gray-800 dark:text-white/90">
                    {data.role}
                  </div>
                </TableCell>

                <TableCell className="w-[55%] px-5 py-4">
                  <div className="flex flex-col gap-2">
                    {data.skillsetNames?.length ? (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {data.skillsetNames.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300 text-xs font-medium px-3 py-1 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                       
                        <button
                          className="w-fit text-xs text-blue-600 hover:underline"
                          onClick={() =>
                            openModal(
                              data.id,
                              data.role,
                              data.flag,
                              data.skillsetNames,
                              data.skillsetIds
                            )
                          }
                        >
                          Manage Skills +
                        </button>
                         </div>
                      </>
                    ) : (
                      <button
                        className="w-fit text-xs text-blue-600 hover:underline"
                        onClick={() =>
                          openModal(
                            data.id,
                            data.role,
                            data.flag,
                            [],
                            []
                          )
                        }
                      >
                        + Add Skills
                      </button>
                    )}
                  </div>
                </TableCell>

                <TableCell className="w-[15%] px-5 py-4 flex gap-2">
                  <button
                    onClick={() => {
                      openModal(
                        data.id,
                        data.role,
                        data.flag,
                        data.skillsetNames,
                        data.skillsetIds
                      );
                    }}
                    className="w-fit cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-md p-1"
                  >
                    <PencilIcon color="#fd8f00" />
                  </button>
                  <button
                    onClick={() => {
                      openDeleteModal(data.id, data.role);
                    }}
                    className="w-fit cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-md p-1"
                  >
                    <TrashBinIcon color="#e62c22" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  </div>

        {/* Update Role Modal */}
 <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
  <div className="relative w-full h-[90vh] flex flex-col bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
    
    {/* Modal Header */}
    <div className="px-2 pr-14 pt-6">
      <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
        Update Role
      </h4>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400"></p>
    </div>

    {/* Scrollable Content */}
    <form
      className="flex flex-col flex-grow overflow-y-auto px-2"
      onSubmit={(e) => {
        e.preventDefault();
        handleUpdateRole();
      }}
    >
      <div>
        <Label>Role Name</Label>
        <input
          type="text"
          value={roleName}
          placeholder="Enter role"
          onChange={(e) => setRoleName(e.target.value)}
          className="h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        />
      </div>

      <div className="my-5">
        <Label>Skillset</Label>
        <CreatableSelect
          isMulti
          isClearable
          value={selectedSkills}
          onChange={(selected) => setSelectedSkills(selected as SelectOption[])}
          options={skillOptions}
          placeholder="Select or type skills"
          styles={getCustomSelectStyles(false)}
        />
      </div>

  
    </form>

    {/* Sticky Footer */}
    <div className="px-4 py-4 border-t border-gray-200 dark:border-white/[0.1] flex items-center justify-end gap-3">
      <Button size="sm" variant="outline" onClick={closeModal}>
        Close
      </Button>
      <Button size="sm" onClick={handleUpdateRole} disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update"}
      </Button>
    </div>
  </div>
</Modal>

        {/* Add New Role Modal */}
<Modal isOpen={isAddOpen} onClose={closeAddModal} className="max-w-[700px] m-4">
  <div className="relative w-full h-[90vh] flex flex-col bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
    
    {/* Modal Header */}
    <div className="px-2 pr-14 pt-6">
      <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
        New Role
      </h4>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400"></p>
    </div>

    {/* Scrollable Content */}
   <form
  className="flex flex-col flex-grow overflow-y-auto px-2"
  onSubmit={(e) => {
    e.preventDefault();
    handleAddRole();
  }}
>
      <div>
        <Label>Role Name</Label>
        <input
          type="text"
          value={roleName}
          placeholder="Enter role"
          onChange={(e) => setRoleName(e.target.value)}
          className="h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        />
      </div>

      <div className="my-5">
        <Label>Skillset</Label>
        <CreatableSelect
          isMulti
          isClearable
          value={selectedSkills}
          onChange={(selected) => setSelectedSkills(selected as SelectOption[])}
           onCreateOption={handleCreateSkill} // ← this ensures manual addition logic
          options={skillOptions}
          placeholder="Select or type skills"
          styles={getCustomSelectStyles(false)}
        />
      </div>
      
    </form>

    {/* Sticky Footer */}
    <div className="px-4 py-4 border-t border-gray-200 dark:border-white/[0.1] flex items-center justify-end gap-3">
      <Button size="sm" variant="outline" onClick={closeAddModal}>
        Close
      </Button>
      <Button size="sm" onClick={handleAddRole} disabled={isUpdating}>
        {isUpdating ? "Saving Role..." : "Save Role"}
      </Button>
    </div>
  </div>
</Modal>


        {/* Delete Role Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal} className="max-w-[500px] m-4">
          <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Confirm Deletion
              </h4>
              <p className="mb-6 text-base text-gray-500 dark:text-gray-400">
                Are you sure you want to delete the role: <span className="font-bold text-red-500">{roleToDeleteName}</span>?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 justify-end">
              <Button size="sm" variant="outline" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button size="sm"  disabled={isDeleting} onClick={handleDeleteRole}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Pagination Footer */}
        <div className="px-5 py-4 border-t border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}