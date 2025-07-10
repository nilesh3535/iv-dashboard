'use client';
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Pagination from "./Pagination";
import { AddNewSkill, checkSkillActive, checkSkillExists, updateSkillDetails, deleteSkill } from "../../firebase/actions/general.action"; // Import deleteSkill

import moment from "moment";
import Switch from "../form/switch/Switch";
import Button from "../ui/button/Button";
import { LoaderIcon } from "lucide-react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import { toast } from "sonner";
import { PencilIcon, TrashBinIcon } from "@/icons"; // Assuming you have these icons available

interface Skills {
  id: string;
  skill: string;
  createdAt: string;
  flag: boolean;
}

interface Props {
  fdata: Skills[];
  total: string;
  refetch: () => void;
  loading: boolean;
}

export default function TableSkills({ fdata, refetch, loading }: Props) {
  const [isOpen, setIsOpen] = useState(false); // For update modal
  const [isAddOpen, setIsAddOpen] = useState(false); // For add new modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // For delete confirmation modal

  const [skillName, setSkillName] = useState("");
  const [flag, setFlag] = useState(true);
  const [skillId, setSkillId] = useState("");
  const [skillToDeleteName, setSkillToDeleteName] = useState(""); // To display in delete confirmation
  const [isUpdating, setIsUpdating] = useState(false); // For add/update operations
  const [isDeleting, setIsDeleting] = useState(false); // For delete operation

  // --- Add Modal Handlers ---
  const openAddModal = () => {
    setSkillName("");
    setFlag(true);
    setIsAddOpen(true);
  };

  const closeAddModal = () => {
    setIsAddOpen(false);
  };

  // --- Update Modal Handlers ---
  const openModal = (
    id: string,
    name: string,
    activeFlag: boolean,
  ) => {
    setSkillId(id);
    setSkillName(name);
    setFlag(activeFlag);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // --- Delete Modal Handlers ---
  const openDeleteModal = (id: string, name: string) => {
    setSkillId(id);
    setSkillToDeleteName(name);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setSkillId(""); // Clear the ID after closing
    setSkillToDeleteName(""); // Clear the name after closing
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

  const handleAddSkill = async () => {
    if (!skillName.trim()) {
      toast.error("Skill name cannot be empty.", {
        duration: 2000,
        style: { background: "#ff3f3f" },
      });
      return;
    }

    setIsUpdating(true);
    try {
      toast("Adding New Skill, Please wait...", {
        style: {},
        duration: 1000,
        icon: <LoaderIcon />,
        id: "feedback-toast",
      });

      const foundSkill = await checkSkillExists({
        skill: skillName,
        flag: flag,
      });

      if (!foundSkill.success) {
        const result = await AddNewSkill({
          skill: skillName,
          flag: flag,
        });

        if (result.success) {
          toast.success("Skill added successfully!", {
            style: { background: "#309f60", color: "white" },
          });
          closeAddModal();
          refetch();
        } else {
          toast.error("Failed to add skill.");
        }
      } else {
        if (flag) {
          toast.error("Already existing " + skillName + " skill available with status Active", {
            duration: 2000,
            style: { background: "#ff3f3f" },
          });
        } else {
          toast.error("Already existing " + skillName + " skill available with status Inactive", {
            duration: 2000,
            style: { background: "#ff3f3f" },
          });
        }
      }
    } catch (error) {
      console.error("Failed to add new skill information:", error);
      toast.error("Failed to add new skill information.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateSkill = async () => {
    if (!skillName.trim()) {
      toast.error("Skill name cannot be empty.", {
        duration: 2000,
        style: { background: "#ff3f3f" },
      });
      return;
    }

    setIsUpdating(true);
    try {
      toast("Updating skill details, please wait...", {
        style: {},
        duration: 1000,
        icon: <LoaderIcon />,
        id: "feedback-toast",
      });

      const foundSkill = await checkSkillActive({
        skillId,
        skill: skillName,
        flag: flag,
      });

      if (!foundSkill.success) {
        const result = await updateSkillDetails({
          skillId,
          skill: skillName,
          flag: flag,
        });

        if (result.success) {
          toast.success("Skill details updated successfully!", {
            style: { background: "#309f60", color: "white" },
          });
          closeModal();
          refetch();
        } else {
          toast.error("Failed to update information.");
        }
      } else {
        if (flag) {
          toast.error("Already existing " + skillName + " skill available with status Active", {
            duration: 2000,
            style: { background: "#ff3f3f" },
          });
        } else {
          toast.error("Already existing " + skillName + " skill available with status Inactive", {
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

  const handleDeleteSkill = async () => {
    if (!skillId) {
      toast.error("No skill selected for deletion.", {
        duration: 2000,
        style: { background: "#ff3f3f" },
      });
      return;
    }

    setIsDeleting(true);
    try {
      toast("Deleting skill, please wait...", {
        style: {},
        duration: 1000,
        icon: <LoaderIcon />,
        id: "feedback-toast",
      });

      const result = await deleteSkill(skillId);

      if (result.success) {
        toast.success("Skill deleted successfully!", {
          style: { background: "#309f60", color: "white" },
        });
        closeDeleteModal();
        refetch();
      } else {
        toast.error("Failed to delete skill.");
      }
    } catch (error) {
      console.error("Failed to delete skill:", error);
      toast.error("Failed to delete skill.");
    } finally {
      setIsDeleting(false);
    }
  };

  

  return (
    <div>
      <div className="flex flex-row-reverse">
        <button
          type="button"
          onClick={openAddModal}
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Add New Skill
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                    Skill Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                    Created
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                    Flag
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                        Loading data...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : fdataWithPage.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                        No data found
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  fdataWithPage.map((data) => (
                    <TableRow key={data.id}>
                      <TableCell className="px-5 py-4 ">
                        <div className="font-medium text-base text-gray-800 dark:text-white/90">
                          {data.skill}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 ">
                        <div className="">
                          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                            {moment(data.createdAt).format("DD/MM/YYYY hh:mm A")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 ">
                        <div className={`${data.flag ? "text-green-500" : "text-red-500"}`}>
                          {data.flag ? "Active" : "Inactive"}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 flex gap-2">
                        <button
                          onClick={() => {
                            openModal(data.id, data.skill, data.flag);
                          }}
                          className="w-fit cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-md p-1"
                        >
                          <PencilIcon color="#fd8f00" />
                        </button>
                        <button
                          onClick={() => {
                            openDeleteModal(data.id, data.skill);
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
        {/* Update Skill Modal */}
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
          <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Update Skill
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7"></p>
            </div>
            <form
              className="flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateSkill();
              }}
            >
              <div className="px-2 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Skill Name</Label>
                    <input
                      type="text"
                      value={skillName}
                      onChange={(e) => setSkillName(e.target.value)}
                      className="h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                  </div>
                  <div>
                    <Label>Flag</Label>
                    <div className="flex w-full flex-row justify-center p-2 gap-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Inactive</p>
                      <Switch
                        label=""
                        defaultChecked={flag}
                        onChange={setFlag}
                        color={flag ? "green" : "green"}
                      />
                      <p className={`text-sm font-medium ${flag ? "text-green-700 dark:text-green-400" : "text-gray-700 dark:text-gray-400"}`}>Active</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  Close
                </Button>
                <Button size="sm" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Add New Skill Modal */}
        <Modal isOpen={isAddOpen} onClose={closeAddModal} className="max-w-[700px] m-4">
          <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                New Skill
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7"></p>
            </div>
            <form
              className="flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                handleAddSkill();
              }}
            >
              <div className="px-2 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Skill Name</Label>
                    <input
                      type="text"
                      value={skillName}
                      onChange={(e) => setSkillName(e.target.value)}
                      className="h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                  </div>
                  <div>
                    <Label>Flag</Label>
                    <div className="flex w-full flex-row justify-center p-2 gap-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Inactive</p>
                      <Switch
                        label=""
                        defaultChecked={flag}
                        onChange={setFlag}
                        color={flag ? "green" : "green"}
                      />
                      <p className={`text-sm font-medium ${flag ? "text-green-700 dark:text-green-400" : "text-gray-700 dark:text-gray-400"}`}>Active</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" variant="outline" onClick={closeAddModal}>
                  Close
                </Button>
                <Button size="sm" disabled={isUpdating}>
                  {isUpdating ? "Saving Skill..." : "Save Skill"}
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Delete Skill Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal} className="max-w-[500px] m-4">
          <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Confirm Deletion
              </h4>
              <p className="mb-6 text-base text-gray-500 dark:text-gray-400">
                Are you sure you want to delete the skill: <span className="font-bold text-red-500">{skillToDeleteName}</span>?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 justify-end">
              <Button size="sm" variant="outline" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button size="sm"  disabled={isDeleting} onClick={handleDeleteSkill}>
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