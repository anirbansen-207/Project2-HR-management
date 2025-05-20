"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import { TextField, Button, Box, Typography } from "@mui/material";
import { toast } from "sonner";

const LeaveRequestForm = () => {
  const [employeeName, setEmployeeName] = useState(""); // Manually entered name
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState(""); 
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!employeeName.trim()) {
      toast.error("Employee name is required.");
      setLoading(false);
      return;
    }


    const { error } = await supabase.from("Leave Tracking").insert([
      {
        employee_name: employeeName, 
        start_date: startDate,
        end_date: endDate,
        reason,
      },
    ]);

    setLoading(false);

    if (error) {
      toast.error(`Error: ${error.message}`);
    } else {
      toast.success("Leave request submitted successfully");
      
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 , color:'black'}}>Request Leave</Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Employee Name"
          fullWidth
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          label="Start Date"
          type="date"
          fullWidth
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <TextField
          label="End Date"
          type="date"
          fullWidth
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Reason"
          multiline
          fullWidth
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          {loading ? "Submitting..." : "Submit Leave Request"}
        </Button>

        <Button type="button" variant="contained" color="primary" fullWidth disabled={loading} onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </form>
    </Box>
  );
};

export default LeaveRequestForm;
