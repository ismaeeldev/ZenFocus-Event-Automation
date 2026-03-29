import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectDB();

    const body = await req.json();

    try {
        const user = await User.create({
            name: body.name,
            email: body.email,
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "User already exists" });
    }
}