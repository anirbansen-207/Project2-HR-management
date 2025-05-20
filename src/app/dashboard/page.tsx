"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Drawer,
  List,
  ListItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { logout } from "../logout/actions";

// ✅ Define Employee type
type Employee = {
  id: string;
  employee_name: string;
  phone_number: string;
  address: string;
  qualification: string;
  cv_url?: string;
};

export default function PrivatePage() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndData = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user) {
        redirect("/login");
      }

      const { data: employeesData, error: employeesError } = await supabase
        .from("Employee Details")
        .select("*");

      if (employeesError) {
        console.error("Error fetching employees:", employeesError.message);
      } else {
        setEmployees(employeesData || []);
      }

      setLoading(false);
    };

    fetchUserAndData();
  }, [supabase]); // ✅ Added missing dependency

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("Employee Details")
      .delete()
      .match({ id });

    if (error) {
      console.error("Error deleting employee:", error.message);
      return;
    }
    setEmployees((prevEmployees) =>
      prevEmployees.filter((emp) => emp.id !== id)
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f6f8" }}>
      <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
        <Box
          sx={{
            width: 240,
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
            HR Dashboard
          </Typography>
          <List>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => router.push("/add-employee")}
              >
                Add Employee
              </Button>
            </ListItem>

            <ListItem disablePadding sx={{ mb: 1 }}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => router.push("/leave-request")}
              >
                Leave Request
              </Button>
            </ListItem>

            <ListItem disablePadding>
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={() => router.push("/leave-request-list")}
              >
                Leave Request List
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="static">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">HR Dashboard</Typography>
            <form action={logout}>
              <Button color="inherit" type="submit">
                Logout
              </Button>
            </form>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>
          <Typography variant="h4" sx={{ color: "black" }}>
            Welcome to the HR Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "black" }}>
            Hello, This is Anirban Sen
          </Typography>
          <Typography sx={{ mt: 2, color: "black" }}>
            This is a private page where authenticated users can manage HR
            tasks.
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ color: "black" }}>
              Employee Details:-
            </Typography>
            {employees.length === 0 ? (
              <Typography sx={{ mt: 2, color: "black" }}>
                No employees found.
              </Typography>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>S No</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Phone</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Address</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Qualification</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Download CV</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Actions</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.map((employee, index) => (
                      <TableRow key={employee.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{employee.employee_name}</TableCell>
                        <TableCell>{employee.phone_number}</TableCell>
                        <TableCell>{employee.address}</TableCell>
                        <TableCell>{employee.qualification}</TableCell>
                        <TableCell>
                          {employee.cv_url ? (
                            <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              component="a"
                              href={employee.cv_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Download CV
                            </Button>
                          ) : (
                            <Typography color="error">Not Uploaded</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() =>
                              router.push(`/update-employee/${employee.id}`)
                            }
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(employee.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
