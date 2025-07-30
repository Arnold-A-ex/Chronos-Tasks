import Nav from "./Nav.tsx";
import { Outlet } from "react-router-dom";
// import type { Dispatch, SetStateAction }  from "react";
import { useEffect, useRef, useState, } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";

interface Props{
    theme: string;
    changeTheme: () => void;
    currentUser: string;
    handleLogout: () => void;
}

export default function Layout({ changeTheme, theme, handleLogout, currentUser }: Props){
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const navRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const date = new Date();
    const fullDate = date.toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
  

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if(isOpen && navRef.current && !navRef.current.contains(e.target as Node) && buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick)

    }, [isOpen]);

    return(
        <Container fluid>
            <Row className="layout">
                <Col lg={3}  ref={ navRef } className={ `sidebar p-4 ${ isOpen ? "show-sidebar" : "hide-sidebar"}`}>
                    <Nav changeTheme={ changeTheme } theme={ theme } handleLogout={ handleLogout }/>
                </Col>
                <Button ref={ buttonRef } className="d-lg-none position-fixed top-0 start-0 m-3 z-3 navigator" onClick={ () => setIsOpen(prevOpen => prevOpen === false ? true : false) } >
                    <FaBars />
                </Button>
                <Col lg={9} className="main-content">
                    <div className="greeting p-2">
                        <h2 className="fw-bold">Hi, @{ currentUser }</h2>
                        <p className="fw-bold">{ fullDate }</p>
                    </div>
                    <Outlet />
                </Col>
            </Row>
        </Container>
    )
}