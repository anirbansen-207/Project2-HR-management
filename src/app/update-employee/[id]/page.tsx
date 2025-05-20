"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";

export default function UpdateEmployee() {
  const supabase = useMemo(() => createClient(), []);
  const { id } = useParams();

  const [, setEmployee] = useState({
    employee_name: "",
    phone_number: "",
    address: "",
    qualification: "",
    cv_url: "",
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("Employee Details")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Error fetching employee.");
      } else {
        setEmployee(data);
      }
    };

    fetchEmployee();
  }, [id, supabase]);
}
