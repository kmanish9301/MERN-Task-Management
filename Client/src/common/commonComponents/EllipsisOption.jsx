import { useState } from "react";
import {
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const EllipsisOption = ({
    options,
    record,
    value,
    className,
    clickAction = () => { },
    icon,
}) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onMenuItemClick = (option) => {
        handleClose();
        option?.actionFunction(record, value?.row);
    };
    return (
        <div className={className}>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                className={className}
            >
                {icon || <MoreVertIcon />}
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    "aria-labelledby": "long-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                {options?.map((option, index) => (
                    <MenuItem
                        disabled={option?.disabled}
                        key={index}
                        onClick={() => onMenuItemClick(option)}
                        classes={option?.className}
                    >
                        <ListItemIcon
                            sx={{
                                fill: theme.palette.secondary.main,
                                "& :hover": { fill: theme.palette.primary.main },
                            }}
                        >
                            {option?.icon}
                        </ListItemIcon>
                        <ListItemText
                            primaryTypographyProps={{
                                sx: {
                                    ":hover": { color: theme.palette.primary.main },
                                    fontSize: "14px",
                                },
                            }}
                        >
                            {option?.text}
                        </ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

export default EllipsisOption;
