'use client'
import React from "react";
import HomePage from "@/app/ui/HomePage";
import { useState } from "react";

export default function Homepage() {

    const [activeItem, setActiveItem] = useState('');

    return <HomePage activeItem={activeItem} setActiveItem={setActiveItem}></HomePage>
}