import { Outlet } from "react-router-dom";
import { Header } from "../Header/Header";
import { Menu } from "../Menu/Menu";
import "./Layout.css";

export function Layout() {
    return (
        <div className="Layout">

			<header>
                <Header />
            </header>

            <nav>
                <Menu />
            </nav>

            <main>
                <Outlet />
            </main>

        </div>
    );
}
