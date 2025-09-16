import { Box, Modal } from "@mui/material";
import UserDetailsForm from "./UserDetailsForm";
import { UserDetails, useUserDetails } from "../contexts/UserDetailsContext";
import { userDetailsService } from "../services/userDetailsService";

interface UserDetailsModalProps {
  open: boolean;
  onSave: () => void;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  open,
  onSave,
  onClose,
}) => {
  const { setUserDetails } = useUserDetails();

  const handleSave = async (form: UserDetails) => {
    try {
      const data = await userDetailsService.createUserDetails(form);
      // Update context with the saved details
      setUserDetails(data);
      // Call onSave callback
      onSave();
      onClose();
    } catch (error) {
      console.error("Error updating user details:", error);
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="user-details-modal-title"
      aria-describedby="user-details-modal-description"
    >
      <Box
        component="form"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <UserDetailsForm initialData={null} onSave={handleSave} />
      </Box>
    </Modal>
  );
};

export default UserDetailsModal;
