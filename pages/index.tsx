import React, {useEffect} from 'react';
import * as Globals from '../Globals';
import App from '../components/App';
import {Provider} from 'react-redux';
import {store} from '../store';
import Head from 'next/head';

export default function Index() {

    return (
        <div>
            <Head>
                <title>{Globals.BROWSER_TITLE}</title>
                <link rel="icon" href={`${Globals.STATIC_PREFIX}/assets/svg/icon.svg`}/>
            </Head>
            <Provider store={store}>
                <App/>
            </Provider>
        </div>
    );
}