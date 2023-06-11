import Box from '@mui/material/Box';

import LookupBody from '@/components/code-redemption/lookup-codes/LookupCodesBody';
import PageHeader from '@/components/PageHeader/PageHeader';

import sharedStyles from '@/styles/shared.module.scss';

export default function LookupCodes() {
    return (
        <div className={sharedStyles.container}>
            <Box className={sharedStyles.formPage}>
                <PageHeader
                    headerTitle='Code Redemption'
                    subTitle='Look up codes'
                />

                <LookupBody />
            </Box>
        </div>
    )
}