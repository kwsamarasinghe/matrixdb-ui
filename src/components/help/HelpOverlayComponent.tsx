// HelpOverlayPanel.tsx
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface HelpOverlayPanelProps {
    open: boolean;
    onClose: () => void;
}

const HelpOverlayPanel: React.FC<HelpOverlayPanelProps> = ({ open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                style: {
                    height: '75vh',
                },
            }}
        >
            <DialogTitle>
                Overlay Panel
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'grey',
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {/* Add your content here */}
                This is the content of the overlay panel.
            </DialogContent>
        </Dialog>
    );
};

export default HelpOverlayPanel;
