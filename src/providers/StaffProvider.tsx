import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getStaffMembers } from "src/utils/api"; // Adjust the API functions as needed
import { StaffMemberProps } from "src/utils/types";
import { useLogin } from "./LoginProvider";

interface StaffContextProps {
  staffData: StaffMemberProps[];
  setStaffData: React.Dispatch<React.SetStateAction<StaffMemberProps[]>>;
  // Add any other functions or data you need here
}

const useStaffState = () => {
  const queryClient = useQueryClient();
  const [staffData, setStaffData] = useState<StaffMemberProps[]>([]);
  const { isLoggedIn } = useLogin();

  const { data: fetchStaffData } = useQuery("staff", getStaffMembers, {
    enabled: isLoggedIn,
  });

  useEffect(() => {
    if (fetchStaffData) {
      setStaffData(fetchStaffData);
      fetchStaffData.forEach(async (staffMember) => {
        // Cache each staff member individually using queryClient
        // You may need to adjust the query keys and API functions
      });
    }
  }, [fetchStaffData, queryClient]);

  return { staffData, setStaffData };
};

const useStaffOperations = (
  staffData: StaffMemberProps[],
  setStaffData: React.Dispatch<React.SetStateAction<StaffMemberProps[]>>
) => {
  // Define functions for adding, updating, or deleting staff members, and any other operations you need
};

const StaffContext = createContext<StaffContextProps | undefined>(undefined);

interface StaffProviderProps {
  children: React.ReactNode; // Explicitly specify children prop
}

export const StaffProvider: React.FC<StaffProviderProps> = ({ children }) => {
  const { staffData, setStaffData } = useStaffState();
  // Add any other state variables you need
  const staffOps = useStaffOperations(staffData, setStaffData);

  return (
    <StaffContext.Provider
      value={{
        staffData,
        setStaffData,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = (): StaffContextProps => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
};
