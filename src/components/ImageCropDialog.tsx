import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ReactCrop, { Crop } from 'react-image-crop';
import { useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropDialogProps {
    open: boolean;
    image: string;
    onClose: () => void;
    onSave: (croppedImage: Blob) => void;
}

const ImageCropDialog = ({ open, image, onClose, onSave }: ImageCropDialogProps) => {
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 100,
        height: 100,
        x: 0,
        y: 0,
    });
    const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

    const getCroppedImg = () => {
        if (!imageRef) return;

        const canvas = document.createElement('canvas');
        const scaleX = imageRef.naturalWidth / imageRef.width;
        const scaleY = imageRef.naturalHeight / imageRef.height;
        canvas.width = crop.width!;
        canvas.height = crop.height!;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        ctx.drawImage(
            imageRef,
            crop.x! * scaleX,
            crop.y! * scaleY,
            crop.width! * scaleX,
            crop.height! * scaleY,
            0,
            0,
            crop.width!,
            crop.height!
        );

        canvas.toBlob((blob) => {
            if (blob) onSave(blob);
        }, 'image/jpeg', 1);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Crop Image</DialogTitle>
            <DialogContent>
                <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    aspect={1}
                    circularCrop
                >
                    <img
                        src={image}
                        onLoad={(e) => setImageRef(e.currentTarget)}
                        style={{ maxWidth: '100%' }}
                    />
                </ReactCrop>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button 
                    onClick={getCroppedImg}
                    variant="contained"
                    sx={{
                        backgroundColor: "#4CAF50",
                        "&:hover": { backgroundColor: "#45a049" }
                    }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ImageCropDialog;