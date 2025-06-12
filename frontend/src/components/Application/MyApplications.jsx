import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  CircularProgress,
  Skeleton,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { Search, Download, Delete, Visibility } from "@mui/icons-material";

// Styled Card with Gradient Background and Hover Effects
const StyledCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
  borderRadius: "12px",
  boxShadow: theme.shadows ? theme.shadows[3] : "0px 4px 10px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows ? theme.shadows[8] : "0px 8px 24px rgba(0, 0, 0, 0.2)",
  },
}));

// Empty State with Animation
const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4),
  "& img": {
    width: "200px",
    marginBottom: theme.spacing(2),
    animation: "float 3s ease-in-out infinite",
  },
  "@keyframes float": {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-10px)" },
  },
}));

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
    }
  }, [isAuthorized, navigateTo]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (user && user.role === "Employer") {
          const res = await axios.get("http://localhost:4000/api/v1/application/employer/getall", {
            withCredentials: true,
          });
          setApplications(res.data.applications);
        } else {
          const res = await axios.get("http://localhost:4000/api/v1/application/jobseeker/getall", {
            withCredentials: true,
          });
          setApplications(res.data.applications);
        }
      } catch (error) {
        console.error("Error fetching applications:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const deleteApplication = (id) => {
    try {
      axios
        .delete(`http://localhost:4000/api/v1/application/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplication) =>
            prevApplication.filter((application) => application._id !== id)
          );
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const filteredApplications = applications.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const renderCard = (element) => (
    <Grid item xs={12} sm={6} md={4} key={element._id}>
      <StyledCard>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#333" }}>
            {element.name}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {element.email}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {element.phone}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {element.address}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {element.coverLetter}
          </Typography>
  
          {/* Displaying the job title */}
          {element.jobId && (
            <Typography color="textSecondary" gutterBottom>
              Applied for: {element.jobId.title} {/* This is where the job title is displayed */}
            </Typography>
          )}
  
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <IconButton onClick={() => openModal(element.resume.url)} sx={{ color: "#1976d2" }}>
              <Visibility />
            </IconButton>
            {user && user.role === "Job Seeker" && (
              <IconButton onClick={() => deleteApplication(element._id)} color="error">
                <Delete />
              </IconButton>
            )}
          </Box>
        </CardContent>
      </StyledCard>
    </Grid>
  );
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{  background: "linear-gradient(145deg, #ffffff,rgb(193, 193, 193))",}} mb={4}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: "#1976d2" }}>
          {user && user.role === "Job Seeker"
            ? "My Applications"
            : "Applications From Job Seekers"}
        </Typography>
      </Box>

      <Box mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              placeholder="Search applications..."
              InputProps={{
                startAdornment: <Search sx={{ color: "#1976d2" }} />,
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#1976d2" },
                  "&:hover fieldset": { borderColor: "#1976d2" },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#1976d2" },
                    "&:hover fieldset": { borderColor: "#1976d2" },
                  },
                }}
              >
                <MenuItem value="date">Sort by Date</MenuItem>
                <MenuItem value="name">Sort by Name</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((n) => (
            <Grid item xs={12} sm={6} md={4} key={n}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      ) : sortedApplications.length > 0 ? (
        <Grid container spacing={3}>
          {sortedApplications.map(renderCard)}
        </Grid>
      ) : (
        <EmptyState>
          <img
            src="https://images.unsplash.com/photo-1497005367839-6e852de72767"
            alt="No applications"
          />
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#333" }}>
            No Applications Found
          </Typography>
          <Typography color="textSecondary">
            Start applying to jobs to see your applications here!
          </Typography>
        </EmptyState>
      )}

      <Dialog
        open={modalOpen}
        onClose={closeModal}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
          },
        }}
      >
        <DialogContent>
          <img
            src={resumeImageUrl}
            alt="Resume preview"
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<Download />}
            onClick={closeModal}
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            Download
          </Button>
          <Button onClick={closeModal} sx={{ fontWeight: 600 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyApplications;