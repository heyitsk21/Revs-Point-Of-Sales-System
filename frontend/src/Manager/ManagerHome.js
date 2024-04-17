import React from 'react';
import ManagerTopBar from '../components/ManagerTopBar';
import ManagerBottomBar from '../components/ManagerBottomBar';
import { TextSizeProvider } from '../components/TextSizeContext';
import './Manager.css'

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
