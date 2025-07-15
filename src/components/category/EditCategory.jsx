import {
  Box,
  Button,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllCategories, updateCategory } from "../../services/CategoryService";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
  minWidth: 400,
};

const EditCategory = ({ edit, data, handleCloseEdit }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent: "",
  });

  // Pre-fill form when modal opens
 useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      const parentsOnly = res.data.filter((cat) => cat.parent === null);
      setCategories(parentsOnly);

      if (data) {
        // Find the parent category by name to get its _id
        const matchedParent = parentsOnly.find(cat => cat.name === data.parent);

        setFormData({
          name: data.name || "",
          description: data.description || "",
          parent: matchedParent?._id || "", // get _id if matched
        });
      }
    } catch (err) {
      console.error("Error loading categories", err);
    }
  };

  fetchCategories();
}, [data]);


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
    const result = await updateCategory()
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <Modal open={edit} onClose={handleCloseEdit}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Edit Category
        </Typography>

        <TextField
          fullWidth
          select
          label="Parent Category"
          name="parent"
          value={formData.parent}
          onChange={handleChange}
          margin="normal"
        >
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Category Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
        />

        {/* <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          margin="normal"
        /> */}

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button onClick={handleCloseEdit} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#2F4F4F", color: "#fff" }}
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditCategory;
