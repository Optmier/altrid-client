import React, { useState, useEffect } from 'react';
import { Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { NavLink, Route } from 'react-router-dom';
import ResponsiveDrawer from '../../components/AdminMainPage/ResponsiveDrawer';
import AdminMembersPage from '../../components/AdminMainPage/AdminMembersPage';
import ContentsRequests from '../../components/AdminMainPage/ContentsRequests';
import MakeContents from './components/MakeContents';

const menuLists = [
    {
        link: '/admins/members',
        name: '관리자 멤버 목록',
        icon: <InboxIcon />,
    },
    {
        link: '/admins/contents-requests',
        name: '컨텐츠 요청 목록',
        icon: <MailIcon />,
    },
];

function AdminMain({ history, match }) {
    const [barTitle, setBarTitle] = useState('메뉴 타이틀');
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setMobileOpen(open);
    };

    const menuClick = (e) => {
        setBarTitle(e);
        setMobileOpen(false);
    };

    const itemStyle = {
        color: '#333333',
        fontFamily: "'Noto Sans KR', sans-serif",
        textDecoration: 'none',
    };

    const activeItemStyle = {
        color: '#2c7b6c',
        fontWeight: 600,
    };

    const menus = (
        <>
            <Divider />
            <List>
                {menuLists.map(({ link, name, icon }, idx) => (
                    <NavLink key={idx} to={link} style={itemStyle} activeStyle={activeItemStyle}>
                        <ListItem
                            button
                            onClick={() => {
                                menuClick(name);
                            }}
                        >
                            {icon ? <ListItemIcon>{icon}</ListItemIcon> : false}
                            <ListItemText primary={name} />
                        </ListItem>
                    </NavLink>
                ))}
            </List>
        </>
    );

    useEffect(() => {
        // console.log(match);
        // if (history.location.pathname.includes('/admins')) {
        //     if (!menuLists.filter((item) => item.link === history.location.pathname).length) {
        //         history.replace(menuLists[0].link);
        //     }
        // }
    }, [history.location]);

    return (
        <>
            <div>
                <ResponsiveDrawer drawerLists={menus} title={barTitle} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}>
                    <Route path="/admins/members" component={AdminMembersPage} />
                    <Route path="/admins/contents-requests" component={ContentsRequests} exact />
                    <Route path="/admins/contents-requests/:id" component={MakeContents} exact />
                </ResponsiveDrawer>
            </div>
        </>
    );
}

export default AdminMain;
