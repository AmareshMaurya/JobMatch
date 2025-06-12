import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Skeleton,
  Alert,
  Stack,
  styled,
} from "@mui/material";
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Schedule as TimeIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 8,
  color: "#555",
}));

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Job not found");
        setIsLoading(false);
        navigateTo("/notfound");
      });
  }, [id]);

  if (!isAuthorized) {
    navigateTo("/login");
  }

  if (isLoading) {
    return (
      <Box sx={{ padding: 3 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
        <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} count={3} sx={{ mb: 1 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ margin: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: 1200, margin: "0 auto" }}>
      <StyledCard>
        <CardContent sx={{ padding: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" sx={{ mb: 2, color: "#1a237e", fontWeight: "bold" }}>
                {job.title}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                <Chip label={job.category} color="primary" />
                <Chip label="Urgent" color="error" />
              </Stack>

              <IconWrapper>
                <WorkIcon fontSize="small" />
                <Typography>{job.company}</Typography>
              </IconWrapper>

              <IconWrapper>
                <LocationIcon fontSize="small" />
                <Typography>
                  {job.city}, {job.country}
                </Typography>
              </IconWrapper>

              <IconWrapper>
                <MoneyIcon fontSize="small" />
                <Typography>
                  {job.fixedSalary
                    ? `₹${job.fixedSalary}`
                    : `₹${job.salaryFrom} - ₹${job.salaryTo}`}
                </Typography>
              </IconWrapper>

              <IconWrapper>
                <TimeIcon fontSize="small" />
                <Typography>Posted on: {new Date(job.jobPostedOn).toLocaleDateString()}</Typography>
              </IconWrapper>

              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Job Description
              </Typography>
              <Typography sx={{ mb: 3 }}>{job.description}</Typography>

              <Typography variant="h6" sx={{ mb: 2 }}>
                Location
              </Typography>
              <Typography sx={{ mb: 3 }}>{job.location}</Typography>

              {user && user.role !== "Employer" && (
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    padding: "12px 32px",
                    background: "linear-gradient(45deg, #1a237e 30%, #283593 90%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #283593 30%, #1a237e 90%)",
                    },
                  }}
                  component={Link}
                  to={`/application/${job._id}`}
                >
                  Apply Now
                </Button>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, mb: 3 }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=1470&q=80"
                  alt="Company Logo"
                  sx={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 1,
                    mb: 2,
                  }}
                />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  About {job.company}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  A leading company in the industry, dedicated to innovation and excellence.
                </Typography>
              </Card>

              <Card sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Quick Apply
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<PersonIcon />}
                  sx={{ mb: 2 }}
                  component={Link}
                  to={`/application/${job._id}`}
                >
                  Upload Resume
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Easy apply with your existing resume
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default JobDetails;
