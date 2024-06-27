import { TableCell } from "@mui/material";
import { CSSProperties, ReactNode } from "react";

const TableCellWrapper = (props: {
  children?: ReactNode;
  label?: string | number;
  colSpan?: number;
  align?: "left" | "center" | "right";
  sx?: CSSProperties;
}) => {
  return (
    <TableCell
      sx={{ px: 0.5, ...props.sx }}
      colSpan={props.colSpan}
      align={props.align}
    >
      {props.children}
      {props.label}
    </TableCell>
  );
};

export default TableCellWrapper;
