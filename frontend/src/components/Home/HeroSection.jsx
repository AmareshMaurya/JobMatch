import React, { useState, useEffect, useRef } from "react"; // Added useRef import
import { Box, Container, Typography, Grid, Card, CardContent, Button, useTheme, useMediaQuery, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaUsers, FaBriefcase, FaHandshake, FaChartLine, FaSearch, FaRocket, FaCertificate } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BlurredBackground = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, rgba(70, 156, 193, 0.53) 0%, rgba(49, 164, 206, 0.41) 100%), url("bg1.webp")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  padding: theme.spacing(8, 0),
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 12px 24px rgba(0, 115, 255, 0.3)",
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  height: "100%",
  "&:hover": {
    transform: "scale(1.05)",
    background: "rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 20px rgba(0, 115, 255, 0.2)",
  },
}));

const ImageSlider = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "400px",
  width: "100%",
  overflow: "hidden",
  borderRadius: theme.spacing(2),
}));

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentImage, setCurrentImage] = useState(0);

  // Reference for scrolling
  const howItWorksRef = useRef(null);

  const scrollToHowItWorks = () => {
    if (howItWorksRef.current) {
      howItWorksRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stats = [
    { icon: <FaUsers />, count: "100K+", label: "Active Users" },
    { icon: <FaBriefcase />, count: "50K+", label: "Job Postings" },
    { icon: <FaHandshake />, count: "75K+", label: "Successful Matches" },
    { icon: <FaChartLine />, count: "95%", label: "Success Rate" },
    { icon: <FaSearch />, count: "24/7", label: "Support" },
    { icon: <FaRocket />, count: "10K+", label: "Companies" },
  ];

  const features = [
    {
      icon: <FaSearch />,
      title: "Smart Job Matching",
      description: "AI-powered algorithm to match your skills with the perfect job opportunities",
    },
    {
      icon: <FaCertificate />,
      title: "Verified Employers",
      description: "All employers are thoroughly vetted to ensure legitimate opportunities",
    },
    {
      icon: <FaRocket />,
      title: "Career Growth",
      description: "Access to career development resources and professional networking",
    },
  ];

  const images = ["register.jpg", "slide.png", "slide1.png", "slide2.png", "background.webp"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // Reduced interval for faster transitions
    return () => clearInterval(timer);
  }, []);

  return (
    <BlurredBackground>
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: "2.5rem", md: "4rem" },
                  fontWeight: 700,
                  mb: 2,
                  background: "linear-gradient(45deg,rgb(0, 54, 112) 30%,rgb(0, 79, 236) 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Find Your Perfect Job Match
              </Typography>
              <Typography variant="h5" sx={{ color: "rgba(255, 255, 255, 0.9)", mb: 4 }}>
                Connect with top employers and discover opportunities that align with your skills and aspirations
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  background: "linear-gradient(45deg,rgb(0, 153, 255) 30%,rgb(0, 115, 255) 90%)",
                  color: "white",
                  px: 4,
                  py: 2,
                  borderRadius: "30px",
                  "&:hover": {
                    background: "linear-gradient(45deg,rgb(0, 115, 255) 30%,rgb(0, 153, 255) 90%)",
                  },
                }}
                onClick={scrollToHowItWorks} // Add click handler
              >
                Get Started Now
              </Button>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <ImageSlider>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={images[currentImage]}
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </AnimatePresence>
            </ImageSlider>
          </Grid>

          {/* Why Choose Us Section */}
          <Grid item xs={12}>
            <Box sx={{ mt: 12 }} ref={howItWorksRef}>
              <Typography
                variant="h2"
                component="h2"
                align="center"
                sx={{
                  color: "white",
                  mb: 6,
                  fontSize: { xs: "2rem", md: "3rem" },
                  fontWeight: 600,
                  background: "linear-gradient(45deg, rgb(0, 115, 255), rgb(0, 153, 255))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Why Choose Us?
              </Typography>
              <Grid container spacing={4}>
                {features.map((feature, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <FeatureCard>
                        <CardContent sx={{ textAlign: "center", color: "white", p: 4 }}>
                          <IconButton
                            sx={{
                              fontSize: "3rem",
                              color: "black",
                              mb: 2,
                              background: "rgba(125, 120, 120, 0.1)",
                              p: 2,
                            }}
                          >
                            {feature.icon}
                          </IconButton>
                          <Typography
                            variant="h5"
                            component="h3"
                            sx={{
                              mb: 2,
                              background: "linear-gradient(45deg, rgb(6, 64, 135), rgb(0, 153, 255))",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography variant="body1" color="black">{feature.description}</Typography>
                        </CardContent>
                      </FeatureCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Stats Section */}
            <Grid item xs={12} sx={{ mt: 12 }}>
              <Grid container spacing={3} justifyContent="center">
                {stats.map((stat, index) => (
                  <Grid item xs={6} md={2} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <StyledCard>
                        <CardContent sx={{ textAlign: "center", color: "white" }}>
                          <IconButton
                            sx={{
                              fontSize: "2rem",
                              color: "black",
                              mb: 2,
                            }}
                          >
                            {stat.icon}
                          </IconButton>
                          <Typography
                            variant="h4"
                            component="div"
                            sx={{
                              mb: 1,
                              background: "linear-gradient(45deg, rgba(0, 115, 255, 0.7), rgba(0, 153, 255, 0.7))",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {stat.count}
                          </Typography>
                          <Typography variant="body1" color="black">{stat.label}</Typography>
                        </CardContent>
                      </StyledCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </BlurredBackground>
  );
};

export default HeroSection;
