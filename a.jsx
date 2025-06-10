import React, { Children, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as zebar from 'zebar';
import SpotifyWidget from "./components/SpotifyWidget.jsx";
import GoogleSearch from "./components/GoogleSearch.jsx";
import Settings from "./components/Settings.jsx";
import Shortcut from "./components/Shortcut";
import ActiveApp from './components/ActiveApp.jsx';
import config from "./config.js";
import moment from "moment";

const providers = zebar.createProviderGroup({
    keyboard: { type: 'keyboard' },
    glazewm: { type: 'glazewm' },
    cpu: { type: 'cpu' },
    date: { type: 'date', formatting: 'EEE d MMM t' },
    battery: { type: 'battery' },
    memory: { type: 'memory' },
    weather: { type: 'weather' },
    host: { type: 'host' }
});

createRoot(document.getElementById('root')).render(<App/>);

function App() {
    const [output, setOutput] = useState(providers.outputMap);
    const [showSpotifyWidget, setShowSpotifyWidget] = useState(true);
    const [showGoogleSearch, setShowGoogleSearch] = useState(true);
    const [showShortcuts, setShowShortcuts] = useState(true);
    const [ShowActiveApp, setShowActiveApp] = useState(true);

    useEffect(() => {
        providers.onOutput(() => setOutput(providers.outputMap));
    }, []);

    function getBatteryIcon(batteryOutput) {
        if (batteryOutput.chargePercent > 90)
            return <i className="nf nf-fa-battery_4"></i>;
        if (batteryOutput.chargePercent > 70)
            return <i className="nf nf-fa-battery_3"></i>;
        if (batteryOutput.chargePercent > 40)
            return <i className="nf nf-fa-battery_2"></i>;
        if (batteryOutput.chargePercent > 20)
            return <i className="nf nf-fa-battery_1"></i>;
        return <i className="nf nf-fa-battery_0"></i>;
    }
    
    // debug
    console.log(output.glazewm)

    return (
        <div className="app">
            <div className="left">
                <div className="box">
                    <div className="logo">
                        <i className="nf nf-custom-windows"></i>
                        {/* {output.host?.hostname} | {output.host?.friendlyOsVersion} */}
                        {output.host?.hostname} |
                    </div>
                    {output.glazewm && (
                        <div className="workspaces">
                            {output.glazewm.currentWorkspaces.map(workspace => (
                                <button
                                    className={`workspace ${workspace.hasFocus && 'focused'} ${workspace.isDisplayed && 'displayed'}`}
                                    onClick={() =>
                                        output.glazewm.runCommand(
                                            `focus --workspace ${workspace.name}`,
                                        )
                                    }
                                    key={workspace.name}
                                >
                                    {workspace.displayName ?? workspace.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {showShortcuts && output.glazewm ? <div className="workspaces">
                    <Shortcut commandRunner={output.glazewm.runCommand}
                              commands={[
                                  `shell-exec ${config.edgePath}`
                              ]}
                              iconClass="nf-md-web" name="edge"
                    />
                    <Shortcut commandRunner={output.glazewm.runCommand}
                              commands={[
                                  `shell-exec ${config.powershellPath} -nologo`
                              ]}
                              iconClass="nf-cod-terminal_powershell" name="Powershell"
                    />
                </div> : null}
            </div>

            <div className="center">
                <div className="box">
                    {showSpotifyWidget ? <SpotifyWidget/> : null}
                    <i className="nf nf-md-calendar_month"></i>
                    {moment(output.date?.now).format('YYYY-MM-DD ddd | hh:mm A')}
                    {ShowActiveApp && output.glazewm ? <ActiveApp output={output} /> : null}
                </div>
            </div>

            <div className="right">
                {showGoogleSearch && output.glazewm ? <GoogleSearch
                    commandRunner={output.glazewm.runCommand} explorerPath={config.explorerPath}/> : null}
                <div className="box">
                    {output.glazewm && (
                        <>
                            {output.glazewm.bindingModes.map(bindingMode => (
                                <button
                                    className="binding-mode"
                                    key={bindingMode.name}
                                >
                                    {bindingMode.displayName ?? bindingMode.name}
                                </button>
                            ))}

                            <button
                                className={`tiling-direction nf ${output.glazewm.tilingDirection === 'horizontal' ? 'nf-md-swap_horizontal' : 'nf-md-swap_vertical'}`}
                                onClick={() =>
                                    output.glazewm.runCommand('toggle-tiling-direction')
                                }
                            ></button>
                        </>
                    )}

                    <Settings 
                        widgetObj={[
                            { name: 'Spotify', changeState: setShowSpotifyWidget },
                            { name: 'Google', changeState: setShowGoogleSearch },
                            { name: 'Shortcuts', changeState: setShowShortcuts },
                            { name: 'App', changeState: setShowActiveApp }
                        ]}
                        output={output}
                        additionalContent={
                            <>
 
                                

                                {/* battery */}
                                {output.battery && (
                                    <div className="battery">
                                        {/* Show icon for whether battery is charging. */}
                                        {output.battery.isCharging && (
                                            <i className="nf nf-md-power_plug charging-icon"></i>
                                        )}
                                        {getBatteryIcon(output.battery)}
                                        {Math.round(output.battery.chargePercent)}%
                                    </div>
                                )}

                            </>
                        }
                    />

                    {/* {<Settings widgetObj={[
                        { name: 'Spotify', changeState: setShowSpotifyWidget },
                        { name: 'Google', changeState: setShowGoogleSearch },
                        { name: 'Shortcuts', changeState: setShowShortcuts },
                        { name: 'App', changeState: setShowActiveApp}
                    ]}/>} */}
                </div>
            </div>
        </div>
    );
}
