"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const UserForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const handlChange = (e: any) => {
    const value = e.target.value;
    const name = e.target.name;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMessage("");
    const res = await fetch("/api/Users", {
      method: "POST",
      body: JSON.stringify({ formData }),
      "content-type": "application/json",
    });

    if (!res.ok) {
      const response = await res.json();
      setErrorMessage(response.message);
    } else {
      router.refresh();
      router.push("/");
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        method="post"
        className="flex flex-col gap-3 w-1/2"
      >
        <h1>Create New User</h1>
        <label>Fullname</label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={handlChange}
          value={formData.name}
          required
          className="m-2 bg-slate-400 rounded"
        />

        <label>Email</label>
        <input
          id="email"
          type="email"
          name="email"
          onChange={handlChange}
          value={formData.email}
          required
          className="m-2 bg-slate-400 rounded"
        />

        <label>Password</label>
        <input
          id="password"
          type="password"
          name="password"
          onChange={handlChange}
          value={formData.password}
          required
          className="m-2 bg-slate-400 rounded"
        />

        <input
          type="submit"
          value={"Create User"}
          className="bg-blue-300 hover:bg-blue-100"
        />
      </form>

      <p className="text-red-400">{errorMessage}</p>
    </>
  );
};

export default UserForm;
