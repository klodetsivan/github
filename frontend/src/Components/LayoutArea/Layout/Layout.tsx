import VacationApp from "../../VacationsArea/Vacations/VacationApp";
import Header from "../Header/Header";
import Menu from "../Menu/Menu";
import Routing from "../Routing/Routing";
import "./Layout.css";

function Layout(): JSX.Element {
    return (
        <div className="Layout">
            <menu>
                <Menu />
            </menu>
            <hr />
            <header>
                <Header />
            </header>
            <main>
                <Routing />
            </main>
        </div>
    );
}

export default Layout;
