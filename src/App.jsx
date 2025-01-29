import React, { useState } from 'react';
import { TextField, Switch, FormControlLabel, Typography, Container, Box, Button, CircularProgress } from '@mui/material';
import useApiRequest from './hooks/useApiRequest'; // Import the custom hook

function App() {
  // State to store input field values and switch option
  const [teacherIdentity, setTeacherIdentity] = useState('');
  const [studentIdentity, setStudentIdentity] = useState('');
  const [subject, setSubject] = useState('');
  const [url, setUrl] = useState('https://jupyter.org/try-jupyter/lab/')
  const [isTutorial, setIsTutorial] = useState(true); // true = Tutorial, false = Curriculum
  const [isIframeLoading, setIsIframeLoading] = useState(true); // Track iframe loading status

  // Use the custom hook for API request
  const { isLoading, isGenerated, error, makeApiRequest } = useApiRequest();

  const handleSwitchChange = (event) => {
    setIsTutorial(event.target.checked);
  };

  const handleGenerateClick = async () => {
    // Define data to send to the API
    const data = {
      ...(teacherIdentity !== null && { identity: teacherIdentity }),
      ...(studentIdentity !== null && { target_audience: studentIdentity }),
      ...(subject !== null && { topic: subject })
    };
  
    try {
      // Make API request
      const response = await makeApiRequest(data, isTutorial); 
  
      setUrl(`${url}?fromURL=${response}`);
  
    } catch (error) {
      console.error('Error generating files:', error);
    }
  };
  
  // Add this server-like behavior to serve files
  window.addEventListener('load', () => {
    const path = window.location.pathname;
  
    if (path.startsWith('/local/')) {
      const key = path.split('/local/')[1];
      const fileContent = localStorage.getItem(key);
  
      if (fileContent) {
        document.body.textContent = fileContent;
        document.body.style.whiteSpace = 'pre';
      } else {
        document.body.textContent = 'File not found.';
      }
    }
  });

  const handleFullscreenClick = () => {
    window.open(url, '_blank'); // Opens the URL in a new tab
  };

  const handleIframeLoad = () => {
    setIsIframeLoading(false); // Set iframe loading to false when it finishes loading
  };

  return (
    <Container>
      {/* Show loading animation */}
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay effect
            zIndex: 9999, // Make sure it's on top
          }}
        >
          <CircularProgress size={80} />
        </Box>
      )}

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2, 
        mt: 5, 
        width: { xs: '100%', sm: '50%' }, // Adjust width for sm screen size
        margin: '0 auto' // Center the box
      }}>
        <Typography variant="h3" align="center" color="black">
          JoltEdMod
        </Typography>

        <TextField
          label="Teacher Identity"
          variant="outlined"
          value={teacherIdentity}
          onChange={(e) => setTeacherIdentity(e.target.value)}
          fullWidth
        />

        <TextField
          label="Student Identity"
          variant="outlined"
          value={studentIdentity}
          onChange={(e) => setStudentIdentity(e.target.value)}
          fullWidth
        />

        <TextField
          label="Subject"
          variant="outlined"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          fullWidth
        />
        <Typography variant="body1" sx={{ fontFamily: 'Arial', fontSize: '1.2rem', fontWeight: 'bold' }}>
          Generate:
        </Typography>
        <FormControlLabel
          control={<Switch checked={isTutorial} onChange={handleSwitchChange} disabled />}
          label={isTutorial ? "Tutorial" : "Curriculum"}
        />


        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateClick}
            disabled={isLoading} // Disable until loading is complete
          >
            Generate
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!isGenerated || isLoading} // Disable until Generate is clicked and loading is complete
          >
            Upload
          </Button>
        </Box>
      </Box>

      {/* Webpage Display */}
      <Box sx={{ mt: 4 }}>
        <div style={{ position: 'relative', width: '100%', height: '600px' }}>
          {isIframeLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background
                zIndex: 1,
              }}
            >
              <CircularProgress size={80} />
            </Box>
          )}
          <iframe
            src={url}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            title="Webpage Viewer"
            onLoad={handleIframeLoad} // Trigger the loading state change when the iframe finishes loading
          />
        </div>
      </Box>

      <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleFullscreenClick} 
          sx={{ mt: 2 }}
        >
          Fullscreen
      </Button>
    </Container>
  );
}

export default App;