"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// ✅ Define type for leave request
type LeaveRequest = {
  id: string;
  employee_name: string;
  start_date: string;
  end_date: string;
  reason: string;
};

const LeaveRequestsList = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      const { data, error } = await supabase.from("Leave Tracking").select("*");

      if (error) {
        console.error("Error fetching leave requests:", error);
      } else {
        setLeaveRequests(data || []);
      }
      setLoading(false);
    };

    fetchLeaveRequests();
  }, [supabase]); // ✅ Fixed: added 'supabase' to dependency array

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("Leave Tracking").delete().match({ id });

    if (error) {
      console.error("Error deleting leave request:", error);
      return;
    }
    setLeaveRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        mt: 4,
        p: 3,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, color: "black" }}>
        Leave Requests
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : leaveRequests.length === 0 ? (
        <Typography sx={{ color: "black" }}>No leave requests found.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Employee Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Start Date</strong>
                </TableCell>
                <TableCell>
                  <strong>End Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Reason</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.employee_name}</TableCell>
                  <TableCell>{request.start_date}</TableCell>
                  <TableCell>{request.end_date}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(request.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Button variant="contained" color="primary" onClick={() => router.push("/dashboard")}>
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default LeaveRequestsList;
