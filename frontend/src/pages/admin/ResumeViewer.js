import React from "react";
import { Dialog, DialogContent, DialogActions, Button,DialogTitle ,IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const ResumeViewer = ({ fileUrl, onClose }) => {
  return (
    <Dialog open={!!fileUrl} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>

          <IconButton
            edge="end"
            color="error"
            onClick={onClose}
            aria-label="close"
            sx={{
              position: "absolute",
              right: "8px",
              top: "0.3px",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      <DialogContent>
        {fileUrl && <iframe src={fileUrl} title="Resume" width="100%" height="800" />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResumeViewer;
