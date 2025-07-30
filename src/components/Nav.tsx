// import type { Dispatch, SetStateAction } from "react";
// import {}
import { FaSun, FaMoon, FaHome, FaCalendarDay, FaUserAlt, FaBuilding, FaDumbbell, FaList } from "react-icons/fa"; // Import more icons
import { NavLink } from "react-router-dom"; // Import Link for navigation

interface Props{
    theme: string;
    changeTheme: () => void;
    handleLogout: () => void;
}

export default function Nav({ theme, changeTheme, handleLogout }: Props){
    return(
        <div className=" main-nav nav flex-column justify-content-center">
            <div className="d-flex justify-content-between align-items-center nav-header">
                <h5>Menu</h5>
                <button className="btn theme" onClick={ () => changeTheme() }>{ theme === "dark" ? <FaSun /> : <FaMoon /> } </button>
            </div>
            <ul className="nav flex-column gap-3"> {/* Use a ul for navigation list */}
                <li className="nav-item">
                    <NavLink to="/" className={({ isActive }) => isActive ?  ` active nav-link d-flex align-items-center gap-2 `: `nav-link d-flex align-items-center gap-2 ` }>
                        <FaHome /> All Tasks
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/today-tasks" className={ ({ isActive } ) => isActive ? `active nav-link d-flex align-items-center gap-2` : `nav-link d-flex align-items-center gap-2` } >
                        <FaCalendarDay /> Today's Activities
                    </NavLink>
                </li>
                <li className="nav-item">
                    <h5 className="mt-3 mb-2 text-secondary">Categories</h5>
                    <ul className="nav flex-column ps-3">
                        <li className="nav-item">
                            <NavLink to="/category/personal" className={ ({ isActive } ) => isActive ? "active nav-link d-flex align-items-center gap-2" : "nav-link d-flex align-items-center gap-2" } >
                                <FaUserAlt /> Personal
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/category/work" className={ ({ isActive } ) => isActive ? "active nav-link d-flex align-items-center gap-2" : "nav-link d-flex align-items-center gap-2" } >
                                <FaBuilding /> Work
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/category/workout" className={ ({ isActive } ) => isActive ? "active nav-link d-flex align-items-center gap-2" : "nav-link d-flex align-items-center gap-2" } >
                                <FaDumbbell /> Workout
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/category/other" className={ ({ isActive } ) => isActive ? "active nav-link d-flex align-items-center gap-2" : "nav-link d-flex align-items-center gap-2" } >
                                <FaList /> Other
                            </NavLink>
                        </li>
                    </ul>
                </li>
                <li className="nav-item mt-auto">
                    <button className="btn btn-secondary w-100 d-flex align-items-center justify-content-center gap-2 mt-auto" onClick={ () => handleLogout() }>
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    )
}