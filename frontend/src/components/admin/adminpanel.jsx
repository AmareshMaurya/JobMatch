import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/AccountBox';
import MailIcon from '@mui/icons-material/WorkHistory';
import OpenInNewIcon from '@mui/icons-material/OpenInNew'; // Import OpenInNew icon
import jobmatchname from './adminpanel.png'; // Import logo image
import axios from 'axios'; // Import axios for API calls
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirecting
import LogoutIcon from '@mui/icons-material/Logout'; // Import logout icon
import DeleteIcon from '@mui/icons-material/Delete'; // Import delete icon
import { Button, TextField } from '@mui/material'; // Import components for adding users

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    background: "linear-gradient(to left, #E4F3E3, #5CA9E9)",  // Apply gradient here
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': {
            ...openedMixin(theme),
            background: "linear-gradient(to left, #E4F3E3, #5CA9E9)", // Apply gradient to the paper as well
          },
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': {
            ...closedMixin(theme),
            background: "linear-gradient(to left, #E4F3E3, #5CA9E9)", // Apply gradient to the paper when closed
          },
        },
      },
    ],
  })
);


export default function MiniDrawer() {
  const theme = useTheme();
  const navigate = useNavigate(); // Use navigate for redirection
  const [open, setOpen] = React.useState(false);
  const [selectedPage, setSelectedPage] = React.useState(null); // For tracking selected page
  const [users, setUsers] = React.useState([]);
  const [jobs, setJobs] = React.useState([]);
  const [applications, setApplications] = React.useState([]);
  
  // Add User Form fields
  const [newUser, setNewUser] = React.useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: ''
  });
  const handleDeleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.delete(
        `http://localhost:4000/api/v1/job/delete/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Job deleted successfully!');
      fetchJobs(); // Refresh job list
    } catch (error) {
      console.error('Error deleting job', error);
      alert('An error occurred while deleting the job.');
    }
  };

  // Handle drawer opening and closing
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Fetch Users data
  const fetchUsers = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await axios.get('http://localhost:4000/api/v1/user/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users", error);
      alert("An error occurred while fetching the users.");
    }
  };

  // Fetch Jobs data
const fetchJobs = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.get('http://localhost:4000/api/v1/job/getall');
    setJobs(response.data.jobs);
  } catch (error) {
    console.error("Error fetching jobs", error);
    alert("An error occurred while fetching the jobs.");
  }
};


  // Fetch Applications data
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get('http://localhost:4000/api/v1/admin/applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(response.data.applications);
    } catch (error) {
      console.error("Error fetching applications", error);
    }
  };

  // Handle page changes and fetch relevant data
  const handlePageChange = (page) => {
    setSelectedPage(page);
    if (page === 'Users') {
      fetchUsers();
    } else if (page === 'Jobs') {
      fetchJobs();
    } else if (page === 'Applications') {
      fetchApplications();
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  // Add new user
  const handleAddUser = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await axios.post('http://localhost:4000/api/v1/user/register', newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User added successfully!');
      fetchUsers(); // Refresh the users list
      setNewUser({ name: '', email: '', phone: '', password: '', role: '' }); // Reset form
    } catch (error) {
      console.error("Error adding user", error);
      alert("An error occurred while adding the user.");
    }
  };
  

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      console.log("Attempting to delete user with ID:", userId);
  
      // Use adminToken, not authToken
      const token = localStorage.getItem('adminToken'); 
  
      // Send DELETE request to backend
      const response = await axios.delete(
        `http://localhost:4000/api/v1/user/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token in the header
          },
        }
      );
  
      if (response.status === 200) {
        console.log("User deleted successfully:", response.data);
        alert("User deleted successfully!");
        fetchUsers(); // Refresh the users list after deletion
      }
    } catch (error) {
      // Handle error
      if (error.response) {
        if (error.response.status === 404) {
          console.error("Error: User not found", error.response);
          alert("User not found!");
        } else if (error.response.status === 403) {
          console.error("Error: Unauthorized action", error.response);
          alert("You are not authorized to perform this action.");
        } else {
          console.error("Error deleting user:", error.response);
          alert("An error occurred while deleting the user.");
        }
      } else {
        // If no response was received (e.g., network error)
        console.error("Network error or server is down:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };
  

  
  // Redirect to login if token is not found
  React.useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return (
    <Box sx={{ display: 'flex' ,background: "linear-gradient(to right, #E4F3E3, #5CA9E9)", }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ background: '#FDC360' }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start" sx={[{ marginRight: 5 }, open && { display: 'none' }]}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Panel
          </Typography>
          <IconButton color="inherit" onClick={handleLogout} sx={{ marginLeft: 'auto' }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open} >
        <DrawerHeader sx={{background: "linear-gradient(to left, #E4F3E3, #5CA9E9)" }}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          {open && (
            <Box sx={{ padding: 1, display: 'flex', justifyContent: 'center' }}>
              <img src={jobmatchname} alt="Admin Logo" style={{ width: '180px' }} />
            </Box>
          )}
        </DrawerHeader>

        <Divider />
        <List sx={{background: "linear-gradient(to left, #E4F3E3, #5CA9E9)", }}>
          {['Users', 'Jobs', 'Applications'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton sx={[{ minHeight: 48, px: 2.5 }, open ? { justifyContent: 'initial' } : { justifyContent: 'center' }]} onClick={() => handlePageChange(text)}>
                <ListItemIcon sx={[{ minWidth: 0, justifyContent: 'center' }, open ? { mr: 3 } : { mr: 'auto' }]}>
                  {text === 'Users' ? <InboxIcon /> : text === 'Jobs' ? <MailIcon /> : <OpenInNewIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 , background: "linear-gradient(to right, #E4F3E3, #5CA9E9)"}} >
        <DrawerHeader sx={{ background: "linear-gradient(to right, #E4F3E3, #5CA9E9)" }} />

        {/* Add User Form */}
        {selectedPage === 'Users' && (
          <Box>
  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
    All Users
  </Typography>

  {/* Add User Form */}
  <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
    <TextField
      label="Name"
      value={newUser.name}
      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      fullWidth
      variant="outlined"
      sx={{
        borderRadius: '8px',
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: 'black' },
          '&:hover fieldset': { borderColor: 'red' },
        },
      }}
    />
    <TextField
      label="Email"
      value={newUser.email}
      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      fullWidth
      variant="outlined"
      sx={{
        borderRadius: '8px',
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: 'black' },
          '&:hover fieldset': { borderColor: 'red' },
        },
      }}
    />
    <TextField
      label="Phone"
      value={newUser.phone}
      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
      fullWidth
      variant="outlined"
      sx={{
        borderRadius: '8px',
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: 'black' },
          '&:hover fieldset': { borderColor: 'red' },
        },
      }}
    />
    <TextField
      label="Password"
      value={newUser.password}
      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      type="password"
      fullWidth
      variant="outlined"
      sx={{
        borderRadius: '8px',
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: 'black' },
          '&:hover fieldset': { borderColor: 'red' },
        },
      }}
    />
    <TextField
      label="Role"
      value={newUser.role}
      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
      fullWidth
      variant="outlined"
      sx={{
        borderRadius: '8px',
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: 'black' },
          '&:hover fieldset': { borderColor: 'red' },
        },
      }}
    />

