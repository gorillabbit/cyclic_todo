import { Typography } from "@mui/material";
import React from "react";

interface BodyTypographyProps {
  visibility?: string;
  text?: React.ReactNode;
  children?: React.ReactNode;
}

export const BodyTypography: React.FC<BodyTypographyProps> = ({
  children,
  visibility,
  text,
  ...props
}) => {
  return (
    <Typography
      //Typographyはデフォルトでは<p>として描画されるが中にdivが入ることができないのでエラーになる
      component="div"
      variant="body2"
      color="text.secondary"
      sx={{ visibility: visibility ?? "visible" }}
      {...props}
    >
      {children}
      {text}
    </Typography>
  );
};
