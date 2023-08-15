import Image from "next/image";
import { Montserrat } from "next/font/google";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Divider from "@mui/material/Divider";

interface DataTableProps {
  title: string;
  tableData: {
    columns: string[];
    data: (string | number)[][];
  };
  titleImage?: string;
}

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

export default function DataTable({
  title,
  tableData,
  titleImage,
}: DataTableProps) {
  return (
    <TableContainer
      className="resultsFlexBoxMember"
      component={Paper}
      sx={{
        minWidth: "400px",
        maxWidth: "600px",
        width: "80%",
        marginBottom: "3.5%",
        borderRadius: "20px",
      }}
      elevation={20}
    >
      <div
        className={montserrat.className}
        style={{
          textAlign: "center",
        }}
      >
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {titleImage && (
            <Image
              src={titleImage}
              alt=""
              width={45}
              height={45}
              style={{ marginRight: 10 }}
            />
          )}
          {title}
        </h2>
      </div>
      <Divider />

      <Table sx={{ minWidth: "400px" }}>
        <TableHead>
          <TableRow>
            {tableData.columns.map((colName) => (
              <TableCell
                align="center"
                className={montserrat.className}
                key={colName}
              >
                <h3>{colName}</h3>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.data.map((row, idx) => (
            <TableRow key={idx}>
              {row.map((data) => (
                <TableCell align="center" key={data}>
                  {data}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
