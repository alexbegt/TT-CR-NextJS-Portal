import Box from '@mui/material/Box';

import PageHeader from '@/components/PageHeader/PageHeader';
import UnavailableBody from '@/components/code-redemption/unavailable/UnavailableBody';

import sharedStyles from '@/styles/shared.module.scss';

export default function Unavailable() {
    return (
        <div className={sharedStyles.container}>
            <Box className={sharedStyles.formPage}>
                <PageHeader
                    headerTitle='Code Redemption'
                    subTitle='Unavailable'
                />

                <UnavailableBody />
            </Box >
        </div >
    )
}