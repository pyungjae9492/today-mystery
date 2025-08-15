import React from "react"
import "@/app/globals.css"

export default function ToadyLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className="min-h-svh bg-black text-white">
			{children}
		</section>
	)
} 