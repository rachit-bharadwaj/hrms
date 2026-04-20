import { Request, Response } from "express";
import { ilike, or } from "drizzle-orm";
import connectDB from "../database/connection";
import { employees, departments, users } from "../database/schema";

export const globalSearch = async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== "string") {
    return res.status(200).json({ status: "success", data: [] });
  }

  const query = `%${q}%`;

  try {
    const db = await connectDB();

    // 1. Search Employees
    const employeeResults = await db
      .select({
        id: employees.id,
        firstName: employees.firstName,
        lastName: employees.lastName,
        employeeCode: employees.employeeCode,
        designation: employees.designation,
        photoUrl: employees.photoUrl,
      })
      .from(employees)
      .where(
        or(
          ilike(employees.firstName, query),
          ilike(employees.lastName, query),
          ilike(employees.employeeCode, query),
          ilike(employees.designation, query),
          ilike(employees.emailOfficial, query)
        )
      )
      .limit(5);

    // 2. Search Departments
    const departmentResults = await db
      .select({
        id: departments.id,
        name: departments.name,
        code: departments.code,
      })
      .from(departments)
      .where(
        or(
          ilike(departments.name, query),
          ilike(departments.code, query)
        )
      )
      .limit(5);

    // 3. Search Users (mostly by email)
    const userResults = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(ilike(users.email, query))
      .limit(5);

    // Combine results
    const results = [
      ...employeeResults.map((e: any) => ({
        type: 'employee',
        id: e.id,
        title: `${e.firstName} ${e.lastName}`,
        subtitle: `${e.designation} (${e.employeeCode})`,
        link: `/employees?search=${e.employeeCode}`,
        image: e.photoUrl
      })),
      ...departmentResults.map((d: any) => ({
        type: 'department',
        id: d.id,
        title: d.name,
        subtitle: `Dept Code: ${d.code}`,
        link: `/departments?search=${d.code}`
      })),
      ...userResults.map((u: any) => ({
        type: 'user',
        id: u.id,
        title: u.email,
        subtitle: 'System User',
        link: `/users?search=${u.email}`
      })),
    ];

    res.status(200).json({ status: "success", data: results });
  } catch (error: any) {
    console.error("Global search error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};
