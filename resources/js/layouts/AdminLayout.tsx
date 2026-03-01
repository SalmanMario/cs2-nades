import AdminNavbarComponent from "@/components/AdminNavbarComponent";
import FooterComponent from "@/components/FooterComponent";

export default function AdminLayout({children} : any) {
    return (
        <div>
            <AdminNavbarComponent/>
            <div className="container mx-auto">
                {children}
            </div>
            <FooterComponent/>
        </div>
    )
}
