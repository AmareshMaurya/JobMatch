import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Select,
  MenuItem,
  Card,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Work as WorkIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { styled } from "@mui/system";

// Styled Components
const GlassCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  padding: theme.spacing(3),
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
  },
}));

const StyledContainer = styled(Box)({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  padding: "2rem",
});

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const { isAuthorized, user } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();

  // Fetching all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/job/getmyjobs",
          { withCredentials: true }
        );
        setMyJobs(data.myJobs);
      } catch (error) {
        toast.error(error.response.data.message);
        setMyJobs([]);
      }
    };
    fetchJobs();
  }, []);

  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
  }

  // Function For Enabling Editing Mode
  const handleEnableEdit = (job) => {
    setCurrentJob(job);
    setEditDialogOpen(true);
  };

  // Function For Disabling Editing Mode
  const handleDisableEdit = () => {
    setEditDialogOpen(false);
    setCurrentJob(null);
  };

  // Function For Updating The Job
  const handleUpdateJob = async () => {
    if (!currentJob) return;

    setLoading(true);
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/job/update/${currentJob._id}`,
        currentJob,
        { withCredentials: true }
      );
      toast.success(data.message);
      setMyJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === currentJob._id ? currentJob : job))
      );
      setEditDialogOpen(false);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // Function For Deleting Job
  const handleDeleteJob = async (jobId) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/job/delete/${jobId}`,
        { withCredentials: true }
      );
      toast.success(data.message);
      setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // Function For Toggling Job Status
  const handleToggleStatus = async (jobId, status) => {
    setLoading(true);
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/job/update/${jobId}`,
        { expired: !status },
        { withCredentials: true }
      );
      toast.success(data.message);
      setMyJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, expired: !status } : job
        )
      );
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          Your Posted Jobs
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigateTo("/post-job")}
          sx={{ borderRadius: "12px", textTransform: "none", fontWeight: "bold" }}
        >
          Add New Job
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {!loading && myJobs.length === 0 ? (
        <Box textAlign="center" py={8}>
          <WorkIcon sx={{ fontSize: 64, color: "text.secondary" }} />
          <Typography variant="h6" color="textSecondary" mt={2}>
            No jobs found. Start by adding a new job!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {myJobs.map((element) => (
            <Grid item xs={12} sm={6} md={4} key={element._id}>
              <GlassCard>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {element.title}
                  </Typography>
                  <Box>
                    <Tooltip title="Edit Job">
                      <IconButton
                        onClick={() => handleEnableEdit(element)}
                        size="small"
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Job">
                      <IconButton
                        onClick={() => handleDeleteJob(element._id)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {element.company}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {element.location}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {element.description}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Category:</strong> {element.category}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Salary:</strong>{" "}
                  {element.fixedSalary
                    ? `₹${element.fixedSalary}`
                    : `₹${element.salaryFrom} - ₹${element.salaryTo}`}
                </Typography>
                <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="textSecondary">
                    Posted: {new Date(element.postedDate).toLocaleDateString()}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!element.expired}
                        onChange={() => handleToggleStatus(element._id, element.expired)}
                        color="primary"
                      />
                    }
                    label={element.expired ? "Inactive" : "Active"}
                  />
                </Box>
              </GlassCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Job Dialog */}
      <Dialog open={editDialogOpen} onClose={handleDisableEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Job</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Job Title"
              value={currentJob?.title || ""}
              onChange={(e) =>
                setCurrentJob({ ...currentJob, title: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Company"
              value={currentJob?.company || ""}
              onChange={(e) =>
                setCurrentJob({ ...currentJob, company: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Location"
              value={currentJob?.location || ""}
              onChange={(e) =>
                setCurrentJob({ ...currentJob, location: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={currentJob?.description || ""}
              onChange={(e) =>
                setCurrentJob({ ...currentJob, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={4}
              required
            />
            <TextField
              fullWidth
              label="Category"
              value={currentJob?.category || ""}
              onChange={(e) =>
                setCurrentJob({ ...currentJob, category: e.target.value })
              }
              margin="normal"
              required
            />
            {currentJob?.fixedSalary ? (
              <TextField
                fullWidth
                label="Fixed Salary"
                value={currentJob?.fixedSalary || ""}
                onChange={(e) =>
                  setCurrentJob({ ...currentJob, fixedSalary: e.target.value })
                }
                margin="normal"
                required
              />
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Salary From"
                  value={currentJob?.salaryFrom || ""}
                  onChange={(e) =>
                    setCurrentJob({ ...currentJob, salaryFrom: e.target.value })
                  }
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Salary To"
                  value={currentJob?.salaryTo || ""}
                  onChange={(e) =>
                    setCurrentJob({ ...currentJob, salaryTo: e.target.value })
                  }
                  margin="normal"
                  required
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisableEdit} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateJob} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default MyJobs;