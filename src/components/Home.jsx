import React, { useEffect, useState } from "react";
import "./Home.css"
import PlayerView from "./PlayerView";
import { isStandalone } from "is-standalone";

const Home = () => {
    // const [isStandalone, setIsStandalone] = useState(false)
    const checkStandalone = () => {
    return (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone)
    }

    
    // useEffect(() => {
    //     const handleIsStandalone = () => {
    //         const check = checkStandalone()
    //         if (check) {
    //             setIsStandalone(true)
    //         } else {
    //             setIsStandalone(false)
    //         }
    //     }
    //     document.addEventListener('DOMContentLoaded', handleIsStandalone)

    //     return () => {
    //         document.removeEventListener('DOMContentLoaded', handleIsStandalone)
    //       };
    // }, [])
    
    useEffect(() => {
        console.log('isstandalone', isStandalone)
    }, [isStandalone])

    return (
        <>
            {/* {isStandalone && (
                <div className="container">
                    <div className="guide">
                        {isStandalone ? 'true' : 'false'}
                    To continue, install this app on your device to easily access it anytime by adding to your homescreen. No app store or download required.  
                    </div>
                </div>
            )}
            {!isStandalone && ( */}
            <div className="App">
                <div className='overlay'></div>
                <div className='content'>
                    <PlayerView />
                </div>
            </div>
            {/* )} */}
        </>
    )
}

export default Home;