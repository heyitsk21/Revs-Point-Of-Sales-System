import React from 'react';
import './MenuItems.css';
import ManagerTopBar from '../components/ManagerTopBar';
import ManagerBottomBar from '../components/ManagerBottomBar';
import { TextSizeProvider } from '../components/TextSizeContext';
import './ManagerHome.css'

function ManagerHome() {

    return (
        <TextSizeProvider>
            <div >
                <ManagerTopBar/>
                    <div className='middleContent'>
                        Welcome HOME King and/or Queen!
                    </div>
                <ManagerBottomBar />
            </div>
        </TextSizeProvider>
    );
}

export default ManagerHome;
