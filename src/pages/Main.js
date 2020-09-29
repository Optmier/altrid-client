import React, { useState, useEffect } from 'react';
import HeaderBar from '../components/essentials/HeaderBar';
import { Element } from 'react-scroll';
import { Grid } from '@material-ui/core';
import '../styles/main_page.scss';
import CardRoot from '../components/essentials/CardRoot';
import CardLists from '../components/essentials/CardLists';
import CardAddNew from '../components/MainPage/CardAddNew';

function Main() {
    const [academyName, setAcademyName] = useState('에듀이티학원');

    return (
        <>
            <Element name="main_top_start" />
            <HeaderBar />
            <main className="main-page">
                <section className="decorator-root"></section>
                <section className="cards-uppder-deck">
                    <CardLists
                        upperDeck={
                            <>
                                <div className="introduce">
                                    <h2>에듀이티 클래스 관리 솔루션.</h2>
                                </div>
                                <div className="academy-name">
                                    <h4>{academyName} 클래스</h4>
                                </div>
                            </>
                        }
                        maxColumn={3}
                    >
                        <CardRoot>
                            <CardAddNew />
                        </CardRoot>
                        <CardRoot>class1</CardRoot>
                        <CardRoot>class2</CardRoot>
                    </CardLists>
                </section>
            </main>
        </>
    );
}

export default Main;