<Button
  variant="contained"
  color="primary"
  sx={{
    gridColumn: 'span 2',
    backgroundColor: '#FDC360',
    '&:hover': { backgroundColor: '#5CA9E9' },
    fontWeight: 'bold', 
    borderColor: 'blue' // Define your border color here
  }}
  onClick={handleAddUser}
>
  Add User
</Button>

  </Box>

  {/* User Table */}
  <Box sx={{ mt: 4 }}>
    <Box sx={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: '#5CA9E9',
              color: 'white',
              textAlign: 'left',
              fontWeight: 'bold',
            }}
          >
            <th style={{ padding: '12px' }}>Name</th>
            <th style={{ padding: '12px' }}>Email</th>
            <th style={{ padding: '12px' }}>Phone</th>
            <th style={{ padding: '12px' }}>Role</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user._id}
              style={{
                backgroundColor: index % 2 === 0 ? '#F5F5F5' : 'white',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#e3f2fd')}
              
            >
              <td style={{ padding: '12px' }}>{user.name}</td>
              <td style={{ padding: '12px' }}>{user.email}</td>
              <td style={{ padding: '12px' }}>{user.phone}</td>
              <td style={{ padding: '12px' }}>{user.role}</td>
              <td style={{ padding: '12px' }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteUser(user._id)}
                  startIcon={<DeleteIcon sx={{color:'skyblue'}} />}
                  sx={{
                    backgroundColor: '#F44336',
                    color: 'skyblue',
                    fontWeight: 'bold',
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  </Box>
</Box>


        )}


{selectedPage === 'Jobs' && (
  <Box>
    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
      All Jobs
    </Typography>

    {/* Job Table */}
    <Box sx={{ mt: 4 }}>
      <Box sx={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: '#5CA9E9',
                color: 'white',
                textAlign: 'left',
                fontWeight: 'bold',
              }}
            >
              <th style={{ padding: '12px' }}>Title</th>
              <th style={{ padding: '12px' }}>Category</th>
              <th style={{ padding: '12px' }}>Country</th>
              <th style={{ padding: '12px' }}>City</th>
              <th style={{ padding: '12px' }}>Location</th>
              <th style={{ padding: '12px' }}>Salary From</th>
              <th style={{ padding: '12px' }}>Salary To</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr
                key={job._id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#F5F5F5' : 'white',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#e3f2fd')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = index % 2 === 0 ? '#F5F5F5' : 'white')}
              >
                <td style={{ padding: '12px' }}>{job.title}</td>
                <td style={{ padding: '12px' }}>{job.category}</td>
                <td style={{ padding: '12px' }}>{job.country}</td>
                <td style={{ padding: '12px' }}>{job.city}</td>
                <td style={{ padding: '12px' }}>{job.location}</td>
                <td style={{ padding: '12px' }}>{job.salaryFrom}</td>
                <td style={{ padding: '12px' }}>{job.salaryTo}</td>
                <td style={{ padding: '12px' }}>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{
                      backgroundColor: '#F44336',
                      color: 'white',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: '#D32F2F',
                      },
                    }}
                    onClick={() => handleDeleteJob(job._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  </Box>
)}
      </Box>
    </Box>
  );
}
