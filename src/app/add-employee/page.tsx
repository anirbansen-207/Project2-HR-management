"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper 
} from "@mui/material";
import { createClient } from "../../../utils/supabase/client";

export default function AddEmployee() {
  const supabase = createClient();
  const router = useRouter();

  const [employee, setEmployee] = useState({
    employee_name: "",
    phone_number: "",
    address: "",
    qualification: "",
  });

  const [cv, setCv] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed!");
        return;
      }

      setCv(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let cvUrl = "";

    if (cv) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("employee-cvs")
        .upload(`cv-${Date.now()}.pdf`, cv);

      if (uploadError) {
        alert("CV upload failed.");
        setLoading(false);
        return;
      }

      cvUrl = supabase.storage.from("employee-cvs").getPublicUrl(uploadData.path).data.publicUrl;
    }

    const { error } = await supabase.from("Employee Details").insert([
      { ...employee, cv_url: cvUrl }
    ]);

    setLoading(false);

    if (error) {
      alert("Failed to add employee.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h5">Add Employee</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Employee Name" name="employee_name" value={employee.employee_name} onChange={handleChange} fullWidth required margin="normal" />
          <TextField label="Phone Number" name="phone_number" value={employee.phone_number} onChange={handleChange} fullWidth required margin="normal" />
          <TextField label="Address" name="address" value={employee.address} onChange={handleChange} fullWidth required margin="normal" />
          <TextField label="Qualification" name="qualification" value={employee.qualification} onChange={handleChange} fullWidth required margin="normal" />
          
          <input type="file" accept="application/pdf" onChange={handleFileChange} />

          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? "Adding..." : "Add Employee"}
          </Button>

          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </form>
      </Paper>
    </Container>
    
  );
}
