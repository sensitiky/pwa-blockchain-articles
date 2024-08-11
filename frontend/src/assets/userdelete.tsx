import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import styled, { keyframes } from "styled-components";

interface ModalUserDeleteProps {
  show: boolean;
  deleteConfirmation: string;
  setDeleteConfirmation: (value: string) => void;
  handleDeleteProfile: () => void;
  handleClose: () => void;
}

interface ModalContainerProps {
  show: boolean;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-50px);
  }
  to {
    transform: translateY(0);
  }
`;

const ModalContainer = styled.div<ModalContainerProps>`
  display: ${(props) => (props.show ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: ${slideIn} 0.3s ease-in-out;
`;

const ModalTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 10px;
`;

const ModalText = styled.p`
  margin-bottom: 20px;
  font-size: 1rem;
  color: #555;
`;

const ModalUserDelete: React.FC<ModalUserDeleteProps> = ({
  show,
  deleteConfirmation,
  setDeleteConfirmation,
  handleDeleteProfile,
  handleClose,
}) => {
  return (
    <ModalContainer show={show}>
      <ModalContent>
        <ModalTitle>Delete Profile</ModalTitle>
        <ModalText>Type "Delete" to confirm profile deletion:</ModalText>
        <Input
          value={deleteConfirmation}
          onChange={(e) => setDeleteConfirmation(e.target.value)}
          className="mb-4"
          placeholder="Type 'Delete' here"
        />
        <Button onClick={handleClose} variant="outline" className="p-4 m-4">
          Cancel
        </Button>
        <Button
          onClick={handleDeleteProfile}
          className="mb-2 p-4"
          disabled={deleteConfirmation !== "Delete"}
        >
          Confirm
        </Button>
      </ModalContent>
    </ModalContainer>
  );
};

export default ModalUserDelete;
