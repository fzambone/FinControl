import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, MenuItem, Select, Typography} from "@mui/material";

interface FileUploadFormProps {
    onFileUpload: (file: File) => void;
}

export const FileUploadForm: React.FC<FileUploadFormProps> = ({ onFileUpload }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [templates, setTemplates] = useState([{ id: '1', name: 'Template 1'}, { id: '2', name: 'Template 2' }]);
    const [selectedTemplateId, setSelectedTemplateId] = useState('');

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        //TODO: Implement API call to fetch available upload templates
        setTemplates([{ id: '1', name: 'Template 1'}, { id: '2', name: 'Template 2' }]);
        // setSelectedTemplateId('1');
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setUploadSuccess(false);
            setUploadError("");
        }
    };

    const handleUpload = async () => {
        if (selectedFile) {
            setIsUploading(true);
            setUploadError("");
            try {
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('templateId', selectedTemplateId);
                //TODO: Make API call
                setUploadSuccess(true);
            } catch (error) {
                setUploadError("Failed to upload file. Please try again.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <Typography variant={"h6"} component={"h2"}>
                Upload Statement
            </Typography>
            <Typography variant={"body1"}>Select the Template for your Statement:</Typography>
            <Select
                fullWidth
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
            >
                <MenuItem value={""} disabled>
                    Choose a template
                </MenuItem>
                {templates.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                        {template.name}
                    </MenuItem>
                ))}
            </Select>
            <Typography variant={"body2"} sx={{ mb: 2 }}>
                Please select a .xlsx, .xls or .csv file containing your financial statement. Ensure the file is not larger than 5MB.
            </Typography>
            {selectedFile && (
                <Typography variant={"subtitle1"} sx={{ mb: 2 }}>
                    Selected file: {selectedFile.name}
                </Typography>
            )}
            {isUploading && (
                <CircularProgress />
            )}
            {uploadSuccess && (
                <Typography variant={"subtitle1"} color={"primary"} sx={{ mb: 2 }}>
                    File uploaded successfully!
                </Typography>
            )}
            {uploadError && (
                <Typography variant={"subtitle1"} color={"error"} sx={{ mb: 2 }}>
                    Error: {uploadError}
                </Typography>
            )}
            <Button
                variant={"contained"}
                component={"label"}
                disabled={isUploading}
            >
                Select File
                <input
                    type={"file"}
                    hidden
                    accept={".xlsx, .xls, .csv"}
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
            </Button>
            {selectedFile && (
                <Button
                    variant={"contained"}
                    onClick={handleUpload}
                    disabled={isUploading}
                >
                    Upload File
                </Button>
            )}
        </Box>
    );
};