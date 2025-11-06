import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// --- Go Back Button ---
export default function GoBack({ href = "/dashboard", label = "Go Back", classes }) {
    return (
        <Link href={href} className={`inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 ${classes}`}>
            <ArrowLeft className="h-4 w-4" />
            <span>{label}</span>
        </Link>
    );
}
