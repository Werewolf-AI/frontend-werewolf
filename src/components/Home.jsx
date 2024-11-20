import React, { useEffect, useState } from "react";
import "./Home.css"
import PlayerView from "./PlayerView";

const Home = () => {
    const isStandalone = () => {
        return (window.matchMedia('(display-mode: standalone)').matches) || (navigator.standalone)
      }
    
      useEffect(() => {
        console.log('isstandalone', isStandalone())
      }, [isStandalone])

    return (
        <>
            {isStandalone && (
                <div className="container">
                    <div className="guide">
                    To continue, install this app on your device to easily access it anytime by adding to your homescreen. No app store or download required.  
                    </div>
                </div>
            )}
            {!isStandalone && (
                <PlayerView />
            )}
        </>
    )
}

export default Home;