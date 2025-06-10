https://github.com/ariafatah0711/zebar-glazewm

```
<div className="center">
                <div className="box">
                    {showSpotifyWidget ? <SpotifyWidget/> : null}
                    <i className="nf nf-md-calendar_month"></i>
                    <button className="clean-button">
                        {moment(output.date?.now).format('YYYY-MM-DD ddd | hh:mm:ss A |')}
                    </button>
                    {ShowActiveApp && output.glazewm ? <ActiveApp output={output} /> : null}
                </div>
            </div>
```
