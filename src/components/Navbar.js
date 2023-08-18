import { useCallback } from "react";
import { Dropdown, Navbar as BootstrapNavbar } from "react-bootstrap";


import { Link, NavLink, useResolvedPath } from "react-router-dom";
import logo from '../static/MediCaseNav.svg'
import styles from './common/common.module.scss'
import { useAppStore } from "../lib/store";
import { BiUser } from "react-icons/bi";
import { MdOutlineManageAccounts } from 'react-icons/md'
import { GoChecklist, GoBook } from 'react-icons/go'
import { FaLanguage } from "react-icons/fa";
import { MdOutlineAccountCircle } from "react-icons/md";
import { TbMessageLanguage } from "react-icons/tb";
import { GoSignOut } from "react-icons/go";

const iconSize = 36

const learningItem = {
    route: "user/content",
    display: "Learning",
    icon: <GoBook size={iconSize} />
}

const adminItem = {
    route: "user/admin",
    display: "Admin",
    icon: <MdOutlineManageAccounts size={iconSize} />
}

const moderatorItem = {
    display: "Moderator",
    icon: <GoChecklist size={iconSize} />,
    children: [
        {
            display: 'Learning Translations',
            route: '/site/user/mod/editor',
            icon: <FaLanguage size={26} className="me-2" />
        },
        {
            display: 'Languages',
            route: '/site/user/mod/languages',
            icon: <TbMessageLanguage size={26} className="me-2" />
        },
    ]
}




export function Navbar({ className }) {
    const user = useAppStore(store => store.user)
    const isContent = useResolvedPath().pathname.split('/').includes('content')

    if (user === null) return (
        <div className={`d-flex p-2 bg-white ${className}`}>
            <MedicaseBrand />
            <UserButton />
        </div>
    )

    if (isContent) return (
        <BootstrapNavbar className={`bg-white shadow p-2 px-3 px-sm-1 px-md-4 d-none d-lg-flex ${className}`} style={{ zIndex: 5 }}>
            <MedicaseBrand />
            <NavbarButtons user={user} className="d-flex" />
            <UserButton className="ms-auto " />
        </BootstrapNavbar>
    )

    return (
        <BootstrapNavbar className={`bg-white shadow p-2 px-3 px-sm-1 px-md-4 ${className}`} style={{ zIndex: 5 }}>
            <MedicaseBrand className='d-none d-lg-block' />
            <NavbarIcons user={user} className="d-lg-none flex-fill d-flex justify-content-between" />
            <NavbarButtons user={user} className="d-none d-lg-flex" />
            <UserButton className={`d-none d-lg-block ms-auto`} />
        </BootstrapNavbar>
    )
}

function NavbarButtons({ user, className = '' }) {

    const classes = ({ isActive, isPending }) => `btn btn-primary nav-item
    px-3 py-2 mx-2 rounded-3 text-white ${isActive ? 'btn-secondary' : ``}`
    return (
        <div className={`${className}`}>
            {user.isUser &&
                <NavLink to={learningItem.route} className={classes}>
                    {learningItem.display}
                </NavLink>
            }
            {user.isModerator &&
                <ModeratorDropdown classes={classes} />
            }
            {user.isAdmin &&
                <NavLink to={adminItem.route} className={classes}>
                    {adminItem.display}
                </NavLink>
            }
        </div>
    )
}

function NavbarIcons({ user, className = '' }) {

    const classes = `px-1 px-sm-3 btn`

    return (
        <div className={`${className}`}>
            {user.isUser &&
                <NavLink to={learningItem.route} className={classes}>
                    {learningItem.icon}
                </NavLink>
            }
            {user.isModerator &&
                <ModeratorDropdown classes={classes} icon={true} />
            }
            {user.isAdmin &&
                <NavLink to={adminItem.route} className={classes}>
                    {adminItem.icon}
                </NavLink>
            }
            <UserButton />
        </div>
    )
}

function MedicaseBrand({ className = '' }) {

    return (
        <Link to='/site' className={`nav-link my-2 ${className}`}>
            <BootstrapNavbar.Brand>
                <img
                    src={logo}
                    alt={'Medicase'}
                    width="145" height="30" className="d-inline-block align-top mb-0" />
            </BootstrapNavbar.Brand>
        </Link>
    )
}


function UserButton({ className = '' }) {
    const user = useAppStore(store => store.user)
    const { logoutUser } = useAppStore()
    const handleLogout = useCallback(() => {
        logoutUser()
    }, [logoutUser])

    if (user == null) {
        return (<></>)
    } else {
        return (
            <Dropdown className={`${className} d-flex justify-content-center`} align="end">
                <Dropdown.Toggle className={`rounded-5 text-dark ${styles.nocaret}`}>
                    <div className="d-inline-block m-0 p-0 fw-bold">
                        <BiUser className="m-1 text-white" size={24} />
                    </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="bg-secondary animate slideIn">
                    <Link to={"user"} className="dropdown-item text-white">
                        <MdOutlineAccountCircle className="me-2 text-white" />
                        {user.firstName}
                    </Link>
                    <Link to={"user/options"} className="dropdown-item text-white">
                        <TbMessageLanguage className="me-2" />
                        Language
                    </Link>
                    <div className='dropdown-item text-white' onClick={handleLogout}>
                        <GoSignOut className="me-2" />
                        Logout
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

function ModeratorDropdown({ classes, icon = false }) {

    return (
        <Dropdown >
            {icon ?
                <Dropdown.Toggle variant="white" className={`${styles.nocaret} ${classes}`}>
                    {moderatorItem.icon}
                </Dropdown.Toggle>
                :
                <Dropdown.Toggle variant="primary" className={`${styles.nocaret} ${classes}`}>
                    {moderatorItem.display}
                </Dropdown.Toggle>
            }
            <Dropdown.Menu className="bg-primary animate slideIn">
                    {moderatorItem.children.map((item, index) => {
                        return (
                            <Link className='dropdown-item text-white' key={index} to={item.route}>{item.icon}{item.display}</Link>
                        )
                    })}
            </Dropdown.Menu>
        </Dropdown>
    )
}