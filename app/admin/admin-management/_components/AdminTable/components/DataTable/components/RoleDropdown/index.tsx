import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';

interface RoleFilterProps {
  selectedRole: string | undefined;
  setSelectedRole: (role: string | undefined) => void;
}

const roles = [
  { value: "ALL", label: "All Role" },  // Use "ALL" instead of an empty string
  { value: "ADMIN", label: "Admin" },
  { value: "USER", label: "User" },
  { value: "SUPER", label: "Super Admin" },
];

const RoleDropdown: React.FC<RoleFilterProps> = ({ selectedRole, setSelectedRole }) => {
  const handleValueChange = (value: string) => {
    setSelectedRole(value === "ALL" ? undefined : value);
  };

  return (
    <Select value={selectedRole ?? "ALL"} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default RoleDropdown;
