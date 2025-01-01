"use client";

import React, { useState } from "react";

const Page = () => {
  const [studentId, setStudentId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [studentInfo, setStudentInfo] = useState(null);
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#7378f7"); // Default primary color

  const semesterOptions = [
    { label: "Fall-2024", value: "243" },
    { label: "Summer-2024", value: "242" },
    { label: "Spring-2024", value: "241" },
    { label: "Fall-2023", value: "233" },
    { label: "Summer-2023", value: "232" },
    { label: "Spring-2023", value: "231" },
  ];

  const fetchResults = async () => {
    if (!studentId || !semesterId) {
      setError("Both Student ID and Semester ID are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const studentInfoRes = await fetch(
        `http://software.diu.edu.bd:8006/result/studentInfo?studentId=${studentId}`
      );
      if (!studentInfoRes.ok) {
        throw new Error(`Error fetching student info: ${studentInfoRes.status}`);
      }
      const studentInfoData = await studentInfoRes.json();
      setStudentInfo(studentInfoData);

      const resultRes = await fetch(
        `http://software.diu.edu.bd:8189/result?studentId=${studentId}&semesterId=${semesterId}`
      );
      if (!resultRes.ok) {
        throw new Error(`Error fetching results: ${resultRes.status}`);
      }
      const resultData = await resultRes.json();
      setResult(resultData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const calculateCGPA = () => {
    if (result.length === 0) return 0;

    let totalCredits = 0;
    let weightedPoints = 0;

    result.forEach((course) => {
      const credit = parseFloat(course?.totalCredit || 0);
      const gradePoint = parseFloat(course?.pointEquivalent || 0);

      totalCredits += credit;
      weightedPoints += credit * gradePoint;
    });

    return totalCredits > 0 ? (weightedPoints / totalCredits).toFixed(2) : 0;
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center">
      <div
        className="max-w-5xl w-full bg-white rounded-lg p-6"
        // Removed the box-shadow styling here
      >
        {/* Color Picker Section */}
        <div className="absolute top-6 right-6">
          <label className="text-lg font-semibold text-gray-800">Primary Color:</label>
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="ml-2 border-2 border-gray-300 rounded-md"
          />
        </div>

        <h1
          className="text-3xl font-bold text-center mb-6"
          style={{ color: primaryColor }}
        >
          Student Results Portal
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter Student ID"
            className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <select
            className="select select-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2"
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
          >
            <option value="">Select Semester</option>
            {semesterOptions.map((semester) => (
              <option key={semester.value} value={semester.value}>
                {semester.label}
              </option>
            ))}
          </select>
        </div>
        <button
          className="btn w-full text-white px-4 py-2 rounded-md hover:bg-[#5cb3e5] disabled:bg-gray-400"
          style={{ backgroundColor: primaryColor }}
          onClick={fetchResults}
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Results"}
        </button>
        {error && <div className="text-red-500 mt-4">{error}</div>}

        {studentInfo && (
          <div
            className="mt-6 p-4 bg-[#f0f9ff] border-l-4"
            style={{ borderColor: primaryColor }}
          >
            <h2
              className="text-xl font-semibold"
              style={{ color: primaryColor }}
              mb-4
            >
              Student Information
            </h2>
            <ul className="text-gray-700 space-y-2">
              <li>
                <strong>Name:</strong> {studentInfo.studentName}
              </li>
              <li>
                <strong>Student ID:</strong> {studentInfo.studentId}
              </li>
              <li>
                <strong>Program:</strong> {studentInfo.programName} (
                {studentInfo.progShortName})
              </li>
              <li>
                <strong>Department:</strong> {studentInfo.departmentName} (
                {studentInfo.deptShortName})
              </li>
              <li>
                <strong>Batch:</strong> {studentInfo.batchId} (
                Batch {studentInfo.batchNo})
              </li>
              <li>
                <strong>Shift:</strong> {studentInfo.shift}
              </li>
              <li>
                <strong>Campus:</strong> {studentInfo.campusName}
              </li>
            </ul>
          </div>
        )}

        <div className="mt-6">
          {result.length > 0 ? (
            <div className="overflow-x-auto">
              <h2
                className="text-xl font-semibold"
                style={{ color: primaryColor }}
                mb-4
              >
                Semester Results
              </h2>
              <table className="table-auto w-full border-collapse bg-white">
                <thead
                  className="bg-[#72ccf6]"
                  style={{ backgroundColor: primaryColor }}
                >
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Course Code</th>
                    <th className="px-4 py-2">Course Title</th>
                    <th className="px-4 py-2">Credit</th>
                    <th className="px-4 py-2">Grade</th>
                    <th className="px-4 py-2">Grade Point</th>
                  </tr>
                </thead>
                <tbody>
                  {result.map((sub, idx) => (
                    <tr
                      key={sub?.courseId}
                      className={`text-center ${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      }`}
                    >
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2">{sub?.customCourseId}</td>
                      <td className="px-4 py-2">{sub?.courseTitle}</td>
                      <td className="px-4 py-2">{sub?.totalCredit}</td>
                      <td className="px-4 py-2">{sub?.gradeLetter}</td>
                      <td className="px-4 py-2">{sub?.pointEquivalent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* CGPA Display */}
              <div
                className="mt-4 p-4 bg-[#f0f9ff] border-l-4"
                style={{ borderColor: primaryColor }}
              >
                <h3
                  className="text-lg font-semibold text-right"
                  style={{ color: primaryColor }}
                >
                  Calculated CGPA:{" "}
                  <span className="font-black" style={{ color: primaryColor }}>{calculateCGPA()}</span>
                </h3>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600 mt-4">
              {loading ? "Fetching results..." : "No results found"}
            </div>
          )}
        </div>

        {/* Copyright Section */}
        <div className="text-center text-sm text-gray-600 mt-10">
          <p>© {new Date().getFullYear()} Created by Md. Rakib Hassan</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
