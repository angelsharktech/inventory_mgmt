import {
  Alert,
  Box,
  Button,
  MenuItem,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  getAllCategories,
  updateCategory,
} from "../../services/CategoryService";
import { getUserById } from "../../services/UserService";
import { useAuth } from "../../context/AuthContext";

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

const EditCategory = ({ edit, data, handleCloseEdit, refresh }) => {
  const {webuser} = useAuth();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parent: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  // Pre-fill form when modal opens
  //  useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const res = await getAllCategories();
  //       const parentsOnly = res.data.filter((cat) => cat.parent === null);
  //       setCategories(parentsOnly);

  //       if (data) {
  //         // Find the parent category by name to get its _id
  //         const matchedParent = parentsOnly.find(cat => cat.name === data.parent);

  //         setFormData({
  //           name: data.name || "",
  //           description: data.description || "",
  //           parent: matchedParent?._id || "", // get _id if matched
  //         });
  //       }
  //     } catch (err) {
  //       console.error("Error loading categories", err);
  //     }
  //   };

  //   fetchCategories();
  // }, [data]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getUserById(webuser.id);
        const res = await getAllCategories();
        const parentsOnly = res.data.filter((cat) => cat.parent === null && cat?.organization_id === result.organization_id?._id);
        setCategories(parentsOnly);

        if (data) {
          setFormData({
            name: data.name || "",
            slug: data.name || "",
            description: data.description || "",
            parent: data.parent?._id || "", // access parent._id directly
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
      const payload = {
        ...formData,
        slug: formData.name.toLowerCase(),
        parent: formData.parent === "" ? null : formData.parent,
      };
      const result = await updateCategory(data.id, payload);
      if (result) {
        setSnackbarMessage("Category Updated!");
        setSnackbarOpen(true);
        refresh();
        handleCloseEdit();
      }
    } catch (error) {
      console.error("Update failed", error);
      setSnackbarMessage(error);
      setSnackbarOpen(true);
    }
  };

  return (
    <>
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbarMessage === "Category Updated!" ? "success" : "error"}
          onClose={() => setSnackbarOpen(false)}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditCategory;
