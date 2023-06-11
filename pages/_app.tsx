import Slide from '@mui/material/Slide';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import type { AppProps } from 'next/app';

import { SnackbarProvider } from 'notistack';

import { CacheProvider, EmotionCache } from '@emotion/react';

import createEmotionCache from '@/components/emotion/createEmotionCache';
import Transition from '@/components/layout/Transition';

import '@/styles/globals.scss';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

export default function App({ Component, emotionCache = clientSideEmotionCache, pageProps: { session, ...pageProps } }: MyAppProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CacheProvider value={emotionCache}>
                <SnackbarProvider
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    TransitionComponent={Slide}
                    preventDuplicate={true}
                >
                    <Transition>
                        <Component {...pageProps} />
                    </Transition>
                </SnackbarProvider>
            </CacheProvider>
        </LocalizationProvider>
    )
}