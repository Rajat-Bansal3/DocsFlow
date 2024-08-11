import React, { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const UserTypeSelector = ({
  userType,
  setUserType,
  onClickHandler,
}: UserTypeSelectorParams) => {
  const AccessChangeHandler = (type: UserType) => {
    console.log(type)
    setUserType(type);
    onClickHandler && onClickHandler(type)
  };

  return (
    <Select
      value={userType}
      onValueChange={(type: UserType) => AccessChangeHandler(type)}
    >
      <SelectTrigger className='shad-select'>
        <SelectValue placeholder='Select a fruit' />
      </SelectTrigger>
      <SelectContent className="border-none bg-dark-200">
        <SelectGroup>
          <SelectItem value='viewer' className="shad-select-item">Can View</SelectItem>
          <SelectItem value='editor' className="shad-select-item">Can Edit</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default UserTypeSelector;
