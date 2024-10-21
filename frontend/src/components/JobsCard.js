import * as React from "react";
import Card from "@mui/material/Card";
import { Box } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import PinDropIcon from "@mui/icons-material/PinDrop";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {useTheme} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import { toast } from "react-toastify";

export default function JobCard({
  jobTitle,
  company,
  location,
  salary,
  status,
  createdAt,
  id,
  favorite,
}) {
  const [isFavorite, setIsFavorite] = React.useState(favorite);
  const { palette } = useTheme();

  const handleFavoriteClick = async () => {
    try {
      const response = await axios.post(`/api/user/addFavorite/${id}`);
      setIsFavorite(!isFavorite);
      if (!isFavorite) {
        toast.success(`Selected job added to favorites`);
        return;
      }
      toast.error(`Selected job removed from favorites`);
      console.log("Response from backend:", response.data);
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  return (
    <Card sx={{ minWidth: 265, backgroundColor: "#F0F0F0", height: "100%" }}>
      <CardContent>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "-20px",
            position: "relative", // Set position to relative
          }}
        >
          {isFavorite ? (
            <FavoriteIcon
              onClick={handleFavoriteClick}
              style={{
                cursor: "pointer",
                color: "red",
                position: "absolute", // Set position to absolute
                right: "0", // Align to the right
              }}
            />
          ) : (
            <FavoriteBorderIcon
              onClick={handleFavoriteClick}
              style={{
                cursor: "pointer",
                position: "absolute", // Set position to absolute
                right: "0", // Align to the right
              }}
            />
          )}
        </div>
        <Typography variant="h5" component="div" color="D" sx={{ mt: 0.8 }}>
  {jobTitle}
</Typography>
<Typography sx={{ display: "flex", alignItems: "center", mb: 0.5 }} color="text.primary">
  <Box sx={{ marginRight: 1, verticalAlign: 'middle' }}>
    <BusinessIcon fontSize="small" sx={{color: palette.secondary.main}}/>
  </Box>
  {company}
</Typography>
<Typography variant="body2" sx={{ display: "flex", alignItems: "center", color: "#555", mb: 0.5 }}>
  <Box sx={{ marginRight: 1, verticalAlign: 'middle' }}>
    <PinDropIcon fontSize="small"  sx={{color: palette.secondary.main}}/>
  </Box>
  {location}
</Typography>
<Typography variant="body2" sx={{ display: "flex", alignItems: "center", color: "#333", mb: 0.5 }}>
  <Box sx={{ marginRight: 1, verticalAlign: 'middle' }}>
    <CurrencyRupeeIcon fontSize="small"  sx={{color: palette.secondary.main}}/>
  </Box>
  {salary}
</Typography>
<Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
  <Box sx={{ marginRight: 1, verticalAlign: 'middle' }}>
    {status === "Accepted" ? (
      <CheckCircleOutlineIcon fontSize="small" style={{ color: "green" }} />
    ) : status === "Rejected" ? (
      <HighlightOffIcon fontSize="small" style={{ color: "red" }} />
    ) : (
      <HourglassFullIcon fontSize="small" style={{ color: "darkOrange" }} />
    )}
  </Box>
  <span style={{ color: status === "Accepted" ? "green" : status === "Rejected" ? "red" : "darkOrange" }}>
    {status}
  </span>
</Typography>
<Typography variant="body2" sx={{ display: "flex", alignItems: "center", color: "#333" }}>
  <Box sx={{ marginRight: 1, verticalAlign: 'middle' }}>
    <CalendarTodayIcon fontSize="small"  sx={{color: palette.secondary.main}}/>
  </Box>
  Job Applied At: {createdAt.split("T")[0]}
</Typography>

      </CardContent>
    </Card>
  );
}
