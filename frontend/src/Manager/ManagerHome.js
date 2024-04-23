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
                <translate />
                    <div className='middleContent'>
                        Welcome Manager to Rev's!
                    </div>
                <ManagerBottomBar />
            </div>
        </TextSizeProvider>
    );
}

export default ManagerHome;
