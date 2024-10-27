import axios from 'axios';
import * as Globals from '../../../../Globals';

export default function LeagueUX() {

    const killUx = () => {
        axios.post(Globals.PROXY_PREFIX + '/riotclient/kill-ux')
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const restartUx = () => {
        axios.post(Globals.PROXY_PREFIX + '/riotclient/kill-and-restart-ux')
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const launchUx = () => {
        axios.post(Globals.PROXY_PREFIX + '/riotclient/launch-ux')
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };


    return (
        <div style={{
            height: '15%',
            width: '100%',
            overflow: 'hidden'
        }}>
            <div style={{
                height: '25%',
                width: '100%'
            }}>
                League UX Controls
            </div>
            <div style={{
                height: '75%',
                display: 'flex',
                width: '100%',
                flexDirection: 'row'
            }}>
                <div onClick={launchUx} style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    Launch UX Process
                </div>
                <div onClick={killUx} style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    Kill UX Process
                </div>
                <div onClick={restartUx} style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    Restart UX Process
                </div>
            </div>

        </div>
    );
}