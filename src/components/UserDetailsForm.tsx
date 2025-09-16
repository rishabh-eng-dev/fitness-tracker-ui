import React, { useState } from "react";
import { Box, Typography, TextField, MenuItem, Button } from "@mui/material";
import { UserDetails } from "../contexts/UserDetailsContext";

interface UserDetailsFormProps {
  initialData: UserDetails | null;
  onSave: (updatedData: UserDetails) => void;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
  initialData,
  onSave,
}) => {
  // Initialize with proper default structure
  const getDefaultFormData = (): UserDetails => ({
    personalDetails: {
      weight: 0,
      height: 0,
      dateOfBirth: "",
    },
    preferences: {
      units: {
        weight: "kg",
        distance: "km",
        length: "cm",
      },
    },
    goals: {},
  });

  const [formData, setFormData] = useState<UserDetails>(
    initialData || getDefaultFormData()
  );

  const [errors, setErrors] = useState({
    weight: false,
    height: false,
    dateOfBirth: false,
    preferences: false,
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
    section: string
  ) => {
    const value = event.target.value;

    setFormData((prev) => {
      if (section === "preferences.units") {
        return {
          ...prev,
          preferences: {
            ...prev.preferences,
            units: {
              ...prev.preferences.units,
              [field]: value,
            },
          },
        };
      } else if (section === "goals") {
        return {
          ...prev,
          goals: {
            ...prev.goals,
            [field]: value === "" ? undefined : Number(value),
          },
        };
      } else if (section === "personalDetails") {
        const processedValue =
          field === "dateOfBirth"
            ? value
            : field === "weight" || field === "height"
            ? value === ""
              ? 0
              : Number(value)
            : value;

        return {
          ...prev,
          personalDetails: {
            ...prev.personalDetails,
            [field]: processedValue,
          },
        };
      }

      return prev;
    });
  };

  const validateForm = () => {
    const newErrors = {
      weight: formData.personalDetails?.weight
        ? formData.personalDetails.weight <= 0
        : true,
      height: formData.personalDetails?.height
        ? formData.personalDetails.height <= 0
        : true,
      dateOfBirth:
        !formData.personalDetails?.dateOfBirth ||
        formData.personalDetails.dateOfBirth === "",
      preferences:
        !formData.preferences?.units?.weight ||
        !formData.preferences?.units?.distance ||
        !formData.preferences?.units?.length ||
        formData.preferences.units.weight === "" ||
        formData.preferences.units.distance === "" ||
        formData.preferences.units.length === "",
    };

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).includes(true);
  };

  const handleFormSave = async () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return dateString.split("T")[0];
    } catch {
      return "";
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        User Details
      </Typography>

      {/* Personal Details */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Personal Details:
        </Typography>
        <TextField
          label="Weight"
          type="number"
          fullWidth
          value={formData.personalDetails?.weight || ""}
          onChange={(e) => handleInputChange(e, "weight", "personalDetails")}
          sx={{ mb: 2 }}
          inputProps={{ min: 0, step: 0.1 }}
          error={errors.weight}
          helperText={errors.weight ? "Weight must be greater than 0" : ""}
        />
        <TextField
          label="Height"
          type="number"
          fullWidth
          value={formData.personalDetails?.height || ""}
          onChange={(e) => handleInputChange(e, "height", "personalDetails")}
          sx={{ mb: 2 }}
          inputProps={{ min: 0, step: 0.1 }}
          error={errors.height}
          helperText={errors.height ? "Height must be greater than 0" : ""}
        />
        <TextField
          label="Date of Birth"
          type="date"
          fullWidth
          value={formatDateForInput(formData.personalDetails?.dateOfBirth)}
          onChange={(e) =>
            handleInputChange(e, "dateOfBirth", "personalDetails")
          }
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          error={errors.dateOfBirth}
          helperText={errors.dateOfBirth ? "Date of Birth is required" : ""}
        />
      </Box>

      {/* Preferences */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Preferences:
        </Typography>
        <TextField
          label="Weight Unit"
          select
          fullWidth
          value={formData.preferences?.units?.weight || "kg"}
          onChange={(e) => handleInputChange(e, "weight", "preferences.units")}
          sx={{ mb: 2 }}
          error={errors.preferences}
          helperText={errors.preferences ? "Preferences are required" : ""}
        >
          <MenuItem value="kg">Kilograms (kg)</MenuItem>
          <MenuItem value="lbs">Pounds (lbs)</MenuItem>
        </TextField>
        <TextField
          label="Distance Unit"
          select
          fullWidth
          value={formData.preferences?.units?.distance || "km"}
          onChange={(e) =>
            handleInputChange(e, "distance", "preferences.units")
          }
          sx={{ mb: 2 }}
        >
          <MenuItem value="km">Kilometers (km)</MenuItem>
          <MenuItem value="miles">Miles</MenuItem>
        </TextField>
        <TextField
          label="Length Unit"
          select
          fullWidth
          value={formData.preferences?.units?.length || "cm"}
          onChange={(e) => handleInputChange(e, "length", "preferences.units")}
          sx={{ mb: 2 }}
        >
          <MenuItem value="cm">Centimeters (cm)</MenuItem>
          <MenuItem value="inches">Inches</MenuItem>
        </TextField>
      </Box>

      {/* Save Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleFormSave}
      >
        Update
      </Button>
    </Box>
  );
};

export default UserDetailsForm;
