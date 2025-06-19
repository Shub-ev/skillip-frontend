import { Container, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Typography, useTheme, useMediaQuery, Snackbar } from "@mui/material";
import { useState, ChangeEvent, useContext } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import ImageCropDialog from '../components/ImageCropDialog';
import MyContext from "../context/context";

interface FormData {
  username: string;
  phone: string;
  skills: string[];
  image: File | null;
}

const GetHiredForm = () => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const [ open, setOpen ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ success, setSuccess ] = useState(false);
    const { updateProfileImage } = useContext(MyContext)!;

    const [formData, setFormData] = useState<FormData>({
        username: "",
        phone: "",
        skills: [],
        image: null
    });

    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');

    const skills = [
        "JavaScript",
        "Python", 
        "Java",
        "React",
        "Node.js",
        "SQL",
        "HTML/CSS",
        "TypeScript",
        "AWS",
        "Docker"
    ];

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImageUrl(imageUrl);
            setCropDialogOpen(true);
        }
    };

    const handleSkillsChange = (e: SelectChangeEvent<string[]>) => {
        setFormData(prev => ({
            ...prev,
            skills: e.target.value as string[]
        }));
    };

    const handleImageUpload = async () => {
        if (formData.image) {
            await updateProfileImage(formData.image);
            setFormData(prev => ({
                ...prev,
                image: null
            }));
        }
        setCropDialogOpen(false);
        setOpen(true);
        setSuccess(true);
    };

    const handleCropSave = (croppedBlob: Blob) => {
        const file = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' });
        setFormData(prev => ({
            ...prev,
            image: file
        }));
        setCropDialogOpen(false);
        URL.revokeObjectURL(selectedImageUrl);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography 
                variant="h3" 
                sx={{ 
                    mb: 6, 
                    fontWeight: 600,
                    textAlign: 'center',
                    color: '#1a237e'
                }}
            >
                Professional Profile
            </Typography>
            
            <Box 
                component="form" 
                sx={{ 
                    display: 'flex',
                    flexDirection: isDesktop ? 'row' : 'column',
                    gap: 6,
                    backgroundColor: '#ffffff',
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    padding: 4,
                    '& > div': {
                        flex: isDesktop ? 1 : 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4
                    }
                }}
            >
                <Box>
                    <TextField 
                        label="Username"
                        variant="outlined"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#1a237e',
                                },
                            },
                        }}
                    />

                    <TextField 
                        label="Phone Number"
                        variant="outlined"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#1a237e',
                                },
                            },
                        }}
                    />

                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 2,
                        backgroundColor: '#f5f5f5',
                        padding: 3,
                        borderRadius: 2
                    }}>
                        <Typography variant="h6" sx={{ mb: 1, color: '#1a237e' }}>
                            Profile Picture
                        </Typography>
                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                backgroundColor: "#1E90FF",
                                "&:hover": { backgroundColor: "#007BFF" },
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            Select Image
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>
                        {formData.image && (
                            <>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                    Selected file: {formData.image.name}
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={handleImageUpload}
                                    sx={{
                                        backgroundColor: "#4CAF50",
                                        "&:hover": { backgroundColor: "#45a049" },
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Upload Image
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>

                <Box>
                    <FormControl fullWidth>
                        <InputLabel sx={{ color: '#666' }}>Technical Skills</InputLabel>
                        <Select
                            multiple
                            value={formData.skills}
                            onChange={handleSkillsChange}
                            label="Skills"
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    '&:hover': {
                                        borderColor: '#1a237e',
                                    },
                                },
                            }}
                        >
                            {skills.map((skill) => (
                                <MenuItem key={skill} value={skill}>
                                    {skill}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button 
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: "#FFD700",
                            color: "#000",
                            "&:hover": { backgroundColor: "#FFC107" },
                            mt: 4,
                            py: 1.5,
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 600
                        }}
                    >
                        Submit Profile
                    </Button>
                </Box>
            </Box>
            <ImageCropDialog
                open={cropDialogOpen}
                image={selectedImageUrl}
                onClose={() => {
                    setCropDialogOpen(false);
                    URL.revokeObjectURL(selectedImageUrl);
                }}
                onSave={handleCropSave}
            />
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={()=> setOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Box sx={{ backgroundColor: error ? "#f44336" : "#4CAF50", color: "#fff", padding: 2, borderRadius: 1 }}>
                    {error ? error : "Profile updated successfully!"}
                </Box>
            </Snackbar>
        </Container>
    );
};

export default GetHiredForm;